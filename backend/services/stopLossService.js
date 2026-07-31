import mongoose from "mongoose";
import Order from "../models/order.js";
import Position from "../models/position.js";
import createTransaction from "./transactionService.js";


/** Create Stop Loss Order */

const createSLOrder = async (order) => {

    const tradeSide = order.side === "BUY" ? "SELL" : order.side === "SELL" ? "BUY" : "";
    const triggerPrice = order.stopLoss ? `${order.stopLoss}` : `${order.liquidationPrice}`;

    const stopLossOrder = new Order({
        type: "STOP_LOSS",
        symbol: order.symbol,
        mode: order.mode,
        side: tradeSide,
        quantity: order.quantity,
        price: triggerPrice,
        leverage: order.leverage,
        liquidationPrice: order.liquidationPrice,
        stopLoss: order.stopLoss,
        status: "PENDING",
        createdAt: new Date(),
        parentOrder: order._id,
        user: order.user,
    });

    await stopLossOrder.save();
}



/** Handle STOP_LOSS Orders */

const handleStopLoss = async (coins) => {
    const orders = await Order.find({type: "STOP_LOSS", status: "PENDING"});

    if (!orders) return;

    for (const order of orders) {
        const coin = coins.find((c) => {
            return c.symbol.toUpperCase() === order.symbol.toUpperCase();
        });

        if (!coin) continue;

        if (order.side === "BUY") {
            if (coin.lastPrice >= order.liquidationPrice || (order.stopLoss && coin.lastPrice >= order.stopLoss)) {
                order.status = "EXECUTED";
                order.createdAt = new Date();

                await createTransaction(order);
                await order.save();

                if (order.mode === "TRADE") {
                    const position = await Position.findOne({ user: order.user, symbol: order.symbol });

                    if (position) {
                        await Position.deleteOne({ _id: position._id });
                    }
                }
            }

        } else if (order.side === "SELL") {
            if (coin.lastPrice <= order.liquidationPrice || (order.stopLoss && coin.lastPrice <= order.stopLoss)) {
                order.status = "EXECUTED";
                order.createdAt = new Date();

                await createTransaction(order);
                await order.save();

                if (order.mode === "TRADE") {

                    const position = await Position.findOne({ user: order.user, symbol: order.symbol });
                    
                    if (position) {
                        await Position.deleteOne({ _id: position._id });
                    }
                }
            }
        }
    }
}


export { createSLOrder, handleStopLoss };