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

import http from "node:http";
import { Server } from "socket.io";
import { setupSocket } from "./sockets/socket.js";

import User from "./models/user.js";

import userRoute from "./routes/user.js";
import watchlistRoute from "./routes/watchlist.js";
import orderRoute from "./routes/order.js";
import profitLossRoute from './routes/profitLoss.js';

const app = express();

const databaseURL = process.env.ATLAS_DB_URL;

const store = MongoStore.create({
    mongoUrl: databaseURL,
    crypto: {
        secret: process.env.SESSION_SECRET,
    },
    touchAfter: 24 * 3600,
});

store.on("error", (error) => {
    console.log(error);
});

const sessionOptions = {
    store,
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 7 * 24 * 60 * 60 * 1000,
        secure: true,
        httpOnly: true,
        sameSite: "none",
    }
}

const allowedOrigins = [
    "http://localhost:5173",
    "https://tradeverse-fg4e.onrender.com",
]

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true,
}));
app.set("trust proxy", 1);
app.use(express.json());
app.use(session(sessionOptions));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

/** Socket.io Setup */
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: (origin, callback) => {
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error("Not allowed by CORS"));
            }
        },
        credentials: true,
    },
});


const PORT = process.env.PORT || 3000;

server.listen(PORT, "0.0.0.0", () => {
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


setupSocket(io);