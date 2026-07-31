import mongoose from "mongoose";
import { Schema } from "mongoose";

const positionSchema = new Schema({
    symbol: {
        type: String,
        required: true,
    },
    mode: {
        type: String,
        enum: ["TRADE", "INVEST"],
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
    averagePrice: {
        type: Number,
        min: 0,
        required: true,
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
    stopLoss: {
        type: Number,
        default: null,
    },
    executedAt: {
        type: Date,
        required: true,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
    }
});

const Position = mongoose.model("Position", positionSchema);


export default Position;