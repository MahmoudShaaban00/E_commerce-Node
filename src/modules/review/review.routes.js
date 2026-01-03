import { Router } from "express";
import { allowedTo, protectedRoutes } from "../auth/auth.controller.js";
import { addReview, allReviews, getReview, updateReview, deleteReview } from "./review.controller.js";



const reviewRouter = Router();
reviewRouter.route("/").post(protectedRoutes,allowedTo('user'),addReview).get(allReviews);
reviewRouter.route("/:id").get(getReview).put(protectedRoutes,allowedTo('user'),updateReview).delete(protectedRoutes,allowedTo('user',"admin"),deleteReview);

export default reviewRouter;