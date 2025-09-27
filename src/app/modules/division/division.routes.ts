import { Router } from "express";
import { divisionController } from "./division.controller";
import { checkAuth } from "../../../middleware/checkAuth";
import { Role } from "../user/user.interface";
import { multerUpload } from "../../../configs/multer.config";
import { validateRequest } from "../../../utils/ValidateRequest";
import { createDivisionSchema, updateDivisionSchema } from "./division.interface";

const router = Router();

router.post(
  "/create",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  multerUpload.single("file"),
  validateRequest(createDivisionSchema),
  divisionController.CreateDivision,
);
router.get("/", divisionController.GetAllDivision);
router.get("/:slug", divisionController.GetSingleDivision);
router.patch("/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  multerUpload.single("file"),
  validateRequest(updateDivisionSchema),
  divisionController.UpdateDivision
);
router.delete("/:id", divisionController.DeleteDivision);

export const DivisionRoutes = router;
