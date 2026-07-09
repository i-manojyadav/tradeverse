import mongoose from "mongoose";
import { Schema } from "mongoose";

const holdingSchema = new Schema ({
    symbol: {
        type: String,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    },
    average: {
        type: Number,
        required: true,
    },
    executedAt: {
        type: Date,
        required: true,
    },
    updatedAt: {
        type: Date,
        required: true,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
    }
});


const Holding = mongoose.model("Holding", holdingSchema);

export default Holding;