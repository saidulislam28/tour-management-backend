import { Router } from "express";
import { createUserZod } from "../../../utils/user_zod";
import { userController } from "./user.controller";

import { checkAuth } from "../../../middleware/checkAuth";
import { validateRequest } from "../../../utils/ValidateRequest";
import { Role } from "./user.interface";

const router = Router();

router.post(
  "/register",
  validateRequest(createUserZod),
  userController.createUser
);

router.get(
  "/all-users",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  userController.getAllUsers
);

router.patch(
  "/:id",
  checkAuth(...Object.values(Role)),
  userController.updateUserController
);

export const UserRoutes = router;
