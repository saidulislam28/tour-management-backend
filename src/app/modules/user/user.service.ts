import httpStatus from "http-status-codes";
import AppError from "../../../helpers/CustomError";
import { IAuthProvider, IUser, Role } from "./user.interface";
import { User } from "./user.model";
import bcryptjs from "bcryptjs";
import { JwtPayload } from "jsonwebtoken";

const updateUser = async (
  userId: string,
  payload: Partial<IUser>,
  decodedToken: JwtPayload
) => {
  const isUserExist = await User.findOne({ _id: userId });

  if (!isUserExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "User not found");
  }

  if (payload.role) {
    if (decodedToken.role === Role.USER || decodedToken.role === Role.GUIDE) {
      throw new AppError(httpStatus.FORBIDDEN, "You are Not Authorized");
    }

    if (payload.role === Role.SUPER_ADMIN && decodedToken.role === Role.ADMIN) {
      throw new AppError(httpStatus.FORBIDDEN, "You are Not Authorized");
    }
  }

  if (payload.isActive || payload.isDeleted || payload.isVerified) {
    if (decodedToken.role === Role.USER || decodedToken.role === Role.GUIDE) {
      throw new AppError(httpStatus.FORBIDDEN, "You are Not Authorized");
    }
  }

  if (payload.password) {
    payload.password = await bcryptjs.hash(payload.password, 10);
  }

  const newUpdateUser = await User.findByIdAndUpdate(userId, payload, {
    new: true,
    runValidators: true,
  });

  return newUpdateUser;
};

const createUser = async (payload: Partial<IUser>) => {
  const { email, password, ...rest } = payload;

  const isUserExist = await User.findOne({ email: email });

  if (isUserExist) {
    throw new AppError(httpStatus.CONFLICT, "user already exist");
  }

  const hashedPassword = await bcryptjs.hash(password as string, 10);

  const authProvider: IAuthProvider = {
    provider: "credentials",
    providerId: email as string,
  };

  const user = await User.create({
    email,
    password: hashedPassword,
    auths: [authProvider],
    ...rest,
  });

  return user;
};

const getAllUsers = async () => {
  const users = await User.find({});

  const total = await User.countDocuments();

  return {
    data: users,
    meta: {
      total,
    },
  };
};

export const userService = {
  createUser,
  getAllUsers,
  updateUser,
};
