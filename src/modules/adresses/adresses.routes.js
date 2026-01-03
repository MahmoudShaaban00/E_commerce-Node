import { Router } from "express";
import { allowedTo, protectedRoutes } from "../auth/auth.controller.js";
import { addAddresses,deleteAddresses, getloggedUserAddresses} from "./adresses.controller.js";



const addressesRouter = Router();
addressesRouter.route("/").patch(protectedRoutes, allowedTo("user"), addAddresses)
.get(protectedRoutes, allowedTo("user","admin"), getloggedUserAddresses);
addressesRouter.route("/:id").delete(protectedRoutes, allowedTo("user"), deleteAddresses);


export default addressesRouter;