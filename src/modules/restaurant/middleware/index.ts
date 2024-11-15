import { Request, Response, NextFunction } from "express";
import { jwtHelpers } from "./../../../config/security/security";
import { setError } from "@/helpers";
import AdminMongoSchema from "@/modules/admin/models/Admin.model";
import { getModel } from "@/config/database";
import { Admin } from "@/config/entities";
import { Collection } from "@/config/constants";

// Middleware para verificar si el usuario es ADMIN
export const requireAdminRole = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // 1. Obtén el token del encabezado de autorización
    const tokenCookie = req.cookies.access_token;

    // const authHeader = req.headers.authorization;
    if (!tokenCookie) return next(setError(400, "Not authorized"));

    // 3. Verifica y decodifica el token
    const validateToken = jwtHelpers.verifyToken<string>(tokenCookie);

    if (!validateToken) {
      console.log("Token verification failed: token is invalid or expired");
      return next(setError(401, "Not authorized - invalid token"));
    }

    // Validar el token y obtener el rol
    if (!validateToken || !validateToken.uuid || !validateToken.rol)
      return next(setError(401, "Not authorized - invalid token"));

    // 4. Verifica que el rol sea "ADMIN"
    if (validateToken.rol !== "ADMIN") {
      return next(setError(403, "Access denied: Admins only"));
    }

    const AdminModel = getModel<Admin>(Collection.ADMINS, AdminMongoSchema);
    const user = await AdminModel.findOne({ uuid: validateToken.uuid });

    if (!user) return next(setError(404, "User not found middleware"));

    // Adjuntar el usuario en la solicitud
    (req as any).user = user;

    // Continúa con el siguiente middleware o controlador
    next();
  } catch (error) {
    return next(setError(500, `Error in authorization middleware: ${error}`));
  }
};
