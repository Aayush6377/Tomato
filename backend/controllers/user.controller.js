import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

const createToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET);
}

//Login user
export const loginUser = async (req,res,next) => {
    try {
        const user = req.foundUser;
        const token = createToken(user._id);
        res.status(200).json({success: true, message: "User login successful", token});
    } catch (error) {
        next(error);
    }
}

//register usere
export const registerUser = async(req,res,next) => {
    try {
        const newUser = await User.create(req.body);
        const token = createToken(newUser._id);
        res.status(201).json({success: true, message: "User created successfully", token});
    } catch (error) {
        console.log(error);
        next(error);
    }
}