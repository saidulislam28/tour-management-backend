import { Response } from "express";

export interface TokenInfo {
  accessToken?: string;
  jwtRefreshToken?: string;
}

export const SetAuthTokens = (res: Response, tokenInfo: TokenInfo) => {
  if (tokenInfo.accessToken) {
    res.cookie("accessToken", tokenInfo.accessToken, {
      httpOnly: true,
      secure: false,
    });
  }
  if (tokenInfo.jwtRefreshToken) {
    res.cookie("refreshToken", tokenInfo.jwtRefreshToken, {
      httpOnly: true,
      secure: false,
    });
  }
};
