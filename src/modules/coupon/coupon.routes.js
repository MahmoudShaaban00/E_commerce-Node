import { Router } from "express";
import { allowedTo, protectedRoutes } from "../auth/auth.controller.js";
import { addCoupon, allCoupons, deleteCoupon, getCoupon, updateCoupon } from "./coupon.controller.js";



const couponRouter = Router();
couponRouter.use(protectedRoutes, allowedTo("admin"))
couponRouter.route("/").post(addCoupon).get(allCoupons);
couponRouter.route("/:id").get(getCoupon).put(updateCoupon).delete(deleteCoupon)

export default couponRouter;