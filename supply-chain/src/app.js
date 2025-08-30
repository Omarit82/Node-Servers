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
        name: 'connect.sid',
        store: MongoStore.create({mongoUrl:process.env.MONGO_URL,mongoOptions:{},ttl: 60*60*24*7/**Una semana**/}),
        secret:process.env.SESSION_CODE,
        resave:false,
        saveUninitialized:false,
        cookie: {
            httpOnly:true,
            secure: false, //True si HTTPS
            sameSite:'lax',
            path:'/',
            maxAge:60*60*1000*24*7 // 1 semana en milisegundos.
        }
    })
);
app.use(passport.initialize());
app.use(passport.session());
app.use('/static', express.static('./tmp'));
app.use('/uploads',express.static('uploads'));
app.use('/',indexRouter);

const storage = multer.diskStorage({
    destination: function (req,file,cb){
        cb(null,'uploads/');
    },
    filename: (req, file,cb) =>{
        const ext = path.extname(file.originalname);
        const uniqueName = `${Date.now}-${Math.round(Math.random()*1e5)}${ext}}`;
        cb(null, uniqueName);
    }
})

const upload = multer({storage:storage})

try {
    mongoose.connect(process.env.MONGO_URL).then(console.log("DB Connected"))
} catch (error) {
    console.log("Mongo DB connection error");
}


app.listen(PORT,()=>{
    console.log("Server on PORT: ",PORT);
})
