import express from "express";
import User from "../models/user.js";
import Order from "../models/order.js";
import { isSignedIn } from "../middleware.js";

const router = express.Router();

/** Saving Orders */

router.post("/orders", isSignedIn, async (req, res) => {
    const order = new Order(req.body);
    order.user = req.user._id;
    await order.save();

    const userOrders = await Order.find({user: req.user._id});
    res.status(201).json({
        message: "Order placed",
        orders: userOrders,
    });
});


/** ORDER PRICE MATCHING ( PENDING -> EXECUTED ) */



export default router;