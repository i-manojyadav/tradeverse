import express from "express";
import User from "../models/user.js";
import Order from "../models/order.js";
import { isSignedIn } from "../middleware.js";

const router = express.Router();

/** Saving Orders */

router.post("/orders", isSignedIn, async (req, res) => {
    const order = new Order(req.body);
    if (order.mode === "TRADE" && order.side === "BUY") {
        order.liquidationPrice = order.entryPrice * (1 - 1 / order.leverage);
    } else if (order.mode === "TRADE" && order.side === "SELL") {
        order.liquidationPrice = order.entryPrice * (1 + 1 / order.leverage);
    } else {
        order.liquidationPrice = 0;
    }
    order.user = req.user._id;
    await order.save();

    const userOrders = await Order.find({user: req.user._id}).sort({ createdAt: -1 });
    res.status(201).json({
        message: "Order placed",
        orders: userOrders,
    });
});


/** ORDER PRICE MATCHING ( PENDING -> EXECUTED ) */



export default router;