import { Router } from "express";
import * as userController from "../controllers/user.controller.js";
import { userRegister, loginValidation, handleUserValidator } from "../middleware/user.middleware.js";
import authMiddleware from "../middleware/auth.middleware.js";

const router = Router();

router.post("/register",userRegister, handleUserValidator,userController.registerUser);
router.post("/login",loginValidation, handleUserValidator, userController.loginUser);

export default router;