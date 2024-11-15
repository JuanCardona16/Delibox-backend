import { Router } from "express";
import authGoogleRouter from "@/modules/google-authentication/routes/authGoogle.route";
import authRoutes from "@/modules/authentication/routes/auth.route";
import userRoutes from '@/modules/user/routes/user.route';
import { AuthPrefixRoutes, PRIVATE_ROUTES, AuthGooglePrefixRoutes, hellow } from "../constants";
import restaurantRoutes from "@/modules/restaurant/routes";

const router = Router();

router.use(AuthGooglePrefixRoutes, authGoogleRouter)
router.use(AuthPrefixRoutes, authRoutes);
router.use(PRIVATE_ROUTES.USER, userRoutes);
router.use("/restaurant", restaurantRoutes)

export default router;
