import { Router } from "express";
import * as cartController from "../controllers/cart.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";

const router = Router();

router.post("/add",authMiddleware,cartController.addToCart);
router.delete("/remove",authMiddleware,cartController.removeFromCart);
router.get("/get",authMiddleware,cartController.getCart);

export default router;