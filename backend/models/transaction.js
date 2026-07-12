import mongoose from "mongoose";
import { Schema } from "mongoose";

const transactionSchema = new Schema({
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
    averagePrice: {
        type: Number,
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    walletEffect: {
        type: String,
        enum: ["CREDIT", "DEBIT"],
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    order: {
        type: Schema.Types.ObjectId,
        ref: "Order"
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
});


const Transaction = mongoose.model("Transaction", transactionSchema);

export default Transaction;