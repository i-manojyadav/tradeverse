import Order from "../models/order.js";
import Holding from "../models/holding.js";
import Position from "../models/position.js";
import createTransaction from "./transactionService.js";
import { createSLOrder, handleStopLoss } from "./stopLossService.js";
import { createTargetOrder, handleTargetOrders } from "./targetService.js";



// Order Matching
const orderMatch = async (coins) => {

    await handleTargetOrders(coins);
    await handleStopLoss(coins);

    const orders = await Order.find({ status: "PENDING", type: "LIMIT" });

    if (orders.length === 0) return;

    for (const order of orders) {
        await processOrder(order, coins);
    }

}



// Process Order
const processOrder = async (order, coins) => {
    const coin = coins.find((c) => {
        return c.symbol.toUpperCase() === order.symbol.toUpperCase();
    });

    if (!coin) return;

    if (!isPriceMatched(order, coin)) return;

    const isValid = await validateOrder(order);

    if (!isValid) {
        return;
    }

    await executeOrder(order);
}

// Price Matching
const isPriceMatched = (order, coin) => {
    if (order.side === "BUY") {
        return Number(order.price) >= Number(coin.askPrice);
    }

    if (order.side === "SELL") {
        return Number(order.price) <= Number(coin.bidPrice);
    }

    return false;
}

// Validate Order
const validateOrder = async (order) => {

    if (order.mode === "TRADE") {
        const position = await Position.findOne({ status: "OPEN", user: order.user, symbol: order.symbol });

        if (!position) {
            return true;
        }

        if (position.side === order.side) {
            return true;
        }

        console.log(`Can't execute ${order.side} order. Existing position is open`);

        return false;
    }
    

    if (order.mode === "INVEST" && order.side === "SELL") {
        const holding = await Holding.findOne({ status: "OPEN", user: order.user, symbol: order.symbol });

        if (!holding) {
            console.log(`Can't see ${order.symbol}. Holding not found.`);

            order.status = "CANCELLED";
            await order.save();

            return false;
        }

        if (Number(holding.quantity) < Number(order.quantity)) {
            console.log(`Insuffcient holding quantity.`);

            order.status = "CANCELLED";
            await order.save();

            return false;
        }
    }

    return true;
}

// Execute Order
const executeOrder = async (order) => {

    const isCreated = await createTransaction(order);
    if (!isCreated) return;

    // Create target order
    if (order.mode === "TRADE" && order.target !== null) {
        await createTargetOrder(order);
    }

    // Create stop-loss order
    if (order.mode === "TRADE" && Number(order.leverage) > 1) {
        await createSLOrder(order);
    }

    // Update portfolio
    if (order.mode === "TRADE") {
        await updatePosition(order);

    } else if (order.mode === "INVEST") {
        await updateHolding(order);
    }

    order.status = "EXECUTED";
    await order.save();
}

// Handle Position
const updatePosition = async (order) => {
    const position = await Position.findOne({ status: "OPEN", user: order.user, symbol: order.symbol });

    if (!position) {
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

        return;
    }

    if (position.side !== order.side) {
        console.log(`Can't add ${order.side} order to ${position.side} position.`);

        order.status = "CANCELLED";
        await order.save();

        return;
    }

    const newQty = Number(position.quantity) + Number(order.quantity);
    const newEntryPrice = (Number(position.entryPrice) * Number(position.quantity) + Number(order.price) * Number(order.quantity)) / newQty;

    position.entryPrice = newEntryPrice;
    position.quantity = newQty;

    await position.save();
}

// Handle Holding
const updateHolding = async (order) => {
    
    if (order.side === "BUY") {
        await handleHoldingBuy(order);
        return;
    }

    if (order.side === "SELL") {
        await handleHoldingSell(order);
        return;
    }

    console.log(`Invalid order side: ${order.side}`);
};

// Handle Holding BUY
const handleHoldingBuy = async (order) => {

    const holding = await Holding.findOne({ status: "OPEN", user: order.user, symbol: order.symbol });

    if (!holding) {
        await Holding.create({
            symbol: order.symbol,
            totalQuantity: order.quantity,
            quantity: order.quantity,
            averageBuy: order.price,
            executedAt: new Date(),
            user: order.user,
        });

        return;
    }


    // Update existing holding
    const oldQuantity = Number(holding.quantity);
    const orderQuantity = Number(order.quantity);

    const newQty = oldQuantity + orderQuantity;

    const newAverageBuy = (Number(holding.averageBuy) * oldQuantity + Number(order.price) * order.quantity) / newQty;

    holding.averageBuy = newAverageBuy;
    holding.totalQuantity = Number(holding.totalQuantity || 0) + orderQuantity;
    holding.quantity = newQty;

    await holding.save();
}

// Handle Holding SELL
const handleHoldingSell = async (order) => {

    const holding = await Holding.findOne({ status: "OPEN", user: order.user, symbol: order.symbol });

    if (!holding) {
        console.log(`You don't have ${order.symbol} to sell.`);

        order.status = "CANCELLED";
        await order.save();

        return;
    }

    const holdingQuantity = Number(holding.quantity || 0);
    const orderQuantity = Number(order.quantity || 0);

    if (orderQuantity > holdingQuantity) {
        console.log(`Insufficient ${order.symbol} quantity.`);

        order.status = "CANCELLED";
        await order.save();
        
        return;
    }

    const newQty = holdingQuantity - orderQuantity;

    const totalSoldQty = Number(holding.totalSoldQty || 0);
    const previousExitPrice = Number(holding.exitPrice || 0);

    let newExitPrice = Number(order.price);

    if (totalSoldQty > 0) {
        const newTotalSoldQty = totalSoldQty + orderQuantity;
        newExitPrice = (previousExitPrice * totalSoldQty + Number(order.price) * orderQuantity) / newTotalSoldQty;
    }

    const orderPnL = (Number(order.price) - Number(holding.averageBuy)) * orderQuantity;

    holding.quantity = newQty;
    holding.totalSoldQty = totalSoldQty + orderQuantity;
    holding.exitPrice = newExitPrice;
    holding.pnl = Number(holding.pnl || 0) + orderPnL;

    if (newQty === 0) {
        holding.status = "CLOSED";
        Holding.closedAt = new Date();
    }

    await holding.save();
}


export default orderMatch;