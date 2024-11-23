
import { RequestHandler } from 'express';
import { getAdminOrderRestaurantsById } from '../services'

export class OrdersController {

  getAdminOrders: RequestHandler = async (req, res, next) => {
    try {
      const response = getAdminOrderRestaurantsById(req, res, next)
      return response
    } catch (error) {
      return next(error)
    }
  }

}

