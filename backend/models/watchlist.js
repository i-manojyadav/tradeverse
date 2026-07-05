import mongoose from "mongoose";
import { Schema } from "mongoose";

const watchlistSchema = new Schema({
    symbol: {
        type: String,
        required: true,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
    }
});


const Watchlist = mongoose.model("Watchlist", watchlistSchema);


export default Watchlist;