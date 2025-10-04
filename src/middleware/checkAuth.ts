import { NextFunction, Request, Response } from "express";
import AppError from "../helpers/CustomError";
import { verifyToken } from "../utils/jwt";
import { envVars } from "../configs/env";
import { JwtPayload } from "jsonwebtoken";
import { User } from "../app/modules/user/user.model";
import httpStatus from 'http-status-codes'
import { IsActive } from "../app/modules/user/user.interface";
export const checkAuth =
  (...authRoles: string[]) =>
    async (req: Request, res: Response, next: NextFunction) => {
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



        const isUserExist = await User.findOne({ email: jwtVerifyToken.email })

        if (!isUserExist) {
          throw new AppError(httpStatus.BAD_REQUEST, "User does not exist")
        }

        if (!isUserExist.isVerified) {
          throw new AppError(httpStatus.BAD_REQUEST, "User is Verified")
        }

        if (isUserExist.isActive === IsActive.BLOCKED || isUserExist.isActive === IsActive.INACTIVE) {
          throw new AppError(httpStatus.BAD_REQUEST, "user is not active")
        }
        if (!isUserExist.isDeleted) {
          throw new AppError(httpStatus.BAD_REQUEST, "user is Deleted")
        }



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
