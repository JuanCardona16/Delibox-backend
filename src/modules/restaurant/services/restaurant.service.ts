import { Collection } from "@/config/constants";
import { Menu, Restaurant } from "@/config/entities";
import { setError } from "@/helpers";
import { RequestHandler } from "express";
import RestaurantMongoSchema from "../model/Restaurant.model";
import { getModel } from "@/config/database";
import MenuMongoSchema from "../model/Menu.model";

export class RestaurantService {
  create: RequestHandler = async (req, res, next) => {
    try {
      // Obtener el uuid y el rol desde req.user, que fue establecido en el middleware de autorización
      const { uuid, rol } = (req as any).user || {};
      const data = req.body;

      if (!uuid || !rol)
        return next(setError(401, "Not authorized"));

      const model = getModel<Restaurant>(Collection.RESTAURANTS, RestaurantMongoSchema)

      const isExistRestaurant = await model.findOne({ uuid: data.uuid })
      if (isExistRestaurant) return next(setError(404, "User already exists"));

      const newRestaurant = new model({ ...data, adminId: uuid })
      const restaurantInDb = await newRestaurant.save()

      // Crear el menú por defecto para el restaurante
      const menuData = {
        restaurantUuid: restaurantInDb.uuid, // Asocia el menú con el restaurante
        products: [], // Puedes agregar productos por defecto aquí si lo deseas
      };
      const MenuModel = getModel<Menu>(Collection.MENUS, MenuMongoSchema);
      const newMenu = new MenuModel(menuData);
      const menuInDb = await newMenu.save();

      // Actualiza el restaurante con la referencia al menú
      restaurantInDb.menuId = menuInDb.uuid;
      await restaurantInDb.save();
      
      return res
        .status(201)
        .json({ success: true, message: "Creacion del restaurante exitoso!" });
    } catch (error) {
      return next(setError(500, `Error creating restaurant: ${error}`));
    }
  };
}
