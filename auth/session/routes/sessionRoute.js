import express from "express";

import {registerUser,loginUser,logoutUser} from "../controllers/sessionControllers.js";
import { protect } from "../middleware/sessionMiddleware.js";

const router=express.Router();

router.get("/",(req,res)=>{ res.render("session/form")});

router.post("/register",registerUser);
router.post("/login",loginUser);
router.post("/logout",logoutUser);

router.get("/welcome",protect,(req,res)=>{
    res.render("session/welcome",{ user:req.session.user });
})

export default router;

