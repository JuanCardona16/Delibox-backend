import { getModel } from "@/config/database";
import { setError } from "@/helpers";
import { RequestHandler } from "express";
import { Order, OrderMongoSchema } from "../models";
import { Collection } from "@/config/constants";

export const getAdminOrderRestaurantsById: RequestHandler = async (
  req,
  res,
  next
) => {
  try {
    const { uuid, rol } = (req as any).user || {};
    const { restaurantId } = req.params;

    if (!uuid || !rol)
      return next(setError(401, "Not authorized - missing token data"));

    const model = getModel<Order>(Collection.ORDERS, OrderMongoSchema);

    const orders = await model.find({ restaurantId: restaurantId });

    if (!orders) return next(setError(404, "Orders not found"));

    return res.status(200).json(orders);
  } catch (error) {
    return next(setError(500, `Ah ocurrido un error inesperado: ${error}`));
  }
};
