import { setError } from "@/helpers";
import { RequestHandler } from "express";

export class RestaurantService {
  create: RequestHandler = async (req, res, next) => {
    try {
      const data = req.body; // Your request body data
      const { uuid } = req.params; // Your route parameter for the user's UUID
      // Extrae el uuid del usuario desde `req.user`, que fue establecido por el middleware

      console.log(data);
    } catch (error) {
      return next(setError(500, `Error creating restaurant: ${error}`));
    }
  };
}
