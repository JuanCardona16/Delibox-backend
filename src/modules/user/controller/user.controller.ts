import { RequestHandler } from "express";
import { UserService } from './../service/user.service';

const userService = new UserService()

export class UserController {

  getUserInfo: RequestHandler = async (req, res, next) => {
    try {
      const response = userService.getCustomerInfo(req, res, next);
      return response
    } catch (error) {
      return next(error);
    }
  }

  getAdminInfo: RequestHandler = async (req, res, next) => {
    try {
      const response = userService.getAdminInfo(req, res, next);
      return response
    } catch (error) {
      return next(error);
    }
  }

}