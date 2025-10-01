/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { CatchAsync } from "../../../utils/catchAsync";
import { sendResponse } from "../../../utils/response.helper";
import httpStatus from "http-status-codes";
import { Types } from "mongoose";
import { tourService } from "./tour.service";
import { ITour } from "./tour.interface";

const CreateTourType = CatchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const tourType = await tourService.CreateTourType(req.body);

    sendResponse(res, {
      success: true,
      message: "TourType Created Successfully",
      statusCode: httpStatus.CREATED,
      data: tourType,
    });
  }
);

const GetAllTourType = CatchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const Tour = await tourService.GetAllTourType();

    sendResponse(res, {
      success: true,
      message: "TourType retrieved Successfully",
      statusCode: httpStatus.CREATED,
      data: Tour,
    });
  }
);

const UpdateTourType = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const divId: string = req.params.id;
  const payload = req.body;
  const Tour = await tourService.UpdateTourType(divId, payload);

  sendResponse(res, {
    success: true,
    message: "TourType Created Successfully",
    statusCode: httpStatus.CREATED,
    data: Tour,
  });
};

const DeleteTourType = CatchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const TourId: string = req.params.id;

    const Tour = await tourService.DeleteTourType(TourId);

    sendResponse(res, {
      success: true,
      message: "TourType Created Successfully",
      statusCode: httpStatus.CREATED,
      data: Tour,
    });
  }
);

const CreateTour = CatchAsync(
  async (req: Request, res: Response, next: NextFunction) => {

    console.log({ files: req.files })

    const payload: ITour = {
      ...req.body,
      images: (req.files as Express.Multer.File[]).map(file => file.path)
    }


    const Tour = await tourService.CreateTour(payload);

    sendResponse(res, {
      success: true,
      message: "Tour Created Successfully",
      statusCode: httpStatus.CREATED,
      data: Tour,
    });
  }
);
const GetAllTour = CatchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const query: any = req.query;

    // console.log(query);
    const Tour = await tourService.GetAllTour(query);

    sendResponse(res, {
      success: true,
      message: "Tour retrieved Successfully",
      statusCode: httpStatus.CREATED,
      data: Tour,
    });
  }
);

const UpdateTour = async (req: Request, res: Response, next: NextFunction) => {
  const tourId: string = req.params.id;
  // const payload = req.body;

  console.log("req.params.id", req.params.id)
  console.log("controller payload", req.body)
  console.log("controller files", req.files)

  const payload: ITour = {
    ...req.body,
    images: (req.files as Express.Multer.File[])?.map(file => file.path)
  }

  const Tour = await tourService.UpdateTour(tourId, payload);
  sendResponse(res, {
    success: true,
    message: "Tour updated Successfully",
    statusCode: httpStatus.CREATED,
    data: Tour,
  });
};

const DeleteTour = CatchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const TourId: string = req.params.id;

    const Tour = await tourService.DeleteTour(TourId);

    sendResponse(res, {
      success: true,
      message: "Tour Created Successfully",
      statusCode: httpStatus.CREATED,
      data: Tour,
    });
  }
);

export const tourController = {
  CreateTour,
  GetAllTour,
  UpdateTour,
  DeleteTour,
  CreateTourType,
  GetAllTourType,
  UpdateTourType,
  DeleteTourType,
};
