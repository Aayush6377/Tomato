import { Router } from 'express';
import * as orderController from "../controllers/order.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";

const router = Router();

router.post("/place",authMiddleware,orderController.placeOrder);
router.post("/verify",authMiddleware,orderController.verifyOrder);
router.get("/userorders",authMiddleware,orderController.usersOrder);
router.get("/list",orderController.listOrders);
router.post("/status", orderController.updateStatus);

export default router;
