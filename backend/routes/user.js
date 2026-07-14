import express from "express";
import passport from "passport";
import User from "../models/user.js";
import Wallet from "../models/wallet.js";
import Order from "../models/order.js";
import Holding from "../models/holding.js";
import Position from "../models/position.js";
import Watchlist from "../models/watchlist.js";
import Transaction from "../models/transaction.js";
import { isSignedIn } from "../middleware.js";

const router = express.Router();

// Is Signed In ?

router.get("/user", async (req, res) => {
    if (!req.user) {
        return res.status(404).json({
            user: null,
        });
    }

    const userWallet = await Wallet.findOne({user: req.user._id}).select("funds");
    const userOrders = await Order.find({user: req.user._id}).sort({ createdAt: -1 });
    const userHoldings = await Holding.find({user: req.user._id});
    const userPositions = await Position.find({user: req.user._id});
    const userWatchlist = await Watchlist.find({user: req.user._id}).select("title coins _id");
    const userTransactions = await Transaction.find({user: req.user._id}).sort({ createdAt: -1 });

    res.json({
        message: "Signed in",
        user: {
            name: req.user.name,
            email: req.user.email,
            username: req.user.email,
        },
        wallet: userWallet,
        orders: userOrders,
        holdings: userHoldings,
        positions: userPositions,
        watchlist: userWatchlist,
        transactions: userTransactions,
    });
});

// Sign Up

router.post("/signup", async (req, res) => {
    const { name, email, username, password } = req.body;

    const newUser = new User({ name, email, username, password });
    let registeredUser = await User.register(newUser, password);

    // Create Wallet

    const wallet = new Wallet({
        user: registeredUser._id
    });

    await wallet.save();

    res.status(201).json({
        message: "User created",
    });
});


// Sign In

router.post("/signin", async (req, res, next) => {

    passport.authenticate("local", (err, user, info) => {
        if (err) return next(err);

        if (!user) {
            return res.json(401).json({
                message: "Username or password invalid",
            });
        }

        req.logIn(user, async (err) => {
            if(err) return next(err);

            const userWallet = await Wallet.findOne({user: user._id}).select("funds");
            const userOrders = await Order.find({user: user._id}).sort({ createdAt: -1 });
            const userHoldings = await Holding.find({user: user._id});
            const userPositions = await Position.find({user: user._id});
            const userWatchlist = await Watchlist.find({user: user._id}).select("title coins _id");
            const userTransactions = await Transaction.find({user: user._id}).sort({ createdAt: -1 });

            return res.json({
                message: "User Signed In",
                user: {
                    name: user.name,
                    email: user.email,
                    username: user.username,
                },
                wallet: userWallet,
                orders: userOrders,
                holdings: userHoldings,
                positions: userPositions,
                watchlist: userWatchlist,
                transactions: userPositions,
            });
        });
    }) (req, res, next);
});


// Sign Out

router.post("/signout", isSignedIn, async(req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
    });

    res.json({
        message: "Signed Out Successfully",
    });
});


export default router;