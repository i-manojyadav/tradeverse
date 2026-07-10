import mongoose from "mongoose";
import { Schema } from "mongoose";

const positionSchema = new Schema({
    side: {
        type: String,
        required: true,
    },
    symbol: {
        type: String,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    },
    averageBuy: {
        type: Number,
        required: true,
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