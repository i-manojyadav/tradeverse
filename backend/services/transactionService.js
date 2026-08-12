import mongoose from "mongoose";
import Order from "../models/order.js";
import Transaction from "../models/transaction.js";
import updateWallet from "./walletService.js";


const createTransaction = async (order) => {

    let amount = (order.price * order.quantity) / order.leverage;

    if (order.mode === "INVEST") {
        amount = order.price * order.quantity;

    } else if (order.mode === "TRADE") {

        if (order.type === "LIMIT") {
            amount = amount;

        } else if (order.type === "STOP_LOSS" || order.type === "TARGET") {

            const mainOrder = await Order.findOne({ _id: order.parentOrder });

            amount = (mainOrder.price * order.quantity) / order.leverage;

            if (mainOrder.side === "BUY" && order.side === "SELL") {
                let pnl = (order.price - mainOrder.price) * order.quantity;
                amount += pnl;

            } else if (mainOrder.side === "SELL" && order.side === "BUY") {
                let pnl = (mainOrder.price - order.price) * order.quantity;
                amount += pnl;
            }
        }
    }

    const transaction = await new Transaction ({
        symbol: order.symbol,
        mode: order.mode,
        type: order.type,
        side: order.side,
        quantity: order.quantity,
        averagePrice: order.price,
        leverage: order.leverage,
        amount: amount,
        order: order._id,
        user: order.user,
    });

    await updateWallet(order, transaction);
    await transaction.save();
}


export default createTransaction;