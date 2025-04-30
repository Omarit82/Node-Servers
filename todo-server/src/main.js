import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { indexRouter } from './router/index.routes.js';

const app = express();

dotenv.config()
const PORT = process.env.PORT;

app.use(express.json());
app.use(cors())
app.use('/',indexRouter);

mongoose.connect(process.env.URL_MONGO)
.then(()=>{
    console.log("DB connected");
}).catch((error)=>{
    console.error("DB Connection error:", error);
});

app.listen(PORT,()=>{
    console.log('Server on port: ',PORT);
})