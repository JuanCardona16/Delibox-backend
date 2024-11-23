import { Router } from "express";
import { PRIVATE_ROUTES } from "@/config/constants";
import { requireAdminRole } from "../middleware";
import { RestaurantController } from "../controllers";
import { MenuController } from "../../menus/controllers"
import { requireUserRole } from "@/modules/menus/middleware";
import { OrdersController } from '../../orders/controllers'

const restaurantRoutes = Router();
const restaurantController = new RestaurantController();
const menuController = new MenuController();
const ordersController = new OrdersController()

// Routes for app administrators
restaurantRoutes.post("/create", requireAdminRole, restaurantController.create);
restaurantRoutes.post("/menu", requireAdminRole, menuController.updateMenu);
restaurantRoutes.get("/info", requireAdminRole, restaurantController.getRestaurantInfo);
restaurantRoutes.get("/menu", requireAdminRole, menuController.getInfo);
restaurantRoutes.get("/menu/product/:productId", requireAdminRole, menuController.getProductFromMenuById);
restaurantRoutes.delete("/menu/product/:productId", requireAdminRole, menuController.deleteProductFromMenu);
restaurantRoutes.put("/menu/product/:productId", requireAdminRole, menuController.editProductInMenu);
restaurantRoutes.get("/orders/:restaurantId", requireAdminRole, ordersController.getAdminOrders);


// Routes for app Customer
restaurantRoutes.get("/all", requireUserRole, restaurantController.getAllRestaurants);
restaurantRoutes.get("/menu/:menuUuid", requireUserRole, menuController.getMenuByIdForCustomer);
restaurantRoutes.get("/:restaurantUuid", requireUserRole, restaurantController.getRestaurantById)

export default restaurantRoutes;
