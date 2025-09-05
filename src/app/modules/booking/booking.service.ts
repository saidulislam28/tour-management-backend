import AppError from "../../../helpers/CustomError";
import { User } from "../user/user.model";
import { BOOKING_STATUS, IBooking } from "./booking.interface";
import httpStatus from 'http-status-codes'
import { Booking } from "./booking.model";
import { Payment } from "../payment/payment.model";
import { PAYMENT_STATUS } from "../payment/payment.interface";
import { getTransactionId } from "../../../utils/transactionId";
import { Tour } from "../tour/tour.model";
const createBooking = async (payload: Partial<IBooking>, userId: string) => {
  const uniqueTranId = getTransactionId();

  const user = await User.findById(userId);

  if (!user?.phone || !user?.address) {
    throw new AppError(httpStatus.BAD_REQUEST, "Please update your profile to book a tour")
  }

  const booking = await Booking.create({
    user: userId,
    status: BOOKING_STATUS.PENDING,
    ...payload
  })

  const tour = await Tour.findById(payload.tour).select('costFrom');

  const amount = Number(tour?.costFrom) * Number(payload?.guestCount);




  const payment = await Payment.create({
    booking: booking._id,
    status: PAYMENT_STATUS.UNPAID,
    transactionId: uniqueTranId,
    amount,
  })

  const updatedBooking = await Booking.findByIdAndUpdate(booking._id, {
    payment: payment._id,
  },
    {
      new: true,
      runValidators: true
    }
  )


  return updatedBooking;
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


export const BookingService = {
  createBooking,
  getUserBooking,
  getBookingById,
  updateBookingStatus,
  getAllBookings

}