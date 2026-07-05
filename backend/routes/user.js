import express from "express";
import passport from "passport";
import User from "../models/user.js";
import Wallet from "../models/wallet.js";

const router = express.Router();

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

router.post("/signin", passport.authenticate("local", {failureRedirect: "localhost:5173/signin"}), async (req, res) => {
    res.status(201).json({
        message: "User Signed In",
        user: {
            name: req.user.name,
        }
    });
});


// Sign Out

router.post("/signout", async(req, res, next) => {
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