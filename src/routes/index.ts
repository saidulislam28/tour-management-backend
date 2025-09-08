import { Router } from "express";
import { UserRoutes } from "../app/modules/user/user.routes";
import { AuthRoutes } from "../app/modules/auth/auth.route";
import { DivisionRoutes } from "../app/modules/division/division.routes";
import { TourRoutes } from "../app/modules/tour/tour.routes";
import { BookingRoutes } from "../app/modules/booking/booking.routes";
import { paymentRoutes } from "../app/modules/payment/payment.routes";

export const router = Router();

const moduleRoutes = [
  {
    path: "/user",
    route: UserRoutes,
  },
  {
    path: "/auth",
    route: AuthRoutes,
  },
  {
    path: "/division",
    route: DivisionRoutes,
  },
  {
    path: "/tour",
    route: TourRoutes,
  },
  {
    path: "/booking",
    route: BookingRoutes,
  },
  {
    path: "/payment",
    route: paymentRoutes,
  },
];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});
