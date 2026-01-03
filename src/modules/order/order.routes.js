import { Router } from "express";
import { createCashOrder,createCheckoutSession,getAllOrders , getUserOrders } from "./order.controller.js";
import { allowedTo, protectedRoutes } from "../auth/auth.controller.js";



const orderRouter = Router();
orderRouter.route('/').get(protectedRoutes,allowedTo("admin"),getAllOrders);
orderRouter.route('/users').get(protectedRoutes,allowedTo("user"),getUserOrders);
orderRouter.route('/:id').post(protectedRoutes,allowedTo("user"),createCashOrder);

orderRouter.post("/checkout/:id", protectedRoutes, allowedTo("user"), createCheckoutSession);

export default orderRouter;