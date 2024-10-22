import { getModel } from "@/config/database";
import { Collection } from "@/config/constants";
import { RequestHandler } from "express";
import UserMongoSchema from "../models/User.model";
import { setError } from "@/helpers";
import { User } from "@/config/entities";

export class UserService {
  getUserInfo: RequestHandler = async (req, res, next) => {
    const { uuid } = req.params;

    const model = getModel<User>(Collection.USERS, UserMongoSchema);
    const user = await model.findOne({ uuid });

    if (!user) return next(setError(404, "User not found"));

    return res.status(200).json({
      data: user,
    });
  };
}
