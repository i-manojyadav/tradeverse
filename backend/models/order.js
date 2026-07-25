import mongoose from "mongoose";
import { Schema } from "mongoose";


const orderSchema = new Schema ({
    symbol: {
        type: String,
        required: true,
    },
    mode: {
        type: String,
        enum: ["TRADE", "INVEST"],
        required: true,
    },
    type: {
        type: String,
        default: "LIMIT",
        enum: ["LIMIT", "STOP_LOSS"],
        required: true,
    },
    side: {
        type: String,
        enum: ["BUY", "SELL"],
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    },
    entryPrice: {
        type: Number,
        required: true,
    },
    leverage: {
        type: Number,
        min: 1,
        max: 100,
        default: 1,
        required: true,
    },
    liquidationPrice: {
        type: Number,
        required: true,
    },
    stopLoss: {
        type: Number,
    },
    status: {
        type: String,
        enum: ["PENDING", "EXECUTED", "CANCELLED"],
        default: "PENDING",
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
});


const Order = mongoose.model("Order", orderSchema);

export default Order;