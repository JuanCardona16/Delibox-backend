import { Collection } from "@/config/constants";
import { Menu, Restaurant } from "@/config/entities";
import { setError } from "@/helpers";
import { RequestHandler } from "express";
import RestaurantMongoSchema from "../../restaurant/model/Restaurant.model";
import { getModel } from "@/config/database";
import MenuMongoSchema from "../model/Menu.model";

export class MenuServices {
  getMenuInfo: RequestHandler = async (req, res, next) => {
    try {
      const { uuid, rol } = (req as any).user || {};

      if (!uuid || !rol) return next(setError(401, "Not authorized"));

      const model = getModel<Restaurant>(
        Collection.RESTAURANTS,
        RestaurantMongoSchema
      );
      const restaurant = await model.findOne({ adminId: uuid });

      if (!restaurant)
        return next(setError(500, "An unexpected error has occurred"));

      const menuModel = getModel<Menu>(Collection.MENUS, MenuMongoSchema);
      const menu = await menuModel.findOne({ restaurantUuid: restaurant.uuid });

      console.log(menu)

      return res.status(200).json({
        success: true,
        message: "Se recibio la info correctamente!",
        info: menu,
      });
    } catch (error) {
      return next(setError(500, `Error get menu info: ${error}`));
    }
  };

  updateMenu: RequestHandler = async (req, res, next) => {
    try {
      const { uuid, rol } = (req as any).user || {};
      const data = req.body;

      if (!uuid || !rol) return next(setError(401, "Not authorized"));

      const model = getModel<Restaurant>(
        Collection.RESTAURANTS,
        RestaurantMongoSchema
      );
      const restaurant = await model.findOne({ adminId: uuid });

      if (!restaurant)
        return next(setError(500, "An unexpected error has occurred"));

      const menuModel = getModel<Menu>(Collection.MENUS, MenuMongoSchema);
      const menu = await menuModel.findOne({ restaurantUuid: restaurant.uuid });

      if (!menu)
        return next(setError(404, "Menu not found for the restaurant"));

      // Agregar el producto al array `products`
      menu.products.push(data);

      // Guardar los cambios en el menú
      await menu.save();

      return res.status(200).json({
        success: true,
        message: "Se actualizo correctamente el menu!",
        info: menu,
      });
    } catch (error) {
      return next(setError(500, `Error update menu info: ${error}`));
    }
  };
}
