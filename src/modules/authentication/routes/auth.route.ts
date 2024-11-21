import { PUBLIC_ROUTES } from "@/config/constants";
import { validateSchema } from "@/helpers/schemas/validateSchema";
import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { loginSchemaZod, registerSchameZod } from "../schemas/auth.schema";
import { asyncHandler } from "@/config/api";

const authRoutes = Router();
const authController = new AuthController();

authRoutes.post(
  PUBLIC_ROUTES.REGISTER,
  validateSchema(registerSchameZod),
  asyncHandler(authController.register)
);
authRoutes.post(
  PUBLIC_ROUTES.LOGIN,
  validateSchema(loginSchemaZod),
  asyncHandler(authController.login)  
);
authRoutes.post(PUBLIC_ROUTES.LOGOUT, asyncHandler(authController.logout));

export default authRoutes;
