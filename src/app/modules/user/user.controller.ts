/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";
import { CatchAsync } from "../../../utils/catchAsync";
import { sendResponse } from "../../../utils/response.helper";
import { userService } from "./user.service";

const updateUserController = CatchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.id;
    // const token = req.headers.authorization;
    // const verifiedToken = verifyToken(token as string, envVars.JWT_SECRET);

    const verifiedToken = req.user;

    const payload = req.body;

    const user = await userService.updateUser(
      userId,
      payload,
      verifiedToken as JwtPayload
    );

    sendResponse(res, {
      success: true,
      message: "User updated Successfully",
      statusCode: httpStatus.OK,
      data: user,
    });

    // res.status(httpStatus.CREATED).json({
    //   message: "User Created Successfully",
    //   user,
    // });
  }
);

const createUser = CatchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await userService.createUser(req.body);

    sendResponse(res, {
      success: true,
      message: "User Created Successfully",
      statusCode: httpStatus.CREATED,
      data: user,
    });

    // res.status(httpStatus.CREATED).json({
    //   message: "User Created Successfully",
    //   user,
    // });
  }
);

// const createUser = async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     const user = await userService.createUser(req.body);

//     res.status(httpStatus.CREATED).json({
//       message: "User Created Successfully",
//       user,
//     });
//   } catch (error: any) {
//     console.log(error);
//     next(error);
//   }
// };

const getAllUsers = CatchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await userService.getAllUsers();

    sendResponse(res, {
      success: true,
      message: "User retrieved Successfully",
      statusCode: httpStatus.CREATED,
      data: result.data,
      meta: result.meta,
    });

    // res.status(httpStatus.CREATED).json({
    //   message: "User retrieved Successfully",
    //   success: true,
    //   data: users,
    // });
  }
);

export const userController = {
  createUser,
  getAllUsers,
  updateUserController,
};
