import { NextFunction, Request, Response, Router } from "express";
import { AuthController } from "./auth.controller";
import { checkAuth } from "../../../middleware/checkAuth";
import { Role } from "../user/user.interface";
import passport from "passport";
import { envVars } from "../../../configs/env";

const router = Router();

router.post("/login", AuthController.credentialsLogin);
router.post("/refresh-token", AuthController.getAccessToken);
router.post("/logout", AuthController.logout);
router.post(
  "/change-password",
  checkAuth(...Object.values(Role)),
  AuthController.ChangePassword
);
router.post(
  "/reset-password",
  checkAuth(...Object.values(Role)),
  AuthController.ResetPassword
);
router.post(
  "/set-password",
  checkAuth(...Object.values(Role)),
  AuthController.SetPassword
);
router.post(
  "/forgot-password",
  AuthController.ForgotPassword
);

router.get(
  "/google",
  async (req: Request, res: Response, next: NextFunction) => {
    const redirect = req.query.redirect;
    passport.authenticate("google", {
      scope: ["profile", "email"],
      state: redirect as string,
    })(req, res, next);
  }
);

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: `${envVars.FRONTEND_URL}/login?error=There is some error with login` }),
  AuthController.googleCallbackController
);

export const AuthRoutes = router;
