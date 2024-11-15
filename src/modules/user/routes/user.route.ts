import { Router } from "express";
import { UserController } from "../controller/user.controller";
import { authorize } from "@/modules/authentication/midlewares/auth.midleware";
import { PRIVATE_ROUTES } from "@/config/constants";

const userRoutes = Router();
const userController = new UserController();

userRoutes.get("/info", authorize, userController.getUserInfo);

export default userRoutes;
