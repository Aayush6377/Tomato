import { Router } from "express";
import * as foodController from "../controllers/food.controller.js";
import { uploader, handleUploader } from "../middleware/multer.js";

const router = Router();

router.post("/add", handleUploader,foodController.addFood);
router.get("/list", foodController.listFood);
router.delete("/remove/:id",foodController.removeFood);

export default router;