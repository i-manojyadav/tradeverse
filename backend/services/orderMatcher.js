import CryptoData from "./cryptoAPI.js";
import mongoose from "mongoose";
import Wallet from "../models/wallet.js";
import Order from "../models/order.js";
import Holding from "../models/holding.js";
import Position from "../models/position.js";
import Transaction from "../models/transaction.js";
import createTransaction from "./transactionService.js";
import { createSLOrder, handleStopLoss } from "./stopLossService.js";
import { createTargetOrder, handleTargetOrders } from "./targetService.js";

/** Update Coin Price Live */

//let coins = [];

/*const fetchData = async () => {
    try {
        const { cryptoCoins, status, retryAfter } = await CryptoData();

        if (status === 418) {
            const waitTime = Number(retryAfter) * 1000;
            console.log("Waiting:", waitTime, "ms");

            setTimeout(fetchData, waitTime);
            return;
        }

        if (!Array.isArray(cryptoCoins)) {
            setTimeout(fetchData, 10000);
            return;
        }

        coins = cryptoCoins;
        setTimeout(fetchData, 10000);
        orderMatch();

    } catch (err) {
        console.log(err);
        setTimeout(fetchData, 10000);
    }
}

fetchData();*/




/** Order Matching ( PENDING -> EXECUTION )  */

const orderMatch = async (coins) => {

    const orders = await Order.find({status: "PENDING", type: "LIMIT"});

    await handleTargetOrders(coins);
    await handleStopLoss(coins);

    for (const order of orders) {

        const coin = coins.find((c) => {
            return c.symbol.toUpperCase() === order.symbol.toUpperCase();
        });

        
        if (!coin) continue;

        if (order.side === "BUY") {
            if (Number(order.price) >= Number(coin.askPrice)) {
                order.status = "EXECUTED";

                await order.save();
                await createTransaction(order);

                if (order.mode === "TRADE" && order.target !== null) {
                    await createTargetOrder(order);
                }

                if (order.mode === "TRADE" && order.leverage > 1) {
                    await createSLOrder(order);
                }


                if (order.mode === "TRADE") {

                    const position = await Position.findOne({ status: "OPEN", user: order.user, symbol: order.symbol });

                    if (position) {

                        if (position.side === "BUY") {
                            const newQty = position.quantity + order.quantity;
                            position.entryPrice = ((position.entryPrice * position.quantity) + (order.price * order.quantity)) / newQty;
                            position.quantity = newQty;
                            await position.save();

                        } else if (position.side === "SELL") {
                            console.log("You already have a open position")
                        }

                    } else {

                        await Position.create({
                            symbol: order.symbol,
                            side: order.side,
                            quantity: order.quantity,
                            entryPrice: order.price,
                            leverage: order.leverage,
                            marginUsed: (order.price * order.quantity) / order.leverage,
                            liquidationPrice: order.liquidationPrice,
                            target: order.target,
                            stopLoss: order.stopLoss,
                            executedAt: new Date(),
                            user: order.user,
                        });
                    }

                } else if (order.mode === "INVEST") {

                    const holding = await Holding.findOne({ status: "OPEN", user: order.user, symbol: order.symbol});

                    if (holding) {
                        const newQty = holding.quantity + order.quantity;
                        holding.averageBuy = ((holding.averageBuy * holding.quantity) + (order.price * order.quantity)) / newQty;
                        holding.totalQuantity += order.quantity;
                        holding.quantity = newQty;
                        await holding.save();

                    } else {

                        await Holding.create({
                            symbol: order.symbol,
                            totalQuantity: order.quantity,
                            quantity: order.quantity,
                            averageBuy: order.price,
                            executedAt: new Date(),
                            user: order.user,
                        });
                    }
                }
            }


        } else if (order.side === "SELL") {

            if (Number(order.price) <= Number(coin.bidPrice)) {
                order.status = "EXECUTED";
                
                await order.save();
                await createTransaction(order);

                if (order.mode === "TRADE" && order.target !== null) {
                    await createTargetOrder(order);
                }

                if (order.mode === "TRADE" && order.leverage > 1) {
                    await createSLOrder(order);
                }

                if (order.mode === "TRADE") {

                    const position = await Position.findOne({ status: "OPEN", user: order.user, symbol: order.symbol });

                    if (position) {

                        if (position.side === "SELL") {
                            const newQty = position.quantity + order.quantity;
                            position.entryPrice = ((position.entryPrice * position.quantity) + (order.price * order.quantity)) / newQty;
                            position.quantity = newQty;
                            await position.save();
                        }

                    } else {

                        await Position.create({
                            symbol: order.symbol,
                            side: order.side,
                            quantity: order.quantity,
                            entryPrice: order.price,
                            leverage: order.leverage,
                            marginUsed: (order.price * order.quantity) / order.leverage,
                            liquidationPrice: order.liquidationPrice,
                            target: order.target,
                            stopLoss: order.stopLoss,
                            executedAt: new Date(),
                            user: order.user,
                        });
                    }

                } else if (order.mode === "INVEST") {

                    const holding = await Holding.findOne({ status: "OPEN", user: order.user, symbol: order.symbol });

                    if (holding) {

                        const newQty = holding.quantity - order.quantity;

                        let newExitPrice = order.price;

                        if (newQty < 0) {
                            console.log("Insufficient Holding Quantity");
                            return;
                        }

                        if (holding.totalSoldQty > 0) {
                            const newTotalSoldQty = holding.totalSoldQty + order.quantity;
                            newExitPrice = ((holding.exitPrice * holding.totalSoldQty) + (order.price * order.quantity)) / newTotalSoldQty;
                        }

                        holding.quantity = newQty;
                        holding.totalSoldQty += order.quantity;
                        holding.exitPrice = newExitPrice;
                        holding.pnl += (order.price - holding.averageBuy) * order.quantity;

                        if (newQty === 0) {
                            holding.status = "CLOSED",
                            holding.closedAt = new Date();
                        }

                        await holding.save();

                    } else {
                        console.log("You don't have the asset to sell.");
                    }
                }
            }
        }
    }

}


export default orderMatch;