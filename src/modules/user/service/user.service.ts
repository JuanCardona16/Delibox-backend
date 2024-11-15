import { getModel } from "@/config/database";
import { Collection } from "@/config/constants";
import { RequestHandler } from "express";
import RestaurantMongoSchema from "../../restaurant/model/Restaurant.model";
import { setError } from "@/helpers";
import { Admin, Customer } from "@/config/entities";
import AdminMongoSchema from "@/modules/admin/models/Admin.model";

export class UserService {
  getUserInfo: RequestHandler = async (req, res, next) => {
    // Obtener el uuid y el rol desde req.user, que fue establecido en el middleware de autorización
    const { uuid, rol } = (req as any).user || {};

    if (!uuid || !rol)
      return next(setError(401, "Not authorized - missing token data"));

    // Determinar el esquema y la colección en función del rol del usuario
    const collectionName =
      rol === "ADMIN" ? Collection.ADMINS : Collection.USERS;
    const userSchema =
      rol === "ADMIN" ? AdminMongoSchema : RestaurantMongoSchema;
    const model = getModel<Customer | Admin>(collectionName, userSchema);

    try {
      // Buscar al usuario en la base de datos según el uuid del token
      const user = await model.findOne({ uuid });
      if (!user) return next(setError(404, "User not found servicio"));

      // Retornar la información del usuario autenticado
      return res.status(200).json(user);
    } catch (error) {
      return next(setError(500, `Error retrieving user information: ${error}`));
    }
  };
}
