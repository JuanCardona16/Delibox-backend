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

// export const authorize: RequestHandler = async (req, _res, next) => {
//   try {
//     const userTokenCookie = req.cookies.user_access_token;
//     const adminTokenCookie = req.cookies.admin_access_token;

//     console.log('User Token:', userTokenCookie);
//     console.log('Admin Token:', adminTokenCookie);

//     const tokenCookie = userTokenCookie || adminTokenCookie;

//     if (!tokenCookie)
//       return next(setError(400, "Not authorized - no token provided"));
    
//     const validateToken = jwtHelpers.verifyToken<{ uuid: string; rol: string }>(
//       tokenCookie
//     );

//     console.log('Validated Token:', validateToken);

//     if (!validateToken) {
//       console.log("Token verification failed: token is invalid or expired");
//       return next(setError(401, "Not authorized - invalid token"));
//     }

//     // Validar el token y obtener el rol
//     if (!validateToken.uuid || !validateToken.rol)
//       return next(setError(401, "Not authorized - invalid token"));

//     console.log("middleware", validateToken)

//     if (validateToken.rol === "ADMIN") {

//       const AdminModel = getModel<Admin>(Collection.ADMINS, AdminMongoSchema);
//       const adminUser = await AdminModel.findOne({ uuid: validateToken.uuid });

//       console.log('Admin User Found:', adminUser);

//       if (!adminUser) {
//         return next(setError(404, "Admin not found"));
//       }

//       (req as any).user = adminUser;

//       next()

//     } else if (validateToken.rol === "USER") {

//       const userModel = getModel<Customer>(Collection.USERS, CustomerMongoSchema);
//       const customerUser = await userModel.findOne({ uuid: validateToken.uuid });

//       if (!customerUser) {
//         return next(setError(404, "Admin not found"));
//       }

//       (req as any).user = customerUser;

//       next()

//     } else {
//       return next(setError(403, "Not authorized - invalid role or token type"));
//     }

//   } catch (error) {
//     console.error("Error in authorize middleware:", error);
//     return next(setError(401, `Not authorized -> ${error}`));
//   }
// };

// adminAuthorize.ts

export const adminAuthorize: RequestHandler = async (req, _res, next) => {
  try {
    const adminTokenCookie = req.cookies.admin_access_token;

    if (!adminTokenCookie)
      return next(setError(400, "Not authorized - no admin token"));
    
    const validateToken = jwtHelpers.verifyToken<{ uuid: string; rol: string }>(
      adminTokenCookie
    );

    if (!validateToken || validateToken.rol !== "ADMIN") {
      return next(setError(401, "Not authorized - invalid admin token"));
    }

    const AdminModel = getModel<Admin>(Collection.ADMINS, AdminMongoSchema);
    const adminUser = await AdminModel.findOne({ uuid: validateToken.uuid });

    if (!adminUser) {
      return next(setError(404, "Admin not found"));
    }

    (req as any).user = adminUser;
    next();

  } catch (error) {
    console.error("Error in admin authorize middleware:", error);
    return next(setError(401, `Not authorized -> ${error}`));
  }
};

// userAuthorize.ts
export const userAuthorize: RequestHandler = async (req, _res, next) => {
  try {
    const userTokenCookie = req.cookies.user_access_token;

    if (!userTokenCookie)
      return next(setError(400, "Not authorized - no user token"));
    
    const validateToken = jwtHelpers.verifyToken<{ uuid: string; rol: string }>(
      userTokenCookie
    );

    if (!validateToken || validateToken.rol !== "USER") {
      return next(setError(401, "Not authorized - invalid user token"));
    }

    const userModel = getModel<Customer>(Collection.USERS, CustomerMongoSchema);
    const customerUser = await userModel.findOne({ uuid: validateToken.uuid });

    if (!customerUser) {
      return next(setError(404, "User not found"));
    }

    (req as any).user = customerUser;
    next();

  } catch (error) {
    console.error("Error in user authorize middleware:", error);
    return next(setError(401, `Not authorized -> ${error}`));
  }
};
