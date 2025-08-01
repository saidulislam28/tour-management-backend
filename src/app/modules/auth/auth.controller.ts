import { NextFunction, Request, Response } from "express";
import { CatchAsync } from "../../../utils/catchAsync";
import { sendResponse } from "../../../utils/response.helper";
import httpStatus from "http-status-codes";
import { AuthService } from "./auth.service";
import AppError from "../../../helpers/CustomError";
import { SetAuthTokens } from "../../../utils/setTokens";
import { createUserTokens } from "../../../utils/userTokens";
import { envVars } from "../../../configs/env";
import { JwtPayload } from "jsonwebtoken";
import passport from "passport";

const credentialsLogin = CatchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // const user = await userService.createUser(req.body);

    // const loginInfo = await AuthService.credentialsLogin(req.body);

    passport.authenticate("local", async (error: any, user: any, info: any) => {
      if (error) {
        return new AppError(401, info.message);
      }

      if (!user) {
        return new AppError(401, info.message);
      }

      const userTokens = await createUserTokens(user);
      const { password, ...rest } = user.toObject();

      SetAuthTokens(res, userTokens);

      sendResponse(res, {
        success: true,
        message: "User Logged in Successfully",
        statusCode: httpStatus.OK,
        data: {
          accessToken: userTokens.accessToken,
          refreshToken: userTokens.jwtRefreshToken,
          user: rest,
        },
      });
    })(req, res, next);

    // res.cookie("accessToken", loginInfo.accessToken, {
    //   httpOnly: true,
    //   secure: false,
    // });

    // res.cookie("refreshToken", loginInfo.jwtRefreshToken, {
    //   httpOnly: true,
    //   secure: false,
    // });
  }
);
const getAccessToken = CatchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // const user = await userService.createUser(req.body);

    const refreshAccessToken = req.cookies.refreshToken;

    console.log("refreshAccessToken", refreshAccessToken);

    if (!refreshAccessToken) {
      throw new AppError(httpStatus.BAD_REQUEST, "Refresh Token not found");
    }

    const loginInfo = await AuthService.getNewAccessToken(refreshAccessToken);
    SetAuthTokens(res, loginInfo);

    sendResponse(res, {
      success: true,
      message: "User Logged in Successfully",
      statusCode: httpStatus.OK,
      data: loginInfo,
    });
  }
);
const logout = CatchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });

    sendResponse(res, {
      success: true,
      message: "User Logged out Successfully",
      statusCode: httpStatus.OK,
      data: "",
    });
  }
);
const ResetPassword = CatchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const oldPassword = req.body.oldPassword;
    const NewPassword = req.body.newPassword;
    const decodedToken = req.user;

    console.log({ decodedToken });

    const updatedPassword = await AuthService.ResetPassword(
      oldPassword,
      NewPassword,
      decodedToken as JwtPayload
    );

    sendResponse(res, {
      success: true,
      message: "Reset Successfully",
      statusCode: httpStatus.OK,
      data: "",
    });
  }
);
const googleCallbackController = CatchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    let redirectTo = req.query.state ? (req.query.state as string) : "";

    if (redirectTo) {
      redirectTo = redirectTo.slice(1);
    }

    const user = req.user;

    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, "user not found");
    }

    const tokenInfo = createUserTokens(user);

    SetAuthTokens(res, tokenInfo);

    res.redirect(`${envVars.FRONTEND_URL}/${redirectTo}`);

    // sendResponse(res, {
    //   success: true,
    //   message: "Reset Successfully",
    //   statusCode: httpStatus.OK,
    //   data: "",
    // });
  }
);

export const AuthController = {
  credentialsLogin,
  getAccessToken,
  logout,
  ResetPassword,
  googleCallbackController,
};
