import express from "express";
import mongoose from "mongoose";
import passport from "passport";
import Holding from "../models/holding.js";
import Position from "../models/position.js";
import { isSignedIn } from "../middleware.js";
import e from "express";

const router = express.Router();

router.get("/profit-loss", isSignedIn, async (req, res) => {
    const closedPositions = await Position.find({ user: req.user._id, status: "CLOSED" });

    res.status(201).json({
        message: "Profit & Loss statement fetched",
        positions: closedPositions,
    });
});



export default router;