import mongoose from "mongoose";
import { Schema } from "mongoose";

const positionSchema = new Schema({
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
        min: 0,
        required: true,
    },
    averagePrice: {
        type: Number,
        min: 0,
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