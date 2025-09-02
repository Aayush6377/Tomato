import FoodModel from "../models/food.model.js";
import fs from "fs";
import createError from "../utils/createError.js";
import mongoose from "mongoose";
import path from "path";

//Add food item
export const addFood = async (req,res,next) => {
    try {
        let image_filename = `${req.file.filename}`;
        const food = new FoodModel({
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            image: image_filename,
            category: req.body.category
        });

        await food.save();
        res.status(201).json({success: true, message: "Food Added successfully"});
    } catch (error) {
        const err = createError(error);
        next(err);
    }
}

//All food list
export const listFood = async (req,res, next) => {
    try {
        const foods = await FoodModel.find();
        res.status(200).json({
            success: true,
            data: foods
        })
    } catch (error) {
        const err = createError(error);
        next(err);
    }
}

//Remove food item
export const removeFood = async (req,res,next) => {
    try {
        const foodId = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(foodId)){
            throw new Error("Invalid Food ID");
        }

        const deletedItem = await FoodModel.findByIdAndDelete(foodId);

        if (!deletedItem){
            throw new Error("Food ID not found");
        }

        const imageName = deletedItem.image;

        fs.unlink(path.join("uploads",imageName),(err) => {
            if (err){
                console.error(err);
            }
        });

        res.status(200).json({success: true, message: "Food remove successfully"});
    } catch (error) {
        const err = createError(error);
        next(err);
    }
}