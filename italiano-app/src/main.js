import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import indexRouter from './Routes/index.routes.js';
import cors from 'cors';
import session from 'express-session';
import MongoStore from 'connect-mongo';

dotenv.config();
const PORT = process.env.PORT;

const app = express();
app.use(express.json());

app.use(cors({ origin: 'http://localhost:5173' }))
app.use(cookieParser(process.env.CODE));

app.use(session({store:MongoStore.create({
    mongoUrl:process.env.MONGO_URL,
    ttl:60*60*24,
    }),
    secret:`${process.env.SESSION}`, 
    resave:true, 
    saveUninitialized:true
}))
app.use('/api',indexRouter);

try {
    await mongoose.connect(process.env.MONGO_URL).then(console.log('DB connected'))
} catch (error) {
    console.error(error);
}


app.listen(PORT,()=>{
    console.log(`Server on port: ${PORT}`);
})
