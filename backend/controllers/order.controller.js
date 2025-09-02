import Orders from "../models/order.model.js";
import User from "../models/user.model.js";
import Stripe  from "stripe";
import createError from "../utils/createError.js";
import mongoose from "mongoose";

const checkUserId = async (userId) => {
    if (!mongoose.Types.ObjectId.isValid(userId)){
        return {valid: false, message: "Invalid User ID"};
    }

    const check = await User.findById(userId);

    if (!check){
        return {valid: false, message: "User ID Not Found"};
    }

    return {valid: true, message: "User ID Found"};
}


const checkOrderId = async (orderId) => {
    if (!mongoose.Types.ObjectId.isValid(orderId)){
        return {valid: false, message: "Invalid Order ID"};
    }

    const check = await Orders.findById(orderId);

    if (!check){
        return {valid: false, message: "Order ID Not Found"};
    }

    return {valid: true, message: "Order ID Found"};
}


//Placing user order for frontend
export const placeOrder = async (req,res,next) => {
    try {
        const userId = req.userId;
        const check = await checkUserId(userId);
        const stripe = new Stripe(process.env.STRIPE_KEY);
        const frontend_url = "https://tomato-feoq.onrender.com";

        if (!check.valid){
            throw new Error(check.message);
        }

        const newOrder = new Orders({
            userId,
            items: req.body.items,
            amount: req.body.amount,
            address: req.body.address,
        });

        await newOrder.save();
        await User.findByIdAndUpdate(userId,{
            cartData: {}
        });

        const line_items = req.body.items.map(item => ({
            price_data: {
                currency: "inr",
                product_data: {
                    name: item.name
                },
                unit_amount: item.price*100*87.98
            },
            quantity: item.quantity
        }));

        line_items.push({
            price_data: {
                currency: "inr",
                product_data: {
                    name: "Delivery Charges"
                },
                unit_amount: 2*100*87.98
            },
            quantity: 1
        });

        const session =  await stripe.checkout.sessions.create({
            line_items,
            mode: "payment",
            success_url: `${frontend_url}/verify?success=1&orderId=${newOrder._id}`,
            cancel_url: `${frontend_url}/verify?success=0&orderId=${newOrder._id}`
        });

        res.status(200).json({success: true, session_url: session.url});
    } catch (error) {
        next(createError(error));
    }
}

export const verifyOrder = async (req,res,next) => {
    try {
        const {orderId,success} = req.body;
        const check = await checkOrderId(orderId);

        if (!check.valid){
            throw new Error(check.message);
        }

        if (success){
            await Orders.findByIdAndUpdate(orderId,{
                payment: true
            });
            return res.status(200).json({success: true, message: "Paid"});
        }
        else{
            await Orders.findByIdAndDelete(orderId);
            return res.status(200).json({success: false, message: "Not paid"});
        }
    } catch (error) {
        next(createError(error));
    }
}

export const usersOrder = async (req,res,next) => {
    try {
        const userId = req.userId;
        const check = await checkUserId(userId);

        if (!check.valid){
            throw new Error(check.message);
        }

        const orders = await Orders.find({userId}).select("-userId").sort({date: -1});
        res.status(200).json({success: true, data: orders});
    } catch (error) {
        next(createError(error));
    }
}

export const listOrders = async (req,res) => {
    try {
        const orders = await Orders.find().populate("userId","name email -_id");
        res.json({success: true, data: orders});
    } catch (error) {
        error.status = 400;
        next(createError(error));
    }
}

export const updateStatus = async (req,res,next) => {
    try {
        const {orderId, status} = req.body;
        const check = await checkOrderId(orderId);

        if (!check.valid){
            throw new Error(check.message);
        }

        await Orders.findByIdAndUpdate(orderId,{status});
        res.status(200).json({success: true, message: "Status updated successfully"});
    } catch (error) {
        error.status = 400;
        next(createError(error));
    }
}
