import jwt from "jsonwebtoken";
import createError from "../utils/createError.js";

const authMiddleware = (req,res,next) => {
    const authHeader = req.headers?.authorization;

    try {
        if (!authHeader){
            throw new Error("Missing token");
        }

        const token = authHeader.split(" ")[1];
        const decode = jwt.verify(token,process.env.JWT_SECRET);

        if (!decode){
            throw new Error("Invalid token");
        }

        req.userId = decode.id;
        next();
    } catch (error) {
        error.status = 401;
        const err = createError(error);
        next(err);
    }
}

export default authMiddleware;