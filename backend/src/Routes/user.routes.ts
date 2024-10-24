import { Router } from "express";
import { UserController } from "../Controllers/UserController";
import { AuthMiddleware } from "../Middleware/AuthMiddleware";

const router = Router();

router.get("/user", AuthMiddleware, UserController.getUserInfo);

export default router;
