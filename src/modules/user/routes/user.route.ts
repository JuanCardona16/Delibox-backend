import { Router } from "express";
import { UserController } from "../controller/user.controller";
import { PRIVATE_ROUTES } from "@/config/constants";
import { adminAuthorize, userAuthorize } from '@/modules/authentication/midlewares/auth.midleware'

const userRoutes = Router();
const userController = new UserController();

userRoutes.get("/customer", userAuthorize, userController.getUserInfo);
userRoutes.get("/admin", adminAuthorize, userController.getAdminInfo);

export default userRoutes;
