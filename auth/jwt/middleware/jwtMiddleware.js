import jwt from "jsonwebtoken";

export const protect = (req,res,next)=>{

    const token =
    req.cookies.accessToken;

    if(!token){

        return res.redirect("/jwt");

    }

    try{

        const decoded = jwt.verify(

            token,

            process.env.ACCESS_SECRET

        );

        req.user = decoded;

        next();

    }

    catch(error){

        return res.redirect("/jwt");

    }

};