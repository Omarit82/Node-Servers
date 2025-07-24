import express from 'express';
import session from 'express-session';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import MongoStore from 'connect-mongo';
import cookieParser from 'cookie-parser';
import path from 'path';
import indexRouter from './Routes/index.routes.js';
import { __dirname } from './utils/path.js';
import {initializedPassport} from './Config/passport.config.js';
import passport from 'passport';
import multer from 'multer';

dotenv.config();
initializedPassport();
const app = express();
const PORT = process.env.PORT;


app.use(express.json());
app.use(cookieParser(process.env.SESSION_CODE));
app.use(cors({origin:'http://localhost:5173',credentials:true}));
app.use(session({
    store: MongoStore.create({mongoUrl:process.env.MONGO_URL,mongoOptions:{},ttl: 60*60}),
    secret:process.env.SESSION_CODE,
    resave:true,
    saveUninitialized:true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use('/uploads',express.static('uploads'));
app.use('/',indexRouter);

const storage = multer.diskStorage({
    destination: 'uploads/',
    filename: (req, file,cb) =>{
        const ext = path.extname(file.originalname);
        const uniqueName = `${Date.now}-${Math.round(Math.random()*1e5)}${ext}}`;
        cb(null, uniqueName);
    }
})

const upload = multer({storage})

try {
    mongoose.connect(process.env.MONGO_URL).then(console.log("DB Connected"))
} catch (error) {
    console.log("Mongo DB connection error");
}


app.listen(PORT,()=>{
    console.log("Server on PORT: ",PORT);
})
