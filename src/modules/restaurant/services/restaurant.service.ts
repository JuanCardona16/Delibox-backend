import { Collection } from "@/config/constants";
import { Menu, Restaurant, Admin } from "@/config/entities";
import { setError } from "@/helpers";
import { RequestHandler } from "express";
import RestaurantMongoSchema from "../model/Restaurant.model";
import { getModel } from "@/config/database";
import MenuMongoSchema from "../../menus/model/Menu.model";
import AdminMongoSchema from "@/modules/admin/models/Admin.model";

export interface RestaurantResponse {
  uuid: string;
  name: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  operatingHours: string;
  menuId: string;
}

export const restaurantAdapter = (restaurant: Restaurant): RestaurantResponse => {
  return {
    uuid: restaurant.uuid,
    name: restaurant.name,
    description: restaurant.description,
    address: restaurant.address,
    phone: restaurant.phone,
    email: restaurant.email,
    operatingHours: restaurant.operatingHours,
    menuId: restaurant.menuId,
  };
};

export class RestaurantService {
  create: RequestHandler = async (req, res, next) => {
    try {
      // Obtener el uuid y el rol desde req.user, que fue establecido en el middleware de autorización
      const { uuid, rol } = (req as any).user || {};
      const data = req.body;

      if (!uuid || !rol) return next(setError(401, "Not authorized"));

      const model = getModel<Restaurant>(
        Collection.RESTAURANTS,
        RestaurantMongoSchema
      );

      const isExistRestaurant = await model.findOne({ uuid: data.uuid });
      if (isExistRestaurant)
        return next(setError(404, "Restaurant already exists"));

      const newRestaurant = new model({ ...data, adminId: uuid });
      const restaurantInDb = await newRestaurant.save();

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

      // Actualiza el modelo de usuario con el ID del restaurante
      const AdminModel = getModel<Admin>(Collection.ADMINS, AdminMongoSchema);

      if (!AdminModel) {
        return next(setError(404, "Admin not found"));
      }

      await AdminModel.updateOne({ uuid }, { restaurantId: restaurantInDb.uuid }); // Evitamos save()

      return res
        .status(201)
        .json({ success: true, message: "Creacion del restaurante exitoso!" });
    } catch (error) {
      console.error("Error durante la creación del restaurante:", error);
      return next(setError(500, `Error creating restaurant: ${error}`));
    }
  };

  getRestaurantInfo: RequestHandler = async (req, res, next) => {
    try {
      const { uuid, rol } = (req as any).user || {};

      if (!uuid || !rol) return next(setError(401, "Not authorized"));

      const model = getModel<Restaurant>(
        Collection.RESTAURANTS,
        RestaurantMongoSchema
      );
      const restaurant = await model.findOne({ adminId: uuid })

      console.log(restaurant)

      if (!restaurant)
        return next(setError(500, "An unexpected error has occurred"));


      return res.status(200).json({
        success: true,
        message: "Se recibio la info correctamente!",
        info: restaurantAdapter(restaurant),
      });
    } catch (error) {
      return next(setError(500, `Error get restaurant info: ${error}`));
    }
  };

  getAllRestaurants: RequestHandler = async (req, res, next) => {
    try {
      const { uuid, rol } = (req as any).user || {};

      if (!uuid || !rol) return next(setError(401, "Not authorized"));

      const model = getModel<Restaurant>(
        Collection.RESTAURANTS,
        RestaurantMongoSchema
      );
      const restaurants = await model.find()

      console.log(restaurants)

      if (!restaurants)
        return next(setError(500, "An unexpected error has occurred"));


      return res.status(200).json({
        success: true,
        message: "Se recibio la info correctamente!",
        info: restaurants,
      });
    } catch (error) {
      return next(setError(500, `Error get restaurant info: ${error}`));
    }
  };


}
