import { Router } from "express";
import { ChatController } from "../Controllers/ChatController";
import { AuthMiddleware } from "../Middleware/AuthMiddleware";

const router = Router();

router.get("/", AuthMiddleware, ChatController.getChats);
router.get("/:chatId", AuthMiddleware, ChatController.getChatById);
router.post("/create", AuthMiddleware, ChatController.createChat);
router.delete("/delete/:chatId", AuthMiddleware, ChatController.deleteChat);

export default router;
