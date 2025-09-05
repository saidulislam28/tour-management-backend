import { Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import { sendResponse } from "../../../utils/response.helper";
import { BookingService } from "./booking.service";

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
const getUserBooking = async () => {
  return {}
}
const getBookingById = async () => {
  return {}
}
const updateBookingStatus = async () => {
  return {}
}
const getAllBookings = async () => {
  return {}
}


export const BookingController = {
  createBooking,
  getUserBooking,
  getBookingById,
  updateBookingStatus,
  getAllBookings

}