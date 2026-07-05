import mongoose from "mongoose";
import { Schema } from "mongoose";

const holdingSchema = new Schema ({
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
    investment: {
        min: 1,
        type: Number,
        required: true,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
    }

});


const Holding = mongoose.model("Holding", holdingSchema);

export default Holding;