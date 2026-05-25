import express from 'express';
import "dotenv/config";
import cors from 'cors';
import passport from 'passport';
import session from 'express-session';
import cookieParser from 'cookie-parser';  
import path from "path";
import { fileURLToPath } from "url"; 

import googleRoutes from "./auth/google/routes/googleRoutes.js";
import "./auth/google/config/passportGoogle.js";
import jwtRoutes from "./auth/jwt/routes/jwtRoutes.js";
import sessionRoutes from "./auth/session/routes/sessionRoute.js";
import otpRoutes from "./auth/otp/routes/otpRoute.js"

const app=express();

const __filename=fileURLToPath(import.meta.url);
const __dirname=path.dirname(__filename);

app.use(cors());  //allows backend to accept req and share data to frontend of various domains
app.use(express.json()); //converts raw requests to json object
app.use(cookieParser()); //parses raw http header to req.cookies object
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

//Set EJS as templating engine
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));

app.use(
    session({
        secret:process.env.JWT_SECRET,
        resave:false,
        saveUninitialized:false,
        cookie:{
            secure:false,
            maxAge:1000 * 60 * 60
        }
    })
); //creates a unique server side session for user to track them across all requests

app.use(passport.initialize()); //initialize passport into express routing system 
app.use(passport.session()); //to connect the passport to active session so to make req.user available

app.use("/google",googleRoutes);
app.use("/jwt",jwtRoutes);
app.use("/session",sessionRoutes);
app.use("/otp",otpRoutes);

app.get("/",(req,res) => { res.render("home") } );
app.get("/about",(req,res)=>{ res.render("about") });

app.listen(process.env.PORT,()=>{console.log(`Server starting at port ${process.env.PORT}`);});
