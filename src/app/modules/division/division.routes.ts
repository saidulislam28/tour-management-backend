import { Router } from "express";
import { divisionController } from "./division.controller";

const router = Router();

router.post("/create", divisionController.CreateDivision);
router.get("/", divisionController.GetAllDivision);
router.get("/:slug", divisionController.GetSingleDivision);
router.patch("/:id", divisionController.UpdateDivision);
router.delete("/:id", divisionController.DeleteDivision);

export const DivisionRoutes = router;
