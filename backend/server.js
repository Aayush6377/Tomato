import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import foodRouter from "./routes/food.route.js";
import userRouter from "./routes/user.route.js";
import cartRouter from "./routes/cart.route.js";
import orderRouter from "./routes/order.route.js";

dotenv.config();
const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cors());

connectDB();

//API Endpoints
app.use("/api/food", foodRouter);
app.use("/images",express.static("uploads"));
app.use("/api/user", userRouter);
app.use("/api/cart",cartRouter);
app.use("/api/order",orderRouter);

app.use((err,req,res,next) => {
    res.status(err.status || 500).json(err.data);
});

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`)
});