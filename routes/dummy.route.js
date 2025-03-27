import express from 'express';
import sessionMiddleware from '../middlewear/session.middlewear.js';

const dummyRouter = express.Router();

dummyRouter.get('/', sessionMiddleware, (req, res) => {
    res.status(200).send('This is home page');
});

export default dummyRouter;