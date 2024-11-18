import { RequestHandler } from "express";
import { RestaurantService } from "../services/restaurant.service";

const restaurantServices = new RestaurantService();

export class RestaurantController {
  create: RequestHandler = async (req, res, next) => {
    try {
      const response = restaurantServices.create(req, res, next);
      return response;
    } catch (error) {
      return next(error);
    }
  };

  getRestaurantInfo: RequestHandler = async (req, res, next) => {
    try {
      const response = restaurantServices.getRestaurantInfo(req, res, next);
      return response;
    } catch (error) {
      return next(error);
    }
  };
}
