import express from "express";
import { isSignedIn, wrapAsync } from "../middleware.js";
import { addCoin, createWatchlist, removeCoin } from "../controllers/watchlist.js";

const router = express.Router();

// Create Watchlist
router.post("/watchlist/create", isSignedIn, wrapAsync());

// Add Coin
router.post("/watchlist/:id/add", isSignedIn, wrapAsync(addCoin));

// Remove Coin
router.post("/watchlist/:id/remove", isSignedIn, wrapAsync(removeCoin));


export default router;