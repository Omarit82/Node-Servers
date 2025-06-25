import express from 'express';
import  dotenv  from 'dotenv';
import cors from 'cors';
import hubspot from '@hubspot/api-client';
import indexRouter from './Router/index.Routes.js'

const app = express();
const PORT = 3000;
const hubspotClient = new hubspot.Client();
dotenv.config()

app.use(express.json());
app.use(cors({ origin: 'http://localhost:3000' }));
app.use('/',indexRouter);

app.listen(PORT,()=>{
    console.log(`Server on port: ${PORT}`);
    console.log(process.env.HUBSPOT_CLIENT_ID);
})