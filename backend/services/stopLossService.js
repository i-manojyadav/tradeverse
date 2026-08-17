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

                let tradeExitPrice = 0;
                if (coin.lastPrice >= order.liquidationPrice) {
                    tradeExitPrice = order.liquidationPrice;

                } else if (order.stopLoss) {
                    if (coin.lastPrice >= order.stopLoss) {
                        tradeExitPrice = order.stopLoss;
                    }
                }

                await createTransaction(order);
                await order.save();

                if (order.mode === "TRADE") {
                    const position = await Position.findOne({ status: "OPEN", user: order.user, symbol: order.symbol });

                    if (position) {
                        position.exitPrice = tradeExitPrice;
                        position.pnl = (position.entryPrice - order.tradeExitPrice) * position.quantity;
                        position.status = "CLOSED";
                        position.closedAt = new Date();
                        await position.save();

                        const tgtOrder = await Order.findOne({ symbol: order.symbol, type: "TARGET" });
                        if (!tgtOrder) return;
                        tgtOrder.status = "CANCELLED";
                        await tgtOrder.save();
                    }
                }
            }

        } else if (order.side === "SELL") {
            if (coin.lastPrice <= order.liquidationPrice || (order.stopLoss && coin.lastPrice <= order.stopLoss)) {
                order.status = "EXECUTED";
                order.createdAt = new Date();

                let tradeExitPrice = 0;
                if (coin.lastPrice <= order.liquidationPrice) {
                    tradeExitPrice = order.liquidationPrice;

                } else if (order.stopLoss) {
                    if (coin.lastPrice <= order.stopLoss) {
                        tradeExitPrice = order.stopLoss;
                    }
                }

                await createTransaction(order);
                await order.save();

                if (order.mode === "TRADE") {

                    const position = await Position.findOne({ status: "OPEN", user: order.user, symbol: order.symbol });
                    
                    if (position) {
                        position.exitPrice = tradeExitPrice;
                        position.pnl = (tradeExitPrice - position.entryPrice) * position.quantity;
                        position.status = "CLOSED";
                        position.closedAt = new Date();
                        await position.save();

                        const tgtOrder = await Order.findOne({ symbol: order.symbol, type: "TARGET" });
                        if (!tgtOrder) return;
                        tgtOrder.status = "CANCELLED";
                        await tgtOrder.save();
                    }
                }
            }
        }
    }
}


export { createSLOrder, handleStopLoss };