import User from "../models/user.js";
import Watchlist from "../models/watchlist.js";



/** Craete Watchlist */
export const createWatchlist = async (req, res) => {
    const newWatchlist = new Watchlist(req.body);
    newWatchlist.user = req.user._id;
    await newWatchlist.save();
    const userWatchlist = await Watchlist.find({user: req.user._id}).select("title coins _id");
    res.status(201).json({
        message: "Watchlist created successfully",
        watchlist: userWatchlist,
    });
};

/** Add Coin in Watchlist */
export const addCoin = async (req, res) => {
    const { id } = req.params;
    const { coinSymbol } = req.body;

    const watchlist = await Watchlist.findOne({ _id: id, "coins.symbol": coinSymbol});

    if (watchlist) {
        const userWatchlist = await Watchlist.find({user: req.user._id}).select("title coins _id");

        res.status(400).json({
            message: "Coin already in watchlist",
            watchlist: userWatchlist,
        });

    } else {
        const curWatchlist = await Watchlist.findByIdAndUpdate(id, { $addToSet: { coins: { symbol: coinSymbol }}});
        await curWatchlist.save();
        const userWatchlist = await Watchlist.find({user: req.user._id}).select("title coins _id");

        res.status(201).json({
            message: "Coin added to watchlist",
            watchlist: userWatchlist,
        });
    };
};

/** Remove Coin from Watchlist */
export const removeCoin = async (req, res) => {
    const { id } = req.params;
    const { coin } = req.body;

    await Watchlist.findByIdAndUpdate(id, {$pull: {coins: {symbol: coin}}});
    const userWatchlist = await Watchlist.find({user: req.user._id}).select("title coins _id");

    res.status(200).json({
        message: "Coin removed from watchlist",
        watchlist: userWatchlist,
    });
};