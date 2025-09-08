import { Request, Response } from "express";
import { CatchAsync } from "../../../utils/catchAsync";
import { paymentService } from "./payment.service";
import { envVars } from "../../../configs/env";
import { sendResponse } from "../../../utils/response.helper";

const successPayment = CatchAsync(async (req: Request, res: Response) => {
  const query = req.query;
  const result = await paymentService.successPayment(query as Record<string, string>)
  if (result.success) {
    res.redirect(`${envVars.SSL.FRONTEND_SUCCESS_URL}?transactionId=${query.transactionId}&amount=${query.amount}&status=${query.status}`)
  }
});
const initPayment = CatchAsync(async (req: Request, res: Response) => {
  const bookingId: any = req.params.bookingId;
  const result = await paymentService.initPayment(bookingId)

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Payment url sent successfully",
    data: result
  })
});


const failPayment = CatchAsync(async (req: Request, res: Response) => {

  const query = req.query;
  console.log("query from fail:", query)
  const result = await paymentService.failPayment(query as Record<string, string>)
  if (!result.success) {
    res.redirect(`${envVars.SSL.FRONTEND_FAIL_URL}?transactionId=${query.transactionId}&amount=${query.amount}&status=${query.status}`)
  }
});


const cancelPayment = CatchAsync(async (req: Request, res: Response) => {
  const query = req.query;
  console.log("query from cancel:", query)

  const result = await paymentService.cancelPayment(query as Record<string, string>)
  if (!result.success) {
    res.redirect(`${envVars.SSL.FRONTEND_CANCEL_URL}?transactionId=${query.transactionId}&amount=${query.amount}&status=${query.status}`)
  }
});


export const paymentController = {
  successPayment,
  failPayment,
  cancelPayment,
  initPayment
}