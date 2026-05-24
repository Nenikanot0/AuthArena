import express from "express";

import {registerUser,loginUser,logoutUser,refreshAccessToken} from "../controllers/jwtControllers.js";
import {protect} from "../middleware/jwtMiddleware.js";

const router = express.Router();

router.get(
    "/",
    (req,res)=>{
        res.render("jwt/form");
    }
);
router.post("/register",registerUser);
router.post("/login",loginUser);
router.post("/logout",logoutUser);
router.post("/refresh",refreshAccessToken);
router.get("/welcome",protect,
    (req,res)=>{
        res.render(
            "jwt/welcome",
            {
                user:req.user
            }
        );
    }
);

export default router;