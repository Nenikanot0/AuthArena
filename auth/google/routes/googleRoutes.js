import express from 'express';
import { googleLogin } from "../controllers/googleController.js";
import passport from 'passport';

const router=express.Router();

router.get("/login", //sends the user to google auth page
    passport.authenticate(
        "google", //strategy
        {
            scope:["profile","email"]
        }
    )
);
router.get("/callback", //after passport verifies,if success the redirect to success page else login page
    passport.authenticate(
        "google",
        {
            failureRedirect:"/login" //if failed
        }
    ),
    googleLogin //if success
);

export default router;