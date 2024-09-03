import { Request, Response, NextFunction } from "express"

export const errorGlobalHandler = (err: any, _req: Request, res: Response, _next: NextFunction) => {
  const statusCode = err.statusCode || 500
  const message = err.message || 'Internal Server Error'

  res.status(statusCode).json({
    error: {
      message,
      status: statusCode,
    }
  })
}
