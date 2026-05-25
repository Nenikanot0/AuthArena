import express from "express";

import {generateMFA,verifyMFA} from "../controller/mfaControllers.js"

const router = express.Router();

router.get("/",(req,res)=>{
    res.render("mfa/form",
        {
            siteKey:
            process.env.CAPTCHA_SITE_KEY
        }
    );
});

router.post("/generate",generateMFA);
router.post("/verify",verifyMFA);

router.get("/welcome",(req,res)=>{
        const user = {
            email:req.query.email
        };
        res.render( "mfa/welcome",{ user });
    }
);
export default router;