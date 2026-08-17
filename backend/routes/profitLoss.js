import express from "express";
import mongoose from "mongoose";
import passport from "passport";
import Holding from "../models/holding.js";
import Position from "../models/position.js";
import { isSignedIn, wrapAsync } from "../middleware.js";
import { getPnL } from "../controllers/profitLoss.js";

const router = express.Router();

/** Profit & Loss */
router.get("/profit-loss", isSignedIn, wrapAsync(getPnL));


export default router;