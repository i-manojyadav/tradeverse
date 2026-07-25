import CryptoData from "./cryptoAPI.js";
import mongoose from "mongoose";
import Wallet from "../models/wallet.js";
import Order from "../models/order.js";
import Holding from "../models/holding.js";
import Position from "../models/position.js";
import Transaction from "../models/transaction.js";



/** Update Coin Price Live */

let coins = [];
const fetchData = async () => {
    try {
        const data = await CryptoData();
        coins = data;
        orderMatch();
    } catch (err) {
        console.log(err);
    }
}

fetchData();

setInterval(fetchData, 5000);


/** Order Matching ( PENDING -> EXECUTION )  */

const orderMatch = async () => {
    const orders = await Order.find({status: "PENDING"});

    await handleStopLossOrders();

    for (const order of orders) {
        const coin = coins.find((c) => {
            return c.symbol.toUpperCase() === order.symbol.toUpperCase();
        });

        if (!coin) continue;

        if (order.type === "STOP_LOSS") {
            continue;
        }

        if (order.side === "BUY") {
            if (order.entryPrice >= coin.askPrice) {
                order.status = "EXECUTED";
                await order.save();
                createTransaction(order);

                if (order.mode === "TRADE" && order.leverage > 1) {
                    await createSLOrder(order);
                }

                if (order.mode === "TRADE") {

                    const position = await Position.findOne({ user: order.user, symbol: order.symbol });

                    if (position) {

                        if (position.side === "BUY") {
                            const newQty = position.quantity + order.quantity;
                            position.averagePrice = ((position.averagePrice * position.quantity) + (order.entryPrice * order.quantity)) / newQty;
                            position.quantity = newQty;
                            await position.save();

                        } else if (position.side === "SELL") {
                            const newQty = position.quantity - order.quantity;

                            if (newQty > 0) {
                                position.quantity = newQty;
                                await position.save();

                            } else if (newQty === 0) {
                                await Position.deleteOne({ _id: position._id });
                            } else {
                                position.side = order.side;
                                position.quantity = Math.abs(newQty);
                                position.averagePrice = order.entryPrice;
                                await position.save();
                            }
                        }

                    } else {

                        await Position.create({
                            symbol: order.symbol,
                            mode: order.mode,
                            side: order.side,
                            quantity: order.quantity,
                            averagePrice: order.entryPrice,
                            leverage: order.leverage,
                            marginUsed: (order.entryPrice * order.quantity) / order.leverage,
                            liquidationPrice: order.liquidationPrice,
                            executedAt: new Date(),
                            user: order.user,
                        });
                    }

                } else if (order.mode === "INVEST") {

                    const holding = await Holding.findOne({ user: order.user, symbol: order.symbol});

                    if (holding) {
                        const newQty = holding.quantity + order.quantity;
                        holding.averageBuy = ((holding.averageBuy * holding.quantity) + (order.entryPrice * order.quantity)) / newQty;
                        holding.quantity = newQty;
                        await holding.save();

                    } else {

                        await Holding.create({
                            symbol: order.symbol,
                            quantity: order.quantity,
                            averageBuy: order.entryPrice,
                            executedAt: new Date(),
                            updatedAt: new Date(),
                            user: order.user,
                        });
                    }
                }
            }


        } else if (order.side === "SELL") {

            if (order.entryPrice <= coin.bidPrice) {
                order.status = "EXECUTED";
                await order.save();
                createTransaction(order);

                if (order.mode === "TRADE" && order.leverage > 1) {
                    await createSLOrder(order);
                }

                if (order.mode === "TRADE") {

                    const position = await Position.findOne({ user: order.user, symbol: order.symbol });

                    if (position) {

                        if (position.side === "SELL") {
                            const newQty = position.quantity + order.quantity;
                            position.averagePrice = ((position.averagePrice * position.quantity) + (order.entryPrice * order.quantity)) / newQty;
                            position.quantity = newQty;
                            await position.save();

                        } else if (position.side === "BUY") {
                            const newQty = position.quantity - order.quantity;
                            
                            if (newQty > 0) {
                                position.quantity = newQty;
                                await position.save();

                            } else if (newQty === 0) {
                                await Position.deleteOne({_id: position._id});
                            } else {
                                position.side = order.side;
                                position.quantity = Math.abs(newQty);
                                position.averagePrice = order.entryPrice;

                                await position.save();
                            }
                        }

                    } else {

                        await Position.create({
                            symbol: order.symbol,
                            mode: order.mode,
                            side: order.side,
                            quantity: order.quantity,
                            averagePrice: order.entryPrice,
                            leverage: order.leverage,
                            marginUsed: (order.entryPrice * order.quantity) / order.leverage,
                            liquidationPrice: order.liquidationPrice,
                            executedAt: new Date(),
                            user: order.user,
                        });
                    }

                } else if (order.mode === "INVEST") {

                    const holding = await Holding.findOne({ user: order.user, symbol: order.symbol });

                    if (holding) {

                        const newQty = holding.quantity - order.quantity;

                        if (newQty > 0) {
                            holding.quantity = newQty;
                            await holding.save();

                        } else if (newQty === 0) {
                            await Holding.deleteOne({_id: holding._id});

                        } else {
                            console.log("Insufficient Holding Quantity");
                        }
                    }
                }
            }
        }
    }

}


/** Create Transaction */
const createTransaction = async (order) => {

    const transaction = await new Transaction ({
        symbol: order.symbol,
        mode: order.mode,
        type: order.type,
        side: order.side,
        quantity: order.quantity,
        averagePrice: order.entryPrice,
        amount: order.entryPrice * order.quantity,
        order: order._id,
        user: order.user,
    });

    const orderValue = order.entryPrice * order.quantity;
    const marginUsed = orderValue / order.leverage;


    /** Update Wallet Funds */
    const wallet = await Wallet.findOne({ user: order.user });

    if (order.mode === "TRADE") {

        const position = await Position.findOne({ user: order.user, symbol: order.symbol });

        if (!position || position.side === order.side) {
            wallet.funds -= marginUsed;
            transaction.walletEffect = "DEBIT";
            
        } else {
            wallet.funds += marginUsed;
            transaction.walletEffect = "CREDIT";
        }

        await wallet.save();

    } else if (order.mode ==="INVEST") {

        const holding = await Holding.findOne({ user: order.user, symbol: order.symbol });
        
        if (order.side === "BUY") {
            wallet.funds -= orderValue;
            transaction.walletEffect = "DEBIT";

        } else if (order.side === "SELL") {
            if (!holding) {
                console.log("Can not sell. No holding found");
                return;

            }

            if (holding.quantity > order.quantity) {
                console.log("Insufficient quantity.");
                return;
            }

            wallet.funds += orderValue;
            transaction.walletEffect = "CREDIT";
            
        }

        await wallet.save();

    }

    await transaction.save();

}


/** Create StopLoss Order */

const createSLOrder = async (order) => {

    const orderSide = order.side === "BUY" ? "SELL" : order.side === "SELL" ? "BUY" : "";

    const stopLossOrder = new Order({
        type: "STOP_LOSS",
        symbol: order.symbol,
        mode: order.mode,
        side: orderSide,
        quantity: order.quantity,
        entryPrice: order.entryPrice,
        leverage: order.leverage,
        liquidationPrice: order.liquidationPrice,
        stopLoss: order.stopLoss,
        status: "PENDING",
        createdAt: new Date(),
        user: order.user,
    });

    await stopLossOrder.save();
}

/** Handle StopLoss Orders */

const handleStopLossOrders = async () => {
    const orders = await Order.find({type: "STOP_LOSS", status: "PENDING"});

    if (!orders) return;

    for (const order of orders) {
        const coin = coins.find((c) => {
            return c.symbol.toUpperCase() === order.symbol.toUpperCase();
        });

        if (!coin) continue;

        if (order.side === "BUY") {
            if (order.liquidationPrice <= coin.lastPrice) {
                order.status = "EXECUTED";

                if (order.mode === "TRADE") {
                    const position = await Position.findOne({ user: order.user, symbol: order.symbol });

                    if (position) {
                        await Position.deleteOne({ _id: position._id });

                        await order.save();
                        await createTransaction(order);
                    }
                }
            }

        } else if (order.side === "SELL") {
            if (order.liquidationPrice >= coin.lastPrice) {
                order.status = "EXECUTED";

                if (order.mode === "TRADE") {

                    const position = await Position.findOne({ user: order.user, symbol: order.symbol });
                    
                    if (position) {
                        await Position.deleteOne({ _id: position._id });

                        await order.save();
                        await createTransaction(order);
                    }
                }
            }
        }
    }
}


export default orderMatch;