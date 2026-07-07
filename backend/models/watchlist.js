import mongoose from "mongoose";
import { Schema } from "mongoose";

const watchlistSchema = new Schema({
    title: {
        type: String,
        trim: true,
        required: true,
    },
    symbols: [{
        type: String,
        trim: true,
        uppercase: true,
    }],
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
    }
});


const Watchlist = mongoose.model("Watchlist", watchlistSchema);


export default Watchlist;