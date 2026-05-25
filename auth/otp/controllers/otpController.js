import { otpUsers, otpStore } from "../../../data/otpUsers.js";
import crypto from 'crypto';
import { transporter } from "../config/mailConfig.js";

export const sendOtp = async(req,res) => {

    try{
        const { email } = req.body;

        if(!email){
            return res.status(400).json({
                message:"Enter email"
            });
        }

        const randomBuffer = crypto.randomBytes(4);    
        const randomNumber = randomBuffer.readUInt32BE(0);
        
        const length=6;

        const min = Math.pow(10, length - 1); 
        const max = Math.pow(10, length) - 1; 
    
        const otp = min + (randomNumber % (max - min + 1));

        const existingOtp = otpStore.find( u => u.email === email);

        if(existingOtp){
            existingOtp.otp = otp;
        }else{
            otpStore.push({ email,otp });
        }

        await transporter.sendMail({
            from:process.env.EMAIL_USER,
            to:email,
            subject:"Your OTP Code",
            html:`
                <h2>AuthArena OTP Verification</h2>
                <h1>${otp}</h1>
                <p>This OTP expires soon.</p>
            `
        });

        return res.status(200).json({
            message:"OTP sent to email"
        });

    }catch(error){
        return res.status(500).json({
            message:error.message
        });
    }

};
export const verifyOtp = async(req,res) => {

    try{
        const { email, otp } = req.body;

        if(!email || !otp){
            return res.status(400).json({
                message:"Fill all details"
            });
        }

        const userOtp = otpStore.find( u => u.email === email );

        if(!userOtp){
            return res.status(400).json({
                message:"OTP expired"
            });
        }

        if(userOtp.otp != otp){
            return res.status(400).json({
                message:"Invalid OTP"
            });
        }

        let user = otpUsers.find( u => u.email === email);

        if(!user){
            user = { id:Date.now(),email };
            otpUsers.push(user);
        }

        req.session.user = {
            id:user.id,
            email:user.email
        };

        const index = otpStore.indexOf(userOtp);

        otpStore.splice(index,1);

        return res.status(200).json({
            message:"OTP verified"
        });

    }catch(error){
        return res.status(500).json({
            message:error.message
        });
    }

};

export const logoutUser = (req,res) => {
    try{
        req.session.destroy((error)=>{
            if(error){
                return res.status(500).json({
                    message:"Logout failed"
                });
            }

            res.clearCookie("connect.sid");

            return res.status(200).json({
                message:"Logged out successfully"
            });
        });

    }catch(error){
        return res.status(500).json({
            message:error.message
        });
    }
};