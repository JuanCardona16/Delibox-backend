import { Router } from "express";
import { PRIVATE_ROUTES } from "@/config/constants";
import { requireAdminRole } from "../middleware";
import { RestaurantController } from "../controllers";
import { MenuController } from "../../menus/controllers"
import { requireUserRole } from "@/modules/menus/middleware";

const restaurantRoutes = Router();
const restaurantController = new RestaurantController();
const menuController = new MenuController();

// Routes for app administrators
restaurantRoutes.post("/create", requireAdminRole, restaurantController.create);
restaurantRoutes.post("/menu", requireAdminRole, menuController.updateMenu);
restaurantRoutes.get("/info", requireAdminRole, restaurantController.getRestaurantInfo);
restaurantRoutes.get("/menu", requireAdminRole, menuController.getInfo);

// Routes for app Customer
restaurantRoutes.get("/all", requireUserRole, restaurantController.getAllRestaurants);
restaurantRoutes.get("/menu/:menuUuid", requireUserRole, menuController.getMenuByIdForCustomer);
restaurantRoutes.get("/:restaurantUuid", requireUserRole, restaurantController.getRestaurantById)

export default restaurantRoutes;
