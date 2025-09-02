import mongoose from "mongoose";

const connectDB = async () => {
    const MONGO_URL = process.env.MONGO_URL;
    try {
        const res = await mongoose.connect(MONGO_URL);
        console.log("Database Connected");
    } catch (error) {
        console.error("Failed to connect to Database");
        process.exit(1);
    }
}

export default connectDB;