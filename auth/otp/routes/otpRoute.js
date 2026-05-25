import express from "express";

import { sendOtp,verifyOtp,logoutUser } from "../controllers/otpController.js";

import { protect } from "../middleware/otpMiddleware.js";

const router = express.Router();

router.get("/",(req,res)=>{ res.render("otp/form") });

router.post("/send-otp",sendOtp);
router.post("/verify-otp",verifyOtp);
router.post("/logout",logoutUser);
router.get("/welcome",protect,(req,res)=>{
    res.render("otp/welcome",{ user:req.session.user });
});

export default router;