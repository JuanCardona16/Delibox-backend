import { setError } from "@/helpers";
import { RequestHandler } from "express";

export class RestaurantService {

  create: RequestHandler = async (req, res, next) => {
    try {
      
      const {  } = req.body; // Your request body data

    } catch (error) {
      return next(setError(500, `Error creating restaurant: ${error}`));
    }
  }

}