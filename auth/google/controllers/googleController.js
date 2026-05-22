export const googleLogin=(req,res)=>{
    if(!req.user){
        return res.send("Authentication Failed");
    }
    res.render("google/welcome",
        {
            user:req.user
        }
    );
};