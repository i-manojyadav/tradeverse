import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import session from "express-session";
import MongoStore from "connect-mongo";
import passport from "passport";
import localStrategy from "passport-local";
import passportLocalMongoose from "passport-local-mongoose";

import User from "./models/user.js";

import userRoute from "./routes/user.js";
import watchlistRoute from "./routes/watchlist.js";
import orderRoute from "./routes/order.js";
import profitLossRoute from './routes/profitLoss.js';

import orderMatch from "./services/orderMatcher.js";

const app = express();

const databaseURL = process.env.ATLAS_DB_URL;

const store = MongoStore.create({
    mongoUrl: databaseURL,
    crypto: {
        secret: process.env.SESSION_SECRET,
    },
    touchAfter: 24 * 3600,
});

store.on("error", () => {
    console.log(error);
});

const sessionOptions = {
    store,
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: new Date(Date.now() + 7 * 24 * 3600 * 100),
        secure: true,
        httpOnly: true,
        sameSite: "none",
    }
}

app.use(cors({
    origin: "https://tradeverse-fg4e.onrender.com",
    credentials: true,
}));
app.use(express.json());
app.use(session(sessionOptions));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
    console.log("Listening...");
});


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


// Routes

app.use("/", userRoute);
app.use("/", watchlistRoute);
app.use("/", orderRoute);
app.use("/", profitLossRoute);
orderMatch();