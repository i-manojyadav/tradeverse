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

                    const position = await Position.findOne({ user: order.user, symbol: order.symbol });

                    if (position) {

                        if (position.side === "BUY") {
                            const newQty = position.quantity + order.quantity;
                            position.averagePrice = ((position.averagePrice * position.quantity) + (order.price * order.quantity)) / newQty;
                            position.quantity = newQty;
                            await position.save();

                        } else if (position.side === "SELL") {
                            const newQty = position.quantity - order.quantity;

                            if (newQty > 0) {
                                position.quantity = newQty;
                                await position.save();

                            } else if (newQty === 0) {
                                await Position.deleteOne({_id: position._id});
                            } else {
                                position.side = order.side;
                                position.quantity = Math.abs(newQty);
                                position.averagePrice = order.price;
                                await position.save();
                            }
                        }

                    } else {

                        await Position.create({
                            symbol: order.symbol,
                            type: order.type,
                            side: order.side,
                            quantity: order.quantity,
                            averagePrice: order.price,
                            executedAt: new Date(),
                            user: order.user,
                        });
                    }

                } else if (order.type === "LONGTERM") {

                    const holding = await Holding.findOne({ user: order.user, symbol: order.symbol});

                    if (holding) {
                        const newQty = holding.quantity + order.quantity;
                        holding.averageBuy = ((holding.averageBuy * holding.quantity) + (order.price * order.quantity)) / newQty;
                        holding.quantity = newQty;
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

                    const position = await Position.findOne({ user: order.user, symbol: order.symbol });

                    if (position) {

                        if (position.side === "SELL") {
                            const newQty = position.quantity + order.quantity;
                            position.averagePrice = ((position.averagePrice * position.quantity) + (order.price * order.quantity)) / newQty;
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
                                position.averagePrice = order.price;

                                await position.save();
                            }
                        }

                    } else {

                        await Position.create({
                            symbol: order.symbol,
                            type: order.type,
                            side: order.side,
                            quantity: order.quantity,
                            averagePrice: order.price,
                            executedAt: new Date(),
                            user: order.user,
                        });
                    }

                } else if (order.type === "LONGTERM") {

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


export default orderMatch;