import express from 'express';
import {registerUser,loginUser,logoutUser} from "../controllers/jwtControllers.js";
const router=express.Router();

router.get("/", (req, res) => {
     res.render("token/welcome");
});
router.post("/register",registerUser);
router.post("/login",loginUser);
router.post("/logout",logoutUser);

export default router;