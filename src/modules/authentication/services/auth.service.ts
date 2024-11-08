import { Collection } from "@/config/constants";
import { getModel } from "@/config/database";
import { Admin, Customer } from "@/config/entities";
import { setError } from "@/helpers";
import { RequestHandler } from "express";
import RestaurantMongoSchema from "../../user/models/User.model";
import { comparePassword } from "../helpers";
import AdminMongoSchema from "@/modules/admin/models/Admin.model";
import { jwtHelpers, TokenPayload } from "@/config/security";

export class AuthServices {
  // register: RequestHandler = async (req, res, next) => {

  //   const userData = req.body;

  //   const model = getModel<Customer>(Collection.USERS, UserMongoSchema);
  //   const user = await model.findOne({ email: userData.email });

  //   if (user) return next(setError(404, "User already exists"));

  //   const newUser = new model(userData);

  //   const userInDB = await newUser.save();

  //   return res.status(201).json({
  //     user: userInDB,
  //   });
  // };

  // login: RequestHandler = async (req, res, next) => {
  //   const model = getModel<Customer>(Collection.USERS, UserMongoSchema);
  //   const userInDB = await model.findOne({ email: req.body.email });

  //   if (!userInDB) return next(setError(401, "Not authorized"));

  //   if (!comparePassword(req.body.password, userInDB.password))
  //     return next(setError(403, "Password incorrect"));

  //   const token = generateToken({ uuid: userInDB.uuid as string });

  //   return res.status(200).json(token);
  // };

  // Registro de usuario con rol específico (USER o ADMIN)
  register: RequestHandler = async (req, res, next) => {
    const { email, rol, ...userData } = req.body; // Extraer rol y datos adicionales
    console.log(req.body);

    const collectionName =
      rol === "ADMIN" ? Collection.ADMINS : Collection.USERS;
    const userSchema =
      rol === "ADMIN" ? AdminMongoSchema : RestaurantMongoSchema;
    const model = getModel<Customer | Admin>(collectionName, userSchema);

    try {
      // Verificar si el usuario ya existe
      const existingUser = await model.findOne({ email });
      if (existingUser) return next(setError(404, "User already exists"));

      // Crear y guardar el nuevo usuario
      const newUser = new model({ ...userData, email, rol });
      const userInDB = await newUser.save();

      return res.status(201).json({
        user: userInDB,
      });
    } catch (error) {
      return next(setError(500, `Error creating user: ${error}`));
    }
  };

  // Inicio de sesión de usuario
  login: RequestHandler = async (req, res, next) => {
    const { email, password, rol } = req.body;

    const collectionName =
      rol === "ADMIN" ? Collection.ADMINS : Collection.USERS;
    const userSchema =
      rol === "ADMIN" ? AdminMongoSchema : RestaurantMongoSchema;
    const model = getModel<Customer | Admin>(collectionName, userSchema);

    try {
      // Verificar si el usuario existe
      const userInDB = await model.findOne({ email });
      if (!userInDB) return next(setError(401, "Not authorized"));

      // Verificar la contraseña
      if (!comparePassword(password, userInDB.password))
        return next(setError(403, "Password incorrect"));

      // Generar token que incluye el rol

      const token = jwtHelpers.generateToken<string>(
        userInDB.uuid as string,
        rol
      );

      return res.status(200).json({ token });
    } catch (error) {
      return next(setError(500, `Error during login: ${error}`));
    }
  };
}
