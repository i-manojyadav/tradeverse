import mongoose from "mongoose";
import { Schema } from "mongoose";

const walletSchema = new Schema({
    funds: {
        type: Number,
        min: 0,
        default: 1000000,
        required: true,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true,
    }
});

const Wallet = mongoose.model("Wallet", walletSchema, "wallet");


export default Wallet;