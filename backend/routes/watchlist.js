import express from "express";
import User from "../models/user.js";
import Watchlist from "../models/watchlist.js";
import { isSignedIn } from "../middleware.js";

const router = express.Router();

// Create Watchlist
router.post("/watchlist/create", isSignedIn, async (req, res) => {
    const newWatchlist = new Watchlist(req.body);
    newWatchlist.user = req.user._id;
    await newWatchlist.save();
    res.status(201).json({
        message: "Watchlist Created",
    });
});


// Add Symbol
router.post("/watchlist/:id/add", async (req, res) => {
    const { id } = req.params;
    const { coinSymbol } = req.body;

    const curWatchlist = await Watchlist.findByIdAndUpdate(id, { $addToSet: {symbols: coinSymbol}})

    await curWatchlist.save();

    const userWatchlist = await Watchlist.find({user: req.user._id}).select("title symbols _id");

    res.status(201).json({
        message: "Symbol added",
        watchlist: userWatchlist,
    });
});


export default router;