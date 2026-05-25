import speakeasy from "speakeasy"; // one-time passcode generator,
import QRCode from "qrcode"; //qr code <generator></generator>
import axios from "axios";
import { mfaUsers } from "../../../data/mfaUsers.js";

export const generateMFA = async(req,res) => {
    try{
        const {email,captchaToken} =req.body;

        if(!email){
            return res.status(400).json({message:"Please enter your email"});
        }

        if(!captchaToken){
            return res.status(400).json({message:"Please complete the captcha"});
        }

        const captchaResponse =await axios.post(
            `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.CAPTCHA_SECRET_KEY}&response=${captchaToken}`
        );

        if(!captchaResponse.data.success){
            return res.status(400).json({message:"Captch Failed"});
        }
        const secret=speakeasy.generateSecret({name:`AuthArena (${email})`});

        const qrCode=await QRCode.toDataURL(secret.otpauth_url);

        const existingUser=mfaUsers.find(u=>u.email===email);

        if(existingUser){
            existingUser.secret=secret.base32;
        }else{
            mfaUsers.push({
                email,
                secret:secret.base32
            });
        }
        res.status(200).json({message:"QR Code successfully generated",qrCode});
    }catch(error){
        return res.status(500).json({message:error.message});
    }
}

export const verifyMFA=(req,res) => {
    try{
        const {email,token} = req.body;

        const user =mfaUsers.find( u=>u.email===email );

        if(!user){
            return res.status(404).json({ message:"User not found" });
        }

        const verified = speakeasy.totp.verify({ secret:user.secret, encoding:"base32", token });

        if(!verified){
            return res.status(400).json({ message:"Invalid OTP" });
        }

        res.status(200).json({ message: "MFA Verification Successful"});
    }catch(error){
        return res.status(500).json({message:error.message});
    }
}