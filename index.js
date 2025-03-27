import express from 'express';
import "dotenv/config";
import { userRouter } from './routes/user.routes.js';
import db from './config/db.js';
import dummyRouter from './routes/dummy.route.js';
import cors from 'cors';
const app = express();
app.use(express.json());
const frontendUrl = [`http://localhost:${process.env.PORT}`]
app.use(cors({
origin:frontendUrl
}));

app.use('/user',userRouter);
app.use('/dummy',dummyRouter);

const PORT = process.env.PORT
app.listen(PORT,async ()=>{
    await db();
    console.log(`Server is running ${PORT}`);
});