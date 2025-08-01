import { IUser } from "../app/modules/user/user.interface";
import { User } from "../app/modules/user/user.model";
import { envVars } from "../configs/env";
import AppError from "../helpers/CustomError";
import { generateToken, verifyToken } from "./jwt";
import httpStatus from "http-status-codes";

export const createUserTokens = (user: Partial<IUser>) => {
  const jwtPayload = {
    userId: user._id,
    email: user.email,
    role: user.role,
  };

  const accessToken = generateToken(
    jwtPayload,
    envVars.JWT_SECRET,
    envVars.JWT_ACCESS_TOKEN_EXPIRES
  );
  const jwtRefreshToken = generateToken(
    jwtPayload,
    envVars.JWT_REFRESH_SECRET,
    envVars.JWT_REFRESH_TOKEN_EXPIRES
  );

  return {
    accessToken,
    jwtRefreshToken,
  };
};

export const createNewAccessTokenWithRefreshToken = async (refreshToken: string) => {
  const verifyRefreshToken = await verifyToken(
    refreshToken,
    envVars.JWT_REFRESH_SECRET
  );

  const isUserExist = await User.findOne({ email: verifyRefreshToken.email });

  if (!isUserExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "User credentials not Matched");
  }

  const jwtPayload = {
    userId: isUserExist._id,
    email: isUserExist.email,
    role: isUserExist.role,
  };

  const NewJwtToken = generateToken(
    jwtPayload,
    envVars.JWT_SECRET,
    envVars.JWT_ACCESS_TOKEN_EXPIRES
  );

  return NewJwtToken
};
