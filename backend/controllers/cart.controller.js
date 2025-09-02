import User from "../models/user.model.js";
import createError from "../utils/createError.js";
import FoodModel from "../models/food.model.js";
import mongoose from "mongoose";

const checkItemId = async (itemId) => {
    if (!mongoose.Types.ObjectId.isValid(itemId)){
        return {valid: false, message: "Invalid Item ID"};
    }

    const check = await FoodModel.findById(itemId);

    if (!check){
        return {valid: false, message: "Item ID Not Found"};
    }

    return {valid: true, message: "Item ID Found"};
}

//add items to user cart
export const addToCart = async (req,res,next) => {
    try {
        const userId = req.userId;
        const itemId = req.body.itemId;

        const check = await checkItemId(itemId);

        if (!check.valid){
            throw new Error(check.message);
        }

        await User.findByIdAndUpdate(userId, {
            $inc: {[`cartData.${itemId}`]: 1}
        });
        res.status(201).json({success: true, message: "Cart item added successfully"});
    } catch (error) {
        error.status = 400;
        next(createError(error));
    }
}

//remove items from user cart
export const removeFromCart = async (req,res,next) => {
    try {
        const userId = req.userId;
        const itemId = req.body.itemId;

        const check = await checkItemId(itemId);

        if (!check.valid){
            throw new Error(check.message);
        }

        const updatedUser = await User.findByIdAndUpdate(userId,{
            $inc: {[`cartData.${itemId}`]: -1}
        },{new: true});

        if (updatedUser.cartData[itemId] <= 0){
            await User.findByIdAndUpdate(userId,{
                $unset: {[`cartData.${itemId}`]: ""}
            });
        }

        res.status(200).json({success: true, message: "Cart item removed successfully"});
    } catch (error) {
        error.status = 400;
        next(createError(error));
    }
}

//fetch user cart data
export const getCart = async (req,res,next) => {
    try {
        const userId = req.userId;
        const userData = await User.findById(userId);
        const cartData = userData.cartData;

        res.status(200).json({success: true, cart: cartData});
    } catch (error) {
        next(createError(error));
    }
}