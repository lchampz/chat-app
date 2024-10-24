import { Router } from "express";
import { MessageController } from "../Controllers/MessageController";
import { AuthMiddleware } from "../Middleware/AuthMiddleware";

const router = Router();

router.post("/save", AuthMiddleware, MessageController.saveMessage);

export default router;
