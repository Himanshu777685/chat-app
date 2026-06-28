import User from "../models/User.js";
import bcrypt, { compare } from "bcryptjs";
import { generateToken } from "../utils/generate_token.js";
// import { v2 as cloudinary } from "cloudinary";
import cloudinary from "../cloudinary.js";
import path from 'path'


export const signup = async (req, res) => {

    const { name, email, password, bio } = req.body;

    try {
        if (!name || !email || !password || !bio) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "User already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        let imageUrl = "";

        if (req.file) {

            const uploadResponse = await cloudinary.uploader.upload(req.file.buffer);

            imageUrl = uploadResponse.secure_url;
        }

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            bio,
            profilePic: imageUrl,
            isOnline: false
        })


        const token = generateToken(user._id);

        const userwithoutpass = {
            _id: user._id,
            name: user.name,
            email: user.email,
            bio: user.bio

        }

        res.cookie("token", token, {
            httpOnly: true,
            sameSite: "none",
            secure: true,
        });

        res.json({
            success: true,
            userData: userwithoutpass,
            message: "User has been created"
        })
    } catch (e) {

        console.log(e.message);
        res.status(500).json({
            success: false,
            message: e.message

        })
    }

}


export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const userData = await User.findOne({ email });

        if (!userData) {
            return res.status(401).json({
                success: false,
                message: 'user is not registered'
            })
        }

        const isPasswordCorrect = await bcrypt.compare(password, userData.password);

        if (!isPasswordCorrect) {
            return res.status(401).json({
                success: false,
                message: 'Incorrect password'
            })
        }

        const token = generateToken(userData._id);

        userData.isOnline = true;
        await userData.save();


        res.cookie("token", token, {
            httpOnly: true,
            sameSite: "none",
            secure: true,
        });

        const userwithoutpass = {
            _id: userData._id,
            name: userData.name,
            email: userData.email,
            bio: userData.bio,
            isOnline: userData.isOnline

        }

        res.json({
            success: true,
            user: userwithoutpass,
            message: "Login successful"
        });
    } catch (e) {

        console.log(e.message);
        res.status(500).json({
            success: false,
            message: e.message
        })
    }
}

export const checkAuth = (req, res) => {
    res.json({
        success: true,
        user: {
            _id: req.user._id,
            name: req.user.name,
            email: req.user.email,
            bio: req.user.bio,
            profilePic: req.user.profilePic,
            isOnline: req.user.isOnline
        }
    });
};

export const logout = async (req, res) => {
    try {


        const userId = req.user?._id;
        console.log(req.body);
        if (userId) {
            await User.findByIdAndUpdate(userId, {
                isOnline: false,
            })
        }
        res.clearCookie("token", {
            httpOnly: true,
            secure: true,
            sameSite: "none"
        });

        res.status(200).json({
            success: true,
            message: "Logged out successfully",
        });
    } catch (error) {
        console.log(error.message);

        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

export const updateUser = async (req, res) => {
    try {

        console.log("BODY:", req.body);

        const name = req.body?.name;
        const bio = req.body?.bio;

        const updateData = {};

        if (name) updateData.name = name;
        if (bio) updateData.bio = bio;

        if (req.file) {

            // try {
            //     const result = await cloudinary.api.ping();
            //     console.log(result);
            // } catch (error) {
            //     console.log(error);
            // }

            try {
                console.log("FILE:", req.file);
                console.log("FILE PATH:", req.file.path);

                

                const uploadResponse = await cloudinary.uploader.upload(req.file.buffer, {
                    resource_type: "auto",
                });

                updateData.profilePic = uploadResponse.secure_url;

            } catch (error) {
                console.log("FULL ERROR:", error);
                console.log("MESSAGE:", error.message);
                console.log("HTTP CODE:", error.http_code);
                console.log("ERROR DETAILS:", error.error);
                console.dir(error, { depth: null });
                return res.status(500).json({
                    success: false,
                    message: error.message,
                });
            }
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.user._id,
            updateData,
            { new: true }
        ).select("-password");

        console.log('updated user: ' , updatedUser);

        res.json({ success: true, user: updatedUser });

    } catch (error) {
        console.log(error.message);
        console.log("Cloudinary error:", error);
        console.log("Cloudinary error message:", error.message);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};