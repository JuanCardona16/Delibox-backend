import { Request, Response, NextFunction } from 'express';
import { jwtHelpers } from './../../../config/security/security';
import { setError } from '@/helpers';

// Middleware para verificar si el usuario es ADMIN
export const requireAdminRole = (req: Request, res: Response, next: NextFunction) => {
  try {
    // 1. Obtén el token del encabezado de autorización
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return next(setError(401, 'No token provided'));
    }

    // 2. Extrae el token
    const token = authHeader.split(' ')[1];
    if (!token) {
      return next(setError(401, 'Token format is invalid'));
    }

    // 3. Verifica y decodifica el token
    const user = jwtHelpers.verifyToken<string>(token);
    if (!user) {
      return next(setError(401, 'Invalid or expired token'));
    }

    // 4. Verifica que el rol sea "ADMIN"
    if (user.rol !== 'ADMIN') {
      return next(setError(403, 'Access denied: Admins only'));
    }

    // Continúa con el siguiente middleware o controlador
    next();
  } catch (error) {
    return next(setError(500, `Error in authorization middleware: ${error}`));
  }
};
