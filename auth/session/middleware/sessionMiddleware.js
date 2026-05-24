export const protect = (req,res,next) => {
    const user=req.session.user;
    if(!user){
        return res.status(400).json({message:"Unauthorized user"});
    }
    try{
        req.user=user;
        next();
    }catch(error){
        return res.redirect("/session");
    }
}