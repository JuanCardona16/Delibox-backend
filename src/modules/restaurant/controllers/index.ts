import { RequestHandler } from "express";
import { RestaurantService } from "../services/restaurant.service";

const restaurantServices = new RestaurantService();

export class RestaurantController {
  create: RequestHandler = async (req, res, next) => {
    try {
      const response = restaurantServices.create(req, res, next);
      return response;
    } catch (error) {
      console.log(error);
      return next(error);
    }
  };
}