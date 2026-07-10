import CryptoData from "./cryptoAPI.js";
import mongoose from "mongoose";
import Order from "../models/order.js";
import Holding from "../models/holding.js";
import Position from "../models/position.js";



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

    for (const order of orders) {
        const coin = coins.find((c) => {
            return c.symbol.toUpperCase() === order.symbol.toUpperCase();
        });

        if (!coin) continue;

        if (order.side === "BUY") {
            if (order.price >= coin.askPrice) {
                order.status = "EXECUTED";
                await order.save();

                if (order.type === "INTRADAY") {
                    const position = new Position({
                        side: order.side,
                        symbol: order.symbol,
                        quantity: order.quantity,
                        averageBuy: order.price,
                        executedAt: new Date(),
                        user: order.user,
                    });

                    await position.save();

                } else if (order.type === "LONGTERM") {

                    const holding = await Holding.findOne({ user: order.user, symbol: order.symbol});

                    if (holding) {
                        const totalQuantity = holding.quantity + order.quantity;
                        holding.averageBuy = ((holding.averageBuy * holding.quantity) + (order.price * order.quantity)) / totalQuantity;

                        holding.quantity = totalQuantity;

                        await holding.save();

                    } else {
                        await Holding.create({
                            symbol: order.symbol,
                            quantity: order.quantity,
                            averageBuy: order.price,
                            executedAt: new Date(),
                            updatedAt: new Date(),
                            user: order.user,
                        });
                    }
                }
            }
        } else if (order.side === "SELL") {
            if (order.price <= coin.bidPrice) {
                order.status = "EXECUTED";
                await order.save();

                if (order.type === "INTRADAY") {
                    const position = new Position({
                        side: order.side,
                        symbol: order.symbol,
                        quantity: order.quantity,
                        averageBuy: order.price,
                        executedAt: new Date(),
                        user: order.user,
                    });

                    await position.save();
                }
            }
        }
    }

}


export default orderMatch;