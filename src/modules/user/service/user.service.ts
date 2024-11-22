import { getModel } from "@/config/database";
import { Collection } from "@/config/constants";
import { RequestHandler } from "express";
import CustomerMongoSchema from "../../user/models/Customer.model";
import { setError } from "@/helpers";
import { Admin, Customer } from "@/config/entities";
import AdminMongoSchema from "@/modules/admin/models/Admin.model";

export class UserService {
  // getUserInfo: RequestHandler = async (req, res, next) => {
  //   // Obtener el uuid y el rol desde req.user, que fue establecido en el middleware de autorización
  //   const { uuid, rol } = (req as any).user || {};
  //   console.log(uuid, rol)

  //   if (!uuid || !rol)
  //     return next(setError(401, "Not authorized - missing token data"));

  //   // Determinar el esquema y la colección en función del rol del usuario
  //   const collectionName =
  //     rol === "USER" ? Collection.USERS : Collection.ADMINS;

  //   const userSchema =
  //     rol === "USER" ? CustomerMongoSchema : AdminMongoSchema;

  //   const model = getModel<Customer | Admin>(collectionName, userSchema);

  //   try {
  //     // Buscar al usuario en la base de datos según el uuid del token
  //     const user = await model.findOne({ uuid });

  //     console.log( "usuario encontrado servicio: ")
  //     console.log(user)

  //     if (!user) return next(setError(404, "User not found servicio"));

  //     // Retornar la información del usuario autenticado
  //     return res.status(200).json(user);
  //   } catch (error) {
  //     return next(setError(500, `Error retrieving user information: ${error}`));
  //   }
  // };

  getCustomerInfo: RequestHandler = async (req, res, next) => {
    // Obtener el uuid y el rol desde req.user, que fue establecido en el middleware de autorización
    const { uuid, rol } = (req as any).user || {};

    if (!uuid || !rol)
      return next(setError(401, "Not authorized - missing token data"));

    const model = getModel<Customer | Admin>(Collection.USERS, CustomerMongoSchema);

    try {
      // Buscar al usuario en la base de datos según el uuid del token
      const user = await model.findOne({ uuid });

      console.log( "usuario encontrado servicio: ")
      console.log(user)

      if (!user) return next(setError(404, "User not found servicio"));

      // Retornar la información del usuario autenticado
      return res.status(200).json(user);
    } catch (error) {
      return next(setError(500, `Error retrieving user information: ${error}`));
    }
  }

  getAdminInfo: RequestHandler = async (req, res, next) => {
    // Obtener el uuid y el rol desde req.user, que fue establecido en el middleware de autorización
    const { uuid, rol } = (req as any).user || {};

    if (!uuid || !rol)
      return next(setError(401, "Not authorized - missing token data"));

    const model = getModel<Customer | Admin>(Collection.ADMINS, AdminMongoSchema);

    try {
      // Buscar al usuario en la base de datos según el uuid del token
      const user = await model.findOne({ uuid });

      console.log( "usuario encontrado servicio: ")
      console.log(user)

      if (!user) return next(setError(404, "User not found servicio"));

      // Retornar la información del usuario autenticado
      return res.status(200).json(user);
    } catch (error) {
      return next(setError(500, `Error retrieving user information: ${error}`));
    }
  }
}
