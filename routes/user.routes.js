import express from 'express';
import { forgot_pass, login, register, resetPass } from '../controller/user.controller.js';

const userRouter = express.Router();

userRouter.post('/register',register);
userRouter.post('/login',login);
userRouter.post('/forgot_pass',forgot_pass);
userRouter.post('/reset_pass/:token',resetPass);

export {userRouter};