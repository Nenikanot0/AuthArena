import express from 'express';
import {registerUser,loginUser,logoutUser} from "../controllers/jwtControllers.js";
const router=express.Router();

router.get("/", (req, res) => {
     res.render("jwt/form");
});
router.post("/register",registerUser);
router.post("/login",loginUser);
router.get("/welcome", (req, res) => {
    const user = {
        name: req.query.name,
        email: req.query.email
    };
    res.render("jwt/welcome", { user });
});
router.post("/logout",logoutUser);

export default router;