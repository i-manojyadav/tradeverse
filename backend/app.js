import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import session from "express-session";
import passport from "passport";
import localStrategy from "passport-local";
import passportLocalMongoose from "passport-local-mongoose";

import User from "./models/user.js";

import userRoute from "./routes/user.js";
import watchlistRoute from "./routes/watchlist.js";
import orderRoute from "./routes/order.js";

import orderMatch from "./services/orderMatcher.js";

const app = express();

const sessionOptions = {
    secret: "secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: 7 * 24 * 3600 * 100,
        maxAge: new Date(Date.now() + 7 * 24 * 3600 * 100),
        httpOnly: true,
    }
}

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));
app.use(express.json());
app.use(session(sessionOptions));
app.use(passport.initialize());
app.use(passport.session());
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


// Routes

app.use("/", userRoute);
app.use("/", watchlistRoute);
app.use("/", orderRoute);
orderMatch();