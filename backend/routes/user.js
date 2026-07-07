import express from "express";
import passport from "passport";
import User from "../models/user.js";
import Wallet from "../models/wallet.js";
import Watchlist from "../models/watchlist.js";
import { isSignedIn } from "../middleware.js";

const router = express.Router();

// Is Signed In ?

router.get("/user", async (req, res) => {
    if (!req.user) {
        return res.status(404).json({
            user: null,
        });
    }

    const userWatchlist = await Watchlist.find({user: req.user._id}).select("title symbols _id");

    res.json({
        message: "Signed in",
        user: {
            name: req.user.name,
            email: req.user.email,
            username: req.user.email,
        },
        watchlist: userWatchlist,
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

            const userWatchlist = await Watchlist.find({user: user._id}).select("title symbols _id");

            return res.json({
                message: "User Signed In",
                user: {
                    name: user.name,
                    email: user.email,
                    username: user.username,
                },
                watchlist: userWatchlist,
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