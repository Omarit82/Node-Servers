import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import indexRouter from './Routes/index.routes.js';
import { desencriptar, encriptar } from './bcrypt.js';

dotenv.config();

const PORT = process.env.PORT;

const app = express();
app.use(express.json());
app.use(cookieParser(process.env.CODE));
app.use('/',indexRouter);

try {
    await mongoose.connect(process.env.MONGO_URL).then(console.log('DB connected'))
} catch (error) {
    console.error(error);
}

app.listen(PORT,()=>{
    console.log(`Server on port: ${PORT}`);
})
