import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import rateLimit from 'express-rate-limit';
import mongoose from "mongoose";

import router from './routes/api.js';
import {DATABASE_URL, MAX_JSON_SIZE, REQUEST_NUMBER, REQUEST_TIME, WEB_CACHE} from "./src/config/config.js";

const app = express();

//app level middleware
app.use(express.json({limit: MAX_JSON_SIZE}));
app.use(express.urlencoded({extended: true}));
app.use(cors());
app.use(cookieParser());


//app use limiter setup
const limiter = rateLimit({windowMs:REQUEST_TIME,max:REQUEST_NUMBER});
app.use(limiter);

// Cache
app.set('etag',WEB_CACHE)

//database connect
mongoose.connect(DATABASE_URL)
    .then(()=>{
        console.log("MongoDB Connected");
    })
    .catch((err)=>{
        console.log(err.toString());
    })

//router setup
app.use("/api/user", router);

// unexpected routes error handling
app.use((req,res,next)=>{
    res.status(404).json({
        status: "fail",
        message:"Routes Not Found"
    });
    next()
});

// server related error
app.use((error,req,res,next)=>{
    res.status(500).json({
        status: "fail",
        message:"Internal Server Error",
        error: error.message,
    });
    next()
})

export default app;