import { Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import { sendResponse } from "../../../utils/response.helper";
import { BookingService } from "./booking.service";
import AppError from "../../../helpers/CustomError";
import httpStatus from 'http-status-codes'

const createBooking = async (req: Request, res: Response) => {
  const decodedToken = req.user as JwtPayload
  const booking = await BookingService.createBooking(req.body, decodedToken.userId)
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Booking Created Successfully",
    data: booking
  })

}
const getUserBooking = async (req: Request, res: Response) => {
  const decodedToken = req.user as JwtPayload;
  if (!decodedToken.userId) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found")
  };
  const userBookings = await BookingService.getUserBooking(decodedToken.userId)
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Booking retrieved Successfully",
    data: userBookings
  })
}


const getBookingById = async (req: Request, res: Response) => {

  const bookingId = req.params.bookingId;

  const booking = await BookingService.getBookingById(bookingId);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Retrieved Single Booking",
    data: booking
  })
}
const updateBookingStatus = async (req: Request, res: Response) => {

  const bookingId = req.params.bookingId;
  const status = req.body;

  // console.log(bookingId, status)
  // return


  const updateStatus = await BookingService.updateBookingStatus(bookingId, status)

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Update Status Successfully",
    data: updateStatus
  })
}
const getAllBookings = async (req: Request, res: Response) => {
  const bookings = await BookingService.getAllBookings()

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Booking Retrieved Successfully",
    data: bookings
  })
}


export const BookingController = {
  createBooking,
  getUserBooking,
  getBookingById,
  updateBookingStatus,
  getAllBookings

}