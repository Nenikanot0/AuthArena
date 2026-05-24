import bcrypt from "bcryptjs";
import {sessionUsers} from "../../../data/sessionUsers.js";

export const registerUser = async(req,res) =>{
    try{
        const {email,password}=req.body;

        if(!email || !password){
            return res.status(400).json({ message:"Fill all details"});
        }
        const existingUsers=sessionUsers.find(u=>u.email===email);

        if(existingUsers){
            return res.status(400).json({message:"User already exists"});
        }

        const salt=await bcrypt.genSalt(10);
        const hashedPassword=await bcrypt.hash(password,salt);

        const newUser={
            id:Date.now(),
            email,
            password:hashedPassword
        };

        sessionUsers.push(newUser);
        
        req.session.user={
            id:newUser.id,
            email:newUser.email
        };

        res.status(200).json({message:"Successfully registered"});
    }catch(error){
        return res.status(500).json({message:error.message});
    }
} 

export const loginUser= async(req,res)=>{
    try{
        const {email,password} = req.body;
        
        if(!email || !password){
            return res.status(400).json({message:"Fill all details"});
        }

        const user=sessionUsers.find(u=> u.email===email);

        if(!user){
            return res.status(400).json({message:"Invalid credentials"});
        }

        const isMatch = await bcrypt.compare(password,user.password);
        
        if(!isMatch){
            return res.status(400).json({message:"Invalid credentials"});
        }

        req.session.user={
            id:user.id,
            email:user.email
        };

        res.status(200).json({message:"Login Successfull"});
    }catch(error){
        return res.status(500).json({message:error.message});
    }
}

export const logoutUser = (req,res) => {
    try{
        req.session.destroy((error)=>{
            if(error){
                return res.status(500).json({
                    message:"Logout failed"
                });

            }

            res.clearCookie("connect.sid");

            res.status(200).json({ message:"Logged out successfully" });
        });
    }catch(error){
        res.status(500).json({ message:error.message });
    }
};