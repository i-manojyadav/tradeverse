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
        min: 1,
        type: Number,
        required: true,
    },
    average: {
        type: Number,
        required: true,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
    }
});

const Position = mongoose.model("Position", positionSchema);


export default Position;