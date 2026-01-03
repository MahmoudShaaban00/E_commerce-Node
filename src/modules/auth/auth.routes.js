import { Router } from "express";
import { checkEmail } from "../../middleware/checkEmail.js";
import { signup , signin, changePassword } from "./auth.controller.js";


const authRouter = Router();

authRouter.post("/signup",checkEmail , signup);
authRouter.post("/signin", signin);
authRouter.patch("/change-password",changePassword)

export default authRouter;