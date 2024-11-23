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

  getProductById: RequestHandler = async (req, res, next) => {
    try {
      const { uuid, rol } = (req as any).user || {};
      const { productId } = req.params;
  
      if (!uuid || !rol) return next(setError(401, "Not authorized"));
  
      // Obtener el modelo del restaurante
      const restaurantModel = getModel<Restaurant>(
        Collection.RESTAURANTS,
        RestaurantMongoSchema
      );
      const restaurant = await restaurantModel.findOne({ adminId: uuid });
  
      if (!restaurant)
        return next(setError(404, "Restaurant not found for the current user"));
  
      // Obtener el modelo del menú
      const menuModel = getModel<Menu>(Collection.MENUS, MenuMongoSchema);
      const menu = await menuModel.findOne({ restaurantUuid: restaurant.uuid });
  
      if (!menu)
        return next(setError(404, "Menu not found for the restaurant"));
  
      // Buscar el producto por UUID en el menú
      const product = menu.products.find((product) => product.uuid === productId);
  
      if (!product) {
        return next(setError(404, "Product not found in menu"));
      }
  
      // Retornar la información del producto encontrado
      return res.status(200).json({
        success: true,
        message: "Producto encontrado correctamente!",
        info: product,
      });
    } catch (error) {
      return next(setError(500, `Error getting product: ${error}`));
    }
  };
  

  deleteProductFromMenu: RequestHandler = async (req, res, next) => {
    try {
      const { uuid, rol } = (req as any).user || {};
      const { productId } = req.params;
  
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
  
      // Filtrar el producto a eliminar
      const initialLength = menu.products.length;
      menu.products = menu.products.filter((product) => product.uuid !== productId);
  
      if (menu.products.length === initialLength) {
        return next(setError(404, "Product not found in menu"));
      }
  
      // Guardar los cambios en el menú
      await menu.save();
  
      return res.status(200).json({
        success: true,
        message: "Producto eliminado correctamente del menú!",
        info: menu,
      });
    } catch (error) {
      return next(setError(500, `Error deleting product: ${error}`));
    }
  };

  editProductInMenu: RequestHandler = async (req, res, next) => {
    try {
      const { uuid, rol } = (req as any).user || {};
      const { productId } = req.params;
      const updatedData = req.body;
  
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
  
      // Encontrar el producto a editar
      const productIndex = menu.products.findIndex(
        (product) => product.uuid === productId
      );
  
      if (productIndex === -1) {
        return next(setError(404, "Product not found in menu"));
      }
  
      // Actualizar la información del producto
      menu.products[productIndex] = {
        ...menu.products[productIndex],
        ...updatedData,
      };
  
      // Guardar los cambios en el menú
      await menu.save();
  
      return res.status(200).json({
        success: true,
        message: "Producto editado correctamente en el menú!",
        info: menu.products[productIndex],
      });
    } catch (error) {
      return next(setError(500, `Error editing product: ${error}`));
    }
  };

  // Clientes funciones

  getMenuProductsForClient: RequestHandler = async (req, res, next) => {
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

      return res.status(200).json({
        success: true,
        message: "Correcto",
        products: menu?.products,
      });
    } catch (error) {
      return next(setError(500, `Error get menu info: ${error}`));
    }
  };

  getMenuByIdForClient: RequestHandler = async (req, res, next) => {
    try {
      const { uuid, rol } = (req as any).user || {};
      const { menuUuid } = req.params;

      if (!uuid || !rol) return next(setError(401, "Not authorized"));

      const menuModel = getModel<Menu>(Collection.MENUS, MenuMongoSchema);
      const menu = await menuModel.findOne({ uuid: menuUuid });

      if (!menu) return next(setError(500, "An unexpected error has occurred"));

      return res.status(200).json({
        success: true,
        message: "Correcto",
        menu: menu?.products,
      });
    } catch (error) {
      return next(setError(500, `Error get menu info: ${error}`));
    }
  };
}
