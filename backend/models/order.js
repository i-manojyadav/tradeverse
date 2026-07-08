import mongoose from "mongoose";
import { Schema } from "mongoose";


const orderSchema = new Schema ({
    symbol: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        enum: ["INTRADAY", "LONGTERM"],
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
    price: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: ["PENDING", "EXECUTED"],
        default: "PENDING",
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
});


const Order = mongoose.model("Order", orderSchema);

export default Order;