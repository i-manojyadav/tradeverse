import Order from "../models/order.js";
import Position from "../models/position.js";
import createTransaction from "./transactionService.js";


// Create Target Order
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


/** Handle TARGET Orders **/

const handleTargetOrders = async (coins) => {
    const orders = await Order.find({ type: "TARGET", status: "PENDING" });

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
    const targetPrice = Number(order.target);

    if (order.side === "BUY") {
        return price <= targetPrice;
    }

    if (order.side === "SELL") {
        return price >= targetPrice;
    }

    return false;
}

// Execute Order
const executeOrder = async (order) => {
    const isCreated = await createTransaction(order);
    if (!isCreated) return;

    const executed = await executePosition(order);
    if (!executed) return;

    order.status = "EXECUTED";
    order.createdAt = new Date();

    await cancelStopLossOrder(order);
    await order.save();
}

// Execute Position
const executePosition = async (order) => {
    const position = await Position.findOne({ status: "OPEN", user: order.user, symbol: order.symbol });

    const entryPrice = Number(position.entryPrice);
    const targetPrice = Number(order.target);
    const quantity = Number(order.quantity);

    if (!position) return false;

    position.exitPrice = targetPrice;

    if (position.side === "BUY") {
        position.pnl = (targetPrice - entryPrice) * quantity;

    } else if (position.side === "SELL") {
        position.pnl = (entryPrice - targetPrice) * quantity;
    }

    position.status = "CLOSED";
    position.closedAt = new Date();

    await position.save();
    return true;
}

// Cancel Stop Loss Order
const cancelStopLossOrder = async(order) => {
    const stopLossOrder = await Order.findOne({ status: "PENDING", user: order.user, type: "STOP_LOSS", parentOrder: order.parentOrder });
    if (!stopLossOrder) return;
    stopLossOrder.status = "CANCELLED";
    await stopLossOrder.save();
}


export { createTargetOrder, handleTargetOrders };