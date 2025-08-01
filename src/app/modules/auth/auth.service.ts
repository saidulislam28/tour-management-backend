import bcryptjs from "bcryptjs";
import httpStatus from "http-status-codes";
import AppError from "../../../helpers/CustomError";
import {
  createNewAccessTokenWithRefreshToken,
  createUserTokens,
} from "../../../utils/userTokens";
import { IUser } from "../user/user.interface";
import { User } from "../user/user.model";
import { JwtPayload } from "jsonwebtoken";

const credentialsLogin = async (payload: Partial<IUser>) => {
  const { email, password } = payload;

  const isUserExist = await User.findOne({ email: email });

  if (!isUserExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "user not exist");
  }

  console.log("hitting1>>");
  const isMatchPassword = await bcryptjs.compare(
    password as string,
    isUserExist.password as string
  );

  if (!isMatchPassword) {
    throw new AppError(httpStatus.BAD_REQUEST, "Password not Matched");
  }

  const { accessToken, jwtRefreshToken } = createUserTokens(isUserExist);

  const userWithoutPassword = await User.findOne({ email }).select("-password");

  return {
    accessToken,
    jwtRefreshToken,
    user: userWithoutPassword,
  };
};
const getNewAccessToken = async (refreshToken: string) => {
  const NewRefreshToken = await createNewAccessTokenWithRefreshToken(
    refreshToken
  );

  return { accessToken: NewRefreshToken };
};
const ResetPassword = async (
  oldPassword: string,
  newPassword: string,
  decodedToken: JwtPayload
) => {
  console.log(decodedToken);

  const isUserExist = await User.findOne({ email: decodedToken.email });

  if (!isUserExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "User not found");
  }

  const isPasswordMatched = await bcryptjs.compare(
    oldPassword,
    isUserExist?.password as string
  );

  if (!isPasswordMatched) {
    throw new AppError(httpStatus.BAD_REQUEST, "Password Not matched!!!");
  }

  const hashedPassword = await bcryptjs.hash(newPassword, 10);

  const updatePassword = await User.findOneAndUpdate(
    { email: decodedToken.email },
    { password: hashedPassword },
    { new: true }
  );

  return true;
};

export const AuthService = {
  credentialsLogin,
  getNewAccessToken,
  ResetPassword,
};
