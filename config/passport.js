import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import {users} from "../data/users.js";

passport.use(
    new GoogleStrategy(
        {
            clientID:process.env.GOOGLE_CLIENT_ID,
            clientSecret:process.env.GOOGLE_CLIENT_SECRET,
            callbackURL:"/auth/google/callback"
        },
        async(accessToken,refreshToken,profile,done)=>{
            try{
                let user = users.find(
                    (u)=>u.googleId===profile.id
                );

                if(!user){
                    user={
                        id:Date.now().toString(),
                        googleId:profile.id,
                        name:profile.displayName,
                        email:profile.emails[0].value,
                        avatar:profile.photos[0].value
                    };
                    users.push(user);
                }
                done(null,user);
            }
            catch(error){
                done(error,null);
            }
        }
    )
);



passport.serializeUser((user,done)=>{ // ->Converts the bulky user profile object (name,email,avatarURL,etc) and compresses it down to just a tiny cookie identifier like user.id.  
    done(null,user.id); //error,user details
});

passport.deserializeUser((id,done)=>{ // ->Every time the user clicks a route on your site,Passport automatically extracts that id from the cookie and throws it to the function.
    const user=users.find(
        (u)=>u.id===id
    );
    done(null,user); //error,user details
});