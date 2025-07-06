import express from 'express';
import dotenv from 'dotenv';
import indexRouter from './Routes/index.routes.js';
import mongoose from 'mongoose';

dotenv.config();
const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use('/',indexRouter);

try {
    mongoose.connect(process.env.MONGO_URL).then(console.log("DB Connected"))
} catch (error) {
    console.log("Mongo DB connection error");
}


app.listen(PORT,()=>{
    console.log("Server on PORT: ",PORT);
})
