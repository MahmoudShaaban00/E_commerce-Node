import { Router } from "express";
import { allowedTo, protectedRoutes } from "../auth/auth.controller.js";
import { addToWishList, deleteFromWishList,getloggedUserWishList } from "./wishlist.controller.js";



const wishlistRouter = Router();
wishlistRouter.route("/").patch(protectedRoutes, allowedTo("user"), addToWishList)
.get(protectedRoutes, allowedTo("user"), getloggedUserWishList);
wishlistRouter.route("/:id").delete(protectedRoutes, allowedTo("user", "admin"), deleteFromWishList)

export default wishlistRouter;