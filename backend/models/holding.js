import mongoose from "mongoose";
import { Schema } from "mongoose";

const holdingSchema = new Schema ({
    symbol: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        default: "OPEN",
        enum: ["OPEN", "CLOSED"],
        required: true,
    },
    totalQuantity: {
        type: Number,
        min: 0,
        required: true,
    },
    quantity: {
        type: Number,
        min: 0,
        required: true,
    },
    totalSoldQty: {
        type: Number,
        min: 0,
        default: null,
    },
    averageBuy: {
        type: Number,
        min: 0,
        required: true,
    },
    exitPrice: {
        type: Number,
        min: 0,
    },
    pnl: {
        type: Number,
        default: 0,
    },
    executedAt: {
        type: Date,
        required: true,
    },
    closedAt: {
        type: Date,
        default: null,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
    }
});


const Holding = mongoose.model("Holding", holdingSchema);

export default Holding;