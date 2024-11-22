import { Collection } from "@/config/constants";
import { getModel } from "@/config/database";
import { Admin, Customer } from "@/config/entities/User";
import { jwtHelpers } from "@/config/security";
import { setError } from "@/helpers";
import { RequestHandler } from "express";
import CustomerMongoSchema from "../../user/models/Customer.model";
import AdminMongoSchema from "@/modules/admin/models/Admin.model";

// export const authorize: RequestHandler = async (req, _res, next) => {
//   try {
//     const userTokenCookie = req.cookies.user_access_token;
//     const tokenCookie = req.cookies.admin_access_token;

//     if (!tokenCookie) return next(setError(400, "Not authorized"));

//     const validateToken = jwtHelpers.verifyToken<string>(tokenCookie);

//     if (!validateToken) {
//       console.log("Token verification failed: token is invalid or expired");
//       return next(setError(401, "Not authorized - invalid token"));
//     }

//     // Validar el token y obtener el rol
//     if (!validateToken || !validateToken.uuid || !validateToken.rol)
//       return next(setError(401, "Not authorized - invalid token"));

//     // Determinar el esquema y colección según el rol
//     let user;

//     if (validateToken.rol === "USER") {
//       const userModel = getModel<Customer>(Collection.USERS, CustomerMongoSchema);
//       user = await userModel.findOne({ uuid: validateToken.uuid });
//     } else if (validateToken.rol === "ADMIN") {
//       const AdminModel = getModel<Admin>(Collection.ADMINS, AdminMongoSchema);
//       user = await AdminModel.findOne({ uuid: validateToken.uuid });
//     } else {
//       return next(setError(403, "Not authorized - invalid role"));
//     }

//     if (!user) return next(setError(404, "User not found middleware"));

//     // Adjuntar el usuario en la solicitud
//     (req as any).user = user;

//     next();
//   } catch (error) {
//     return next(setError(401, `Not authorized -> ${error}`));
//   }
// };

export const authorize: RequestHandler = async (req, _res, next) => {
  try {
    const userTokenCookie = req.cookies.user_access_token;
    const adminTokenCookie = req.cookies.admin_access_token;

    const tokenCookie = userTokenCookie || adminTokenCookie;

    if (!tokenCookie)
      return next(setError(400, "Not authorized - no token provided"));

    const validateToken = jwtHelpers.verifyToken<{ uuid: string; rol: string }>(
      tokenCookie
    );

    if (!validateToken) {
      console.log("Token verification failed: token is invalid or expired");
      return next(setError(401, "Not authorized - invalid token"));
    }

    // Validar el token y obtener el rol
    if (!validateToken.uuid || !validateToken.rol)
      return next(setError(401, "Not authorized - invalid token"));

    // Determinar el esquema y colección según el rol
    let user;

    if (validateToken.rol === "USER" && userTokenCookie) {
      const userModel = getModel<Customer>(
        Collection.USERS,
        CustomerMongoSchema
      );
      user = await userModel.findOne({ uuid: validateToken.uuid });
    } else if (validateToken.rol === "ADMIN" && adminTokenCookie) {
      const AdminModel = getModel<Admin>(
        Collection.ADMINS,
        AdminMongoSchema
      );
      user = await AdminModel.findOne({ uuid: validateToken.uuid });
    } else {
      return next(setError(403, "Not authorized - invalid role or token type"));
    }

    if (!user) return next(setError(404, "User not found middleware"));

    // Adjuntar el usuario en la solicitud
    (req as any).user = user;

    next();
  } catch (error) {
    console.error("Error in authorize middleware:", error);
    return next(setError(401, `Not authorized -> ${error}`));
  }
};
