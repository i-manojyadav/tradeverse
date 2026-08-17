import mongoose from "mongoose";
import Order from "../models/order.js";
import Position from "../models/position.js";
import createTransaction from "./transactionService.js";


/** Create Target Order */

const createTargetOrder = async (order) => {

    const tradeSide = order.side === "BUY" ? "SELL" : order.side === "SELL" ? "BUY" : "";

    const targetOrder = new Order({
        type: "TARGET",
        symbol: order.symbol,
        mode: order.mode,
        side: tradeSide,
        quantity: order.quantity,
        price: order.target,
        leverage: order.leverage,
        liquidationPrice: order.liquidationPrice,
        target: order.target,
        status: "PENDING",
        createdAt: new Date(),
        parentOrder: order._id,
        user: order.user,
    });

    await targetOrder.save();
} 



/** Handle TARGET Orders */

const handleTargetOrders = async (coins) => {
    const orders = await Order.find({ type: "TARGET", status: "PENDING" });

    if (!orders) return;

    for (const order of orders) {
        const coin = coins.find((c) => {
            return c.symbol.toUpperCase() === order.symbol.toUpperCase();
        });

        if (!coin) continue;

        if (order.side === "BUY") {
            if (coin.lastPrice <= order.target) {
                order.status = "EXECUTED";
                order.createdAt = new Date();

                await createTransaction(order);
                await order.save();

                if (order.mode === "TRADE") {
                    const position = await Position.findOne({ status: "OPEN", user: order.user, symbol: order.symbol });

                    if (position) {
                        position.exitPrice = order.target;
                        position.pnl = (position.entryPrice - order.target) * position.quantity;
                        position.status = "CLOSED";
                        position.closedAt = new Date();
                        await position.save();

                        const slOrder = await Order.findOne({ symbol: order.symbol, type: "STOP_LOSS"});
                        if (!slOrder) return;
                        slOrder.status = "CANCELLED";
                        await slOrder.save();
                    }
                }
            }

        } else if (order.side === "SELL") {
            if (coin.lastPrice >= order.target) {
                order.status = "EXECUTED";
                order.createdAt = new Date();

                await createTransaction(order);
                await order.save();

                if (order.mode === "TRADE") {
                    const position = await Position.findOne({ status: "OPEN", user: order.user, symbol: order.symbol });

                    if (position) {
                        position.exitPrice = order.target;
                        position.pnl = (order.target - position.entryPrice) * position.quantity;
                        position.status = "CLOSED";
                        position.closedAt = new Date();
                        await position.save();

                        const slOrder = await Order.findOne({ symbol: order.symbol, type: "STOP_LOSS"});
                        if (!slOrder) return;
                        slOrder.status = "CANCELLED";
                        await slOrder.save();
                    }
                }
            }
        }
    }
}


export { createTargetOrder, handleTargetOrders };