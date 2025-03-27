import argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import transporter from '../nodemailer/nodemailer.js';
import { redis } from '../redis/redisConnection.js';

const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const data = await User.findOne({ $or: [{ username }, { email }] });
        if (data) {
            return res.status(400).json({ msg: "User is already exist" });
        }
        const hashPass = await argon2.hash(password);

        const user = await User.create({
            username,
            email,
            password: hashPass
        });
        res.status(201).json({ msg: "User is register successfully" });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ msg: "Internal server error" });
    }
};


const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ msg: "User is Invalid" });
        };
        const verify = await argon2.verify(user.password, password);
        if (!verify) {
            return res.status(400).json({ msg: "Password is invalid" });
        }
       await redis.set("sessionID",user._id, 'EX', 300);
        res.status(200).json({ msg: "Login successfully"});

    } catch (error) {
        console.log(error.message);
        res.status(500).json({ msg: "Internal server error" });
    }
};

const forgot_pass = async (req, res) => {
    try {
        const { username } = req.body;
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ msg: "User is Invalid" });
        };
        const resetToken = jwt.sign({ id: user._id }, process.env.JWT_ACCESS_KEY, { expiresIn: "5min" });
        const mailOptions = {
            from: process.env.EMAIL,
            to: user.email,
            subject: 'Password Reset Request',
            html: `
                <p>Hi ${user.name},</p>
                <p>We received a request to reset your password. Click the link below to reset your password:</p>
                <a href="http://localhost:${process.env.PORT}/reset-password/${resetToken}">Reset Password</a>
                <p>If you didn't request this change, please ignore this email or contact support.</p>
                <p>Best regards,<br>Your Company Team</p>
            `, // HTML body content
        };

        await transporter.sendMail(mailOptions);
        res.status(200).json({msg:"Forgot password send mail successfully"});
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ msg: "Internal server error" });
    }
};

const resetPass = async (req, res) => {
    try {
        const token = req.params.token;
        const { password } = req.body;

        if (!token) {
            return res.status(400).json({ msg: "Unauthorized Access" });
        }

        if (!password) {
            return res.status(400).json({ msg: "Password is Invalid" });
        }

        const decode = jwt.decode(token, process.env.JWT_ACCESS_KEY);

        const user = await User.findById(decode.id);

        const hashPass = await argon2.hash(password);

        user.password = hashPass;

        await user.save();

        res.status(200).json({ msg: "Password reset password" });

    } catch (error) {
        console.log(error.message);
        res.status(500).json({ msg: "Internal server error" });
    }
}




export { register, login, forgot_pass, resetPass };