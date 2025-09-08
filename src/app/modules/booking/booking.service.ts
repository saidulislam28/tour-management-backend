import httpStatus from 'http-status-codes';
import AppError from "../../../helpers/CustomError";
import { getTransactionId } from "../../../utils/transactionId";
import { PAYMENT_STATUS } from "../payment/payment.interface";
import { Payment } from "../payment/payment.model";
import { IsslCommerz } from "../sslCommerz/sslCommerz.interface";
import { sslService } from "../sslCommerz/sslCommerz.service";
import { Tour } from "../tour/tour.model";
import { User } from "../user/user.model";
import { BOOKING_STATUS, IBooking } from "./booking.interface";
import { Booking } from "./booking.model";


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


    // console.log("payment creation", payment)


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
      .populate("payment") as any;

    const sslPayload: IsslCommerz = {
      address: updatedBooking?.user.address,
      name: updatedBooking?.user.name,
      amount,
      email: updatedBooking?.user.email,
      phoneNumber: updatedBooking?.user?.phone,
      transaction: payment[0]?.transactionId
    }

    // console.log("ssl payload", sslPayload)

    const sslPayment = await sslService.sslPaymentInit(sslPayload)

    // console.log("payment", sslPayment);

    await session.commitTransaction();
    session.endSession();
    return {
      booking: updatedBooking,
      payment_url: sslPayment?.GatewayPageURL
    };
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