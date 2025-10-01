import { Router } from "express";
import { tourController } from "./tour.controller";
import { checkAuth } from "../../../middleware/checkAuth";
import { Role } from "../user/user.interface";
import { validateRequest } from "../../../utils/ValidateRequest";
import { createTourZodSchema, updateTourZodSchema } from "./tour.interface";
import { multerUpload } from "../../../configs/multer.config";
const router = Router();


router.post("/tour-type/create", tourController.CreateTourType)
router.get("/tour-type", tourController.GetAllTourType)
router.patch("/tour-type/:id", tourController.UpdateTourType)
router.delete("/tour-type/:id", tourController.DeleteTourType)
router.post(
  "/create",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  multerUpload.array('files'),
  validateRequest(createTourZodSchema),
  tourController.CreateTour,
);
router.get("/", tourController.GetAllTour);
router.patch("/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  multerUpload.array('files'),
  validateRequest(updateTourZodSchema),
  tourController.UpdateTour
);
router.delete("/:id", tourController.DeleteTour);

export const TourRoutes = router;
