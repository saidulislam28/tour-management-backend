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

  const session = await Booking.startSession();
  session.startTransaction();

  try {
    const user = await User.findById(userId);
    if (!user?.phone || !user?.address) {
      throw new AppError(httpStatus.BAD_REQUEST, "Please update your profile to book a tour")
    }
    const booking = await Booking.create([{
      user: userId,
      status: BOOKING_STATUS.PENDING,
      ...payload
    }], { session })
    const tour = await Tour.findById(payload.tour).select('costFrom');
    const amount = Number(tour?.costFrom) * Number(payload?.guestCount);
    const payment = await Payment.create([{
      booking: booking[0]._id,
      status: PAYMENT_STATUS.UNPAID,
      transactionId: uniqueTranId,
      amount,
    }], { session })
    const updatedBooking = await Booking.findByIdAndUpdate(booking[0]._id, {
      payment: payment[0]._id,
    },
      {
        new: true,
        runValidators: true,
        session
      }
    ).populate("user", "name email phone address")
      .populate("tour", "title costFrom")
      .populate("payment");

    await session.commitTransaction();
    session.endSession();
    return updatedBooking;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.log("error", error)
    throw Error
  }


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