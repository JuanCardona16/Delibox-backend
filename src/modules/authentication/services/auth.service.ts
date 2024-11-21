import { Collection } from "@/config/constants";
import { getModel } from "@/config/database";
import { Admin, Customer } from "@/config/entities";
import { setError } from "@/helpers";
import { RequestHandler } from "express";
import UserMongoSchema from "@/modules/user/models/Customer.model";
import { comparePassword } from "../helpers";
import AdminMongoSchema from "@/modules/admin/models/Admin.model";
import { jwtHelpers } from "@/config/security";

export class AuthServices {
  // Registro de usuario con rol específico (USER o ADMIN)
  register: RequestHandler = async (req, res, next) => {
    const { email, rol, ...userData } = req.body; // Extraer rol y datos adicionales
    console.log(req.body);

    const collectionName =
      rol === "ADMIN" ? Collection.ADMINS : Collection.USERS;
    const userSchema = rol === "ADMIN" ? AdminMongoSchema : UserMongoSchema;
    const model = getModel<Customer | Admin>(collectionName, userSchema);

    try {
      // Verificar si el usuario ya existe
      const existingUser = await model.findOne({ email });
      if (existingUser) return next(setError(404, "User already exists"));

      // Crear y guardar el nuevo usuario
      const newUser = new model({ ...userData, email, rol });
      const userInDB = await newUser.save();

      const token = jwtHelpers.generateToken<string>(
        userInDB.uuid as string,
        rol
      );

      res.cookie("access_token", token, {
        httpOnly: true,
        secure: false,
      });

      return res
        .status(201)
        .json({ success: true, message: "Regístro exitoso!" });
    } catch (error) {
      return next(setError(500, `Error creating user: ${error}`));
    }
  };

  // Inicio de sesión de usuario
  login: RequestHandler = async (req, res, next) => {
    const { email, password, rol } = req.body;
    console.log(req.body)

    const collectionName =
      rol === "ADMIN" ? Collection.ADMINS : Collection.USERS;
    const userSchema = rol === "ADMIN" ? AdminMongoSchema : UserMongoSchema;
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

      // Asignar el nombre de la cookie según el rol
      const cookieName =
        rol === "USER" ? "user_access_token" : "admin_access_token";

      // Configurar y enviar la cookie correspondiente
      res.cookie(cookieName, token, {
        httpOnly: true,
        secure: true, // Cambiar a true si usas HTTPS en producción
        sameSite: "none",
        path: "/", // Opcional: puedes limitarla a una ruta específica
      });

      // Respuesta de éxito
      return res.status(200).json({
        success: true,
        message: "Inicio de sesión exitoso!",
      });

      // if (rol === "USER") {
      //   res.cookie("user_access_token", token, {
      //     httpOnly: true,
      //     secure: false,
      //     sameSite: "lax",
      //   });
      // } else if (rol === "ADMIN") {
      //   res.cookie("admin_access_token", token, {
      //     httpOnly: true,
      //     secure: false,
      //     sameSite: "lax",
      //   });
      // }

      // return res
      //   .status(200)
      //   .json({ success: true, message: "Inicio de sesión exitoso!" });
    } catch (error) {
      return next(setError(500, `Error during login: ${error}`));
    }
  };

  // logout
  logout: RequestHandler = async (_req, res, _next) => {
    res.clearCookie("access_token", {
      httpOnly: true,
      secure: false, // Cambia a true en producción con HTTPS
      sameSite: "lax",
    });
    return res
      .status(200)
      .json({ success: true, message: "Sesión cerrada correctamente" });
  };
}
