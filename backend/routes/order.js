import express from "express";
import { isSignedIn, wrapAsync } from "../middleware.js";
import { saveOrder } from "../controllers/order.js";

const router = express.Router();

/** Saving Orders */
router.post("/orders", isSignedIn, wrapAsync(saveOrder));


export default router;