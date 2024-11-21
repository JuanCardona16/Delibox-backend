import { Router } from "express";
import { PRIVATE_ROUTES } from "@/config/constants";
import { requireAdminRole } from "../middleware";
import { RestaurantController } from "../controllers";
import { MenuController } from "../../menus/controllers"
import { requireUserRole } from "@/modules/menus/middleware";

const restaurantRoutes = Router();
const restaurantController = new RestaurantController();
const menuController = new MenuController();

// methos POSTs
restaurantRoutes.post("/create", requireAdminRole, restaurantController.create);
restaurantRoutes.post("/menu", requireAdminRole, menuController.updateMenu);

// methos GETs
restaurantRoutes.get("/info", requireAdminRole, restaurantController.getRestaurantInfo);

// Routes for app Customer
restaurantRoutes.get("/menu", requireAdminRole, menuController.getInfo);
restaurantRoutes.get("/all", requireUserRole, restaurantController.getAllRestaurants);
restaurantRoutes.get("/menu/:menuUuid", requireUserRole, menuController.getMenuByIdForCustomer);




export default restaurantRoutes;
