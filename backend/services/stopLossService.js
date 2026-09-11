import Order from "../models/order.js";
import Position from "../models/position.js";
import createTransaction from "./transactionService.js";


// Create Stop Loss Order
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
    const orders = await Order.find({ type: "STOP_LOSS", status: "PENDING" });

    if (orders.length === 0) return;

    for (const order of orders) {
        await processOrder(order, coins);
    }
}


// Process Order
const processOrder = async (order, coins) => {
    const coin = coins.find((c) => {
        return c.symbol?.toUpperCase() === order.symbol?.toUpperCase();
    });

    if (!coin) return;

    if (!isPriceMatched(order, coin)) return;

    await executeOrder(order, coin);
}

// Price Matching
const isPriceMatched = (order, coin) => {
    const price = Number(coin.lastPrice);
    const liquidationPrice = Number(order.liquidationPrice);
    const stopLoss = Number(order.stopLoss);

    if (order.side === "BUY") {
        return price >= liquidationPrice || (stopLoss > 0 && price >= stopLoss);
    }

    if (order.side === "SELL") {
        return price <= liquidationPrice || (stopLoss > 0 && price <= stopLoss);
    }

    return false;
}


// Execute Order
const executeOrder = async (order, coin) => {
    const price = Number(coin.lastPrice);
    const liquidationPrice = Number(order.liquidationPrice);
    const stopLoss = Number(order.stopLoss);

    let tradeExitPrice = 0;

    if (order.side === "BUY") {
        tradeExitPrice = price >= liquidationPrice ? liquidationPrice : stopLoss;
    }

    if (order.side === "SELL") {
        tradeExitPrice = price <= liquidationPrice ? liquidationPrice : stopLoss;
    }

    const isCreated = await createTransaction(order);
    if (!isCreated) return;

    const executed = await executePosition(order, tradeExitPrice);
    if (!executed) return;

    order.status = "EXECUTED";
    order.createdAt = new Date();

    await cancelTargetOrder(order);
    await order.save();
}

// Execute Position
const executePosition = async(order, tradeExitPrice) => {
    const position = await Position.findOne({ status: "OPEN", user: order.user, symbol: order.symbol });

    if (!position) return false;

    position.exitPrice = tradeExitPrice;

    if (position.side === "BUY") {
        position.pnl = (tradeExitPrice - Number(position.entryPrice)) * Number(position.quantity);

    } else if (position.side === "SELL") {
        position.pnl = (Number(position.entryPrice) - tradeExitPrice) * position.quantity;
    }

    position.status = "CLOSED";
    position.closedAt = new Date();

    await position.save();
    return true;
}


// Cancel Target Order
const cancelTargetOrder = async(order) => {
    const targetOrder = await Order.findOne({ status: "PENDING", user: order.user, type: "TARGET", parentOrder: order.parentOrder });
    if (!targetOrder) return;
    targetOrder.status = "CANCELLED";
    await targetOrder.save();
}


export { createSLOrder, handleStopLoss };