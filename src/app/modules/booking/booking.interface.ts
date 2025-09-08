import { Types } from "mongoose";
import z from "zod";

export enum BOOKING_STATUS {
  PENDING = "PENDING",
  CANCEL = "CANCELLED",
  COMPLETE = "COMPLETE",
  FAILED = "FAILED",
}


export interface IBooking {
  user: Types.ObjectId,
  tour: Types.ObjectId,
  payment: Types.ObjectId,
  guestCount: number,
  status: BOOKING_STATUS

}


export const createBookingZodSchema = z.object({
  tour: z.string(),
  guestCount: z.number().positive().int()
});

export const updateBookingStatusZodSchema = z.object({
  status: z.enum(Object.values(BOOKING_STATUS)as [string])
})