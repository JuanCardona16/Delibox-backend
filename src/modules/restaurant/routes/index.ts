import { Router } from "express";
import { PRIVATE_ROUTES } from "@/config/constants";
import { requireAdminRole } from "../middleware";
import { RestaurantController } from '../controllers'

const restaurantRoutes = Router();
const restaurantController = new RestaurantController()

restaurantRoutes.post("/create", requireAdminRole, restaurantController.create);

export default restaurantRoutes;
