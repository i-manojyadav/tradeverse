import express from "express";
import passport from "passport";
import { isSignedIn, wrapAsync } from "../middleware.js";
import { isSignIn, signIn, signOut, signUp } from "../controllers/user.js";

const router = express.Router();

// Is Signed In ?
router.get("/user", wrapAsync(isSignIn));

// Sign Up
router.post("/signup", wrapAsync(signUp));

// Sign In
router.post("/signin", wrapAsync(signIn));

// Sign Out
router.post("/signout", isSignedIn, wrapAsync(signOut));


export default router;