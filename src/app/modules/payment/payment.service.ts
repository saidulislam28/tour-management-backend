/* eslint-disable @typescript-eslint/no-unused-vars */
import AppError from "../../../helpers/CustomError";
import { BOOKING_STATUS } from "../booking/booking.interface";
import { Booking } from "../booking/booking.model";
import { IsslCommerz } from "../sslCommerz/sslCommerz.interface";
import { sslService } from "../sslCommerz/sslCommerz.service";
import { PAYMENT_STATUS } from "./payment.interface";
import { Payment } from "./payment.model";

const initPayment = async (bookingId: string) => {
  try {

    const payment = await Payment.findOne({ booking: bookingId })

    if (!payment) {
      throw new AppError(401, "Payment not found");
    }
    const booking = await Booking.findById(payment.booking) as any;
    const sslPayload: IsslCommerz = {
      address: booking?.user.address,
      name: booking?.user.name,
      amount: payment.amount,
      email: booking?.user.email,
      phoneNumber: booking?.user?.phone,
      transaction: payment.transactionId
    }
    const sslPayment = await sslService.sslPaymentInit(sslPayload);;

    return {
      payment_url: sslPayment?.GatewayPageURL
    }
  } catch (error) {
    console.log("error", error)
    throw Error
  }
}
const successPayment = async (query: Record<string, string>) => {
  const session = await Booking.startSession();
  session.startTransaction();
  try {

    const payment = await Payment.findOneAndUpdate({ transactionId: query?.transactionId }, {
      status: PAYMENT_STATUS.PAID,
    }, { session });

    const updatedBooking = await Booking.findByIdAndUpdate(
      payment?.booking,
      {
        status: BOOKING_STATUS.COMPLETE
      },
      {
        new: true,
        runValidators: true,
        session
      }
    ).populate("user", "name email phone address")
      .populate("tour", "title costFrom")
      .populate("payment") as any;


    await session.commitTransaction();
    session.endSession();

    return {
      success: true,
      message: "successfully updated"
    }
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.log("error", error)
    throw Error
  }
}
const failPayment = async (query: Record<string, string>) => {

  const session = await Booking.startSession();
  session.startTransaction();
  try {

    const payment = await Payment.findOneAndUpdate({ transactionId: query?.transactionId }, {
      status: PAYMENT_STATUS.FAILED,
    }, { session });

    const updatedBooking = await Booking.findByIdAndUpdate(
      payment?.booking,
      {
        status: BOOKING_STATUS.FAILED
      },
      {
        runValidators: true,
        session
      }
    )
    await session.commitTransaction();
    session.endSession();

    return {
      success: false,
      message: "Payment Failed!!!!"
    }
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.log("error", error)
    throw Error
  }

}
const cancelPayment = async (query: Record<string, string>) => {

  const session = await Booking.startSession();
  session.startTransaction();
  try {

    const payment = await Payment.findOneAndUpdate({ transactionId: query?.transactionId }, {
      status: PAYMENT_STATUS.CANCELLED,
    }, { session });

    const updatedBooking = await Booking.findByIdAndUpdate(
      payment?.booking,
      {
        status: BOOKING_STATUS.CANCEL
      },
      {
        runValidators: true,
        session
      }
    )
    await session.commitTransaction();
    session.endSession();

    return {
      success: false,
      message: "Cancel Payment!!!!"
    }
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.log("error", error)
    throw Error
  }

}

export const paymentService = {
  successPayment,
  failPayment,
  cancelPayment,
  initPayment
}