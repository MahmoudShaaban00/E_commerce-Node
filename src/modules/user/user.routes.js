import { Router } from "express";
import { addUser, allUser, deleteUser, getUser, updateUser } from "./user.controller.js";
import { checkEmail } from "../../middleware/checkEmail.js";


const UserRouter = Router()

UserRouter.route('/').post(checkEmail,addUser).get(allUser)
UserRouter.route('/:id').get(getUser).put(updateUser).delete(deleteUser)

export default UserRouter;
