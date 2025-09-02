import { body,validationResult } from "express-validator";
import User from "../models/user.model.js";
import bcrypt from 'bcrypt';

export const userRegister = [
    body("name")
    .notEmpty().withMessage("Name shouldn't be empty")
    .isLength({min: 5}).withMessage("username must be 5 characters long"),

    body("email")
    .notEmpty().withMessage("Email shouldn't be empty")
    .isEmail().withMessage("Email is not in proper format")
    .matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/).withMessage("Email is not in proper format")
    .custom(async (value) => {
        const user = await User.findOne({email: value});
        if (user){
            return Promise.reject("Email already exists");
        }
        return true;
    }),
    
    body("password")
    .notEmpty().withMessage("Password shouldn't be empty")
    .isLength({min: 8}).withMessage("Password must be at least 8 characters long")
    .isStrongPassword().withMessage("Password must include a character, number and a special character")
];

export const loginValidation = [
    body("email")
    .notEmpty().withMessage("Email shouldn't be empty")
    .isEmail().withMessage("Email is not in proper format")
    .matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/).withMessage("Email is not in proper format")
    .custom(async (value, {req}) => {
        const user = await User.findOne({email: value});

        if (!user){
            return Promise.reject("User Not Found");
        }
        req.foundUser = user;
        return true;
    }),

    body("password")
    .notEmpty().withMessage("Password shouldn't be empty")
    .isLength({min: 8}).withMessage("Password must be at least 8 characters long")
    .custom(async (value, {req}) => {
        const user = req.foundUser;

        if (!user){
            return Promise.reject("User Not Found");
        }

        const match = await bcrypt.compare(value,user.password);
        if (!match){
            return Promise.reject("Password doesn't matched");
        }
        
        return true;
    })
]

export const handleUserValidator = (req,res,next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()){
        const errObj = new Error("Validation Error");
        errObj.status = 400;
        errObj.data = {};
        errObj.data.status = 400;
        errObj.data.message = "Validation Error";
        errObj.data.data = {};
        errors.array().map((err) => {
            errObj.data.data[err.path] = err.msg;
        })
        return next(errObj);
    }
    next();
}