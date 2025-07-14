import express from 'express';
import session from 'express-session';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import MongoStore from 'connect-mongo';
import cookieParser from 'cookie-parser';
import path from 'path';
import indexRouter from './Routes/index.routes.js';
import { __dirname } from './utils/path.js';
import initializedPassport from './Config/passport.config.js';
import passport from 'passport';

dotenv.config();
initializedPassport();
const app = express();
const PORT = process.env.PORT;


app.use(express.json());
app.use(cookieParser(process.env.SESSION_CODE))
app.use(session({
    store: MongoStore.create({mongoUrl:process.env.MONGO_URL,mongoOptions:{},ttl: 60*60*24}),
    secret:process.env.SESSION_CODE,
    resave:true,
    saveUninitialized:true
}));
app.use(passport.initialize()); // inizializa passport
app.use(passport.session()); // habilito el uso de session en passport
app.use('/',indexRouter);

try {
    mongoose.connect(process.env.MONGO_URL).then(console.log("DB Connected"))
} catch (error) {
    console.log("Mongo DB connection error");
}


app.listen(PORT,()=>{
    console.log("Server on PORT: ",PORT);
})
