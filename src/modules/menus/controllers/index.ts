import { RequestHandler } from "express";
import { MenuServices } from "../services/menu.service";

const menuServices = new MenuServices();

export class MenuController {
  getInfo: RequestHandler = async (req, res, next) => {
    try {
      const response = menuServices.getMenuInfo(req, res, next);
      return response;
    } catch (error) {
      return next(error);
    }
  };

  updateMenu: RequestHandler = async (req, res, next) => {
    try {
      const response = menuServices.updateMenu(req, res, next);
      return response;
    } catch (error) {
      return next(error);
    }
  };
}
