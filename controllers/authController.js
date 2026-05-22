export const googleLoginSuccess=(req,res)=>{
    if(!req.user){
        return res.send("Authentication Failed");
    }
    res.render("welcome",
        {
            user:req.user
        }
    );
};