import { redis } from '../redis/redisConnection.js';

const sessionMiddleware = async (req, res, next) => {
    try {
        const sessionId = await redis.get("sessionID");
        
        if (!sessionId) {
            return res.status(401).json({ msg: "Session has expired" });
        }

        next();
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ msg: "Internal server error" });
    }
};

export default sessionMiddleware;
