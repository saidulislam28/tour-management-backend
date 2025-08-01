import { Router } from "express";
import { tourController } from "./tour.controller";
const router = Router();


router.post("/tour-type/create", tourController.CreateTourType)
router.get("/tour-type", tourController.GetAllTourType)
router.patch("/tour-type/:id", tourController.UpdateTourType)
router.delete("/tour-type/:id", tourController.DeleteTourType)
router.post("/create", tourController.CreateTour);
router.get("/", tourController.GetAllTour);
router.patch("/:id", tourController.UpdateTour);
router.delete("/:id", tourController.DeleteTour);

export const TourRoutes = router;
