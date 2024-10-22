import { Response, Request, NextFunction } from "express"

// Este middleware toma una función (en este caso, un controlador) y la ejecuta dentro de una promesa. 
// Si ocurre un error en cualquier parte de la función, catch(next) lo captura y lo pasa al siguiente middleware, 
// que en este caso será el manejador de errores global.
export const asyncHandler = (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
  Promise.resolve(fn(req, res, next)).catch(next)
}
