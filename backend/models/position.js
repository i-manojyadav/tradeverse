import mongoose from "mongoose";
import { Schema } from "mongoose";

const positionSchema = new Schema({
    symbol: {
        type: String,
        required: true,
    },
    side: {
        type: String,
        enum: ["BUY", "SELL"],
        required: true,
    },
    quantity: {
        type: Number,
        min: 0,
        required: true,
    },
    entryPrice: {
        type: Number,
        min: 0,
        required: true,
    },
    exitPrice: {
        type: Number,
        min: 0,
    },
    leverage: {
        type: Number,
        min: 1,
        max: 100,
        required: true,
    },
    marginUsed: {
        type: Number,
        required: true,
    },
    liquidationPrice: {
        type: Number,
        required: true,
    },
    target: {
        type: Number,
        default: null,
    },
    stopLoss: {
        type: Number,
        default: null,
    },
    pnl: {
        type: Number,
        default: null,
    },
    status: {
        type: String,
        enum: ["OPEN", "CLOSED"],
        default: "OPEN",
        required: true,
    },
    executedAt: {
        type: Date,
        required: true,
    },
    closedAt: {
        type: Date,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
    }
});

const Position = mongoose.model("Position", positionSchema);


export default Position;