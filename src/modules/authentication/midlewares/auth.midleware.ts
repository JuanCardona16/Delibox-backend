import { Collection } from "@/config/constants";
import { getModel } from "@/config/database";
import { User } from "@/config/entities/User";
import { jwtHelpers, TokenPayload } from "@/config/security";
import { setError } from "@/helpers";
import { RequestHandler } from "express";
import UserMongoSchema from "../../user/models/User.model";

export const authorize: RequestHandler = async (req, _res, next) => {
  try {
    const model = getModel<User>(Collection.USERS, UserMongoSchema);
    const authHeader = req.headers.authorization;

    if (!authHeader) return next(setError(400, "Not authorized"));

    const token = authHeader.split(" ")[1];

    const validateToken = jwtHelpers.verityToken<TokenPayload<string>>(token)

    if (!validateToken || !validateToken.uuid)
      return next(setError(401, "Not authorized - invalid token"));

    const user = (await model.findOne({ uuid: validateToken.uuid })) as User;

    if (!user) return next(setError(404, "User not found"));

    (req as any).user = user;

    next();
  } catch (error) {
    return next(setError(401, `Not authorized -> ${error}`));
  }
};
