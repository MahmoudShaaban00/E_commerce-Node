import { User } from "../../database/models/user.model.js"
import { AppError } from "../utils/appError.js"


export const checkEmail = async(req, res, next) => {

    let isFound = await User.findOne({email:req.body.email})
    if(isFound){
        return res.status(409).json(next(new AppError('Email already exists',409)))
    }
    next()
}