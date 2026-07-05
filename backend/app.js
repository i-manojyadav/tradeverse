import express from "express";
import mongoose from "mongoose";
import passport from "passport";
import localStrategy from "passport-local";
import passportLocalMongoose from "passport-local-mongoose";

import User from "./models/user.js";
import Wallet from "./models/wallet.js";

const app = express();

app.use(express.urlencoded({extended: true}));
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.listen(3000, () => {
    console.log("Listening...");
});

const databaseURL = "mongodb://127.0.0.1:27017/tradeverse";

main()
.then(() => {
    console.log("Databade connected");
})
.catch((err) => {
    console.log("Database connection failed:", err);
});

async function main() {
    await mongoose.connect(databaseURL);
}


/** Sign Up */

app.post("/signup", async (req, res) => {
    const { name, email, username, password } = req.body;
    const newUser = new User({ name, email, username, password });
    let registeredUser = await User.register(newUser, password);

    // Create Wallet

    const wallet = new Wallet({
        user: registeredUser._id
    });

    await wallet.save();
    res.redirect("localhost:5173/signin");
});

/** Sign In */

app.post("/signin", passport.authenticate("local", {failureRedirect: "localhost:5173/signin"}), (req, res) => {
    console.log(req.body);
    res.redirect("localhost:5173/signin");
});
