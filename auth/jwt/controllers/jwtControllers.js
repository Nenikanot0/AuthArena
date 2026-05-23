import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { jwtUsers,refreshTokens } from "../../../data/jwtUsers.js"

export const registerUser=async(req,res)=>{
    try{
        const {email,password} = req.body;

        if(!email || !password){
            return res.status(400).json({message:"Fill all details"});
        } 
        const existingUser=jwtUsers.find(u=>u.email===email);
        if(existingUser){
            return res.status(400).json({message:"User already exists"});
        }

        const salt=await bcrypt.genSalt(10);
        const hashedPassword=await bcrypt.hash(password,salt);

        const newUser={
            id:Date.now(),
            email,
            password:hashedPassword
        };

        jwtUsers.push(newUser);

        const payload={id:newUser.id,email:newUser.email};

        const accessToken=jwt.sign(payload,process.env.ACCESS_SECRET,{expiresIn:"15m"});
        const refreshToken=jwt.sign(payload,process.env.REFRESH_SECRET,{expiresIn:"7d"});

        //set in http only cookie
        res.cookie("refreshToken",refreshToken,{
            httpOnly:true,
            secure:false,//set true in production if https
            sameSite:"strict"
        })
        refreshTokens.push(refreshToken);

        res.status(200).json({
            message:"Successfully registered",
            accessToken,
            newUser
        });

    }catch(error){
        res.status(500).json({ message: error.message });
    }
}
export const loginUser=async(req,res)=>{
    try{
        const {email,password}=req.body;

        if(!email || !password){
            return res.status(400).json({message:"Fill all details"});
        }

        //check email
        const user=jwtUsers.find(u=>u.email===email);
        if(!user){
            return res.status(400).json({message:"Inavlid credentials"});
        }
        
        //check password
        const isMatch = await bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.status(400).json({message:"Invalid credentials"});
        }

        const payload={id:user.id,email:user.email};

        const accessToken=jwt.sign(payload,process.env.ACCESS_SECRET,{expiresIn:"15m"});
        const refreshToken=jwt.sign(payload,process.env.REFRESH_SECRET,{expiresIn:"7d"});

        //set in http only cookie
        res.cookie("refreshToken",refreshToken,{
            httpOnly:true,
            secure:false,//set true in production if https
            sameSite:"strict"
        })
        refreshTokens.push(refreshToken);

        res.status(200).json({message: "Login successful",accessToken,user});
        
    }catch(error){
        res.status(500).json({ message: error.message });
    }
}

export const logoutUser=(req,res)=>{
    try{
        const token=req.cookies.refreshToken;

        if(!token){
            return res.status(400).json({message:"No refresh token found"});
        }

        //remove from its storage
        const index = refreshTokens.indexOf(token);
        if(index !== -1){
            refreshTokens.splice(index,1);
        }
        
        //remove from browser as well
        res.clearCookie("refreshToken");

        res.status(200).json({message:"Logged out successfully"});

    }catch(error){
        res.status(500).json({ message: error.message });
    }
}