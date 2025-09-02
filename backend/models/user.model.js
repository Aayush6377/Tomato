import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    cartData: {
        type: Object,
        default: {}
    }
},{
    minimize: false
});

userSchema.pre("save",async function(next){
    if (!this.isModified("password")) return next();
    try {
        const hash = await bcrypt.hash(this.password, 12);
        this.password = hash;
        next();
    } catch (error) {
        next(error);
    }
});

const User = mongoose.models.user ||  mongoose.model("user",userSchema);

export default User;