import { Router } from "express";
import { allowedTo, protectedRoutes } from "../auth/auth.controller.js";
import { addToCart , updateCart , deleteFromCart , getloggedUserCart, clearCart , applyCoupon} from "./cart.controller.js";



const cartRouter = Router();
cartRouter.route("/").post(protectedRoutes, allowedTo("user"), addToCart)
.get(protectedRoutes, allowedTo("user","admin"), getloggedUserCart);
cartRouter.route("/:id").put(protectedRoutes, allowedTo("user","admin"), updateCart)
.delete(protectedRoutes, allowedTo("user","admin"), deleteFromCart);
cartRouter.route("/").delete(protectedRoutes, allowedTo("user","admin"), clearCart);

cartRouter.route("/apply-Coupon").post(protectedRoutes, allowedTo("user"), applyCoupon);

export default cartRouter;