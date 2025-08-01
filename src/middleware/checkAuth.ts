import { NextFunction, Request, Response } from "express";
import AppError from "../helpers/CustomError";
import { verifyToken } from "../utils/jwt";
import { envVars } from "../configs/env";
import { JwtPayload } from "jsonwebtoken";

export const checkAuth =
  (...authRoles: string[]) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization;
      
      console.log(token);

      if (!token) {
        throw new AppError(403, "Token not given");
      }

      const jwtVerifyToken = verifyToken(
        token,
        envVars.JWT_SECRET
      ) as JwtPayload;

      req.user = jwtVerifyToken;

      console.log(jwtVerifyToken);

      if (!authRoles.includes(jwtVerifyToken.role)) {
        throw new AppError(403, "You are not permitted to access this route");
      }

      next();
    } catch (error) {
      next(error);
    }
  };
