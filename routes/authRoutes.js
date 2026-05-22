import express from 'express';
import { googleLoginSuccess } from "../controllers/authController.js";
import passport from 'passport';

const router=express.Router();

router.get("/google", //sends the user to google auth page
    passport.authenticate(
        "google", //strategy
        {
            scope:["profile","email"]
        }
    )
);
router.get("/google/callback", //after passport verifies,if success the redirect to success page else login page
    passport.authenticate(
        "google",
        {
            failureRedirect:"/login" //if failed
        }
    ),
    googleLoginSuccess //if success
);

export default router;