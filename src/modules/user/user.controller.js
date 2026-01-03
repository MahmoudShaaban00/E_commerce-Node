import { User } from "../../../database/models/user.model.js";
import { catchError } from "../../middleware/catchError.js";
import { AppError } from "../../utils/appError.js";
import { deleteOne } from "../refactor/refactor.js";




const addUser = catchError(async (req,res,next)=>{
    let user = new User(req.body);
    await user.save();
    res.json({message:"success" , user})
})

const allUser = catchError(async(req,res,next)=>{
    let users = await User.find()
    res.json({message:"success", users})
})

const getUser = catchError(async(req,res,next)=>{
    let user = await User.findById(req.params.id)
    user || next(AppError('user not found', 404))
    !user || res.json({message:'success',user})
})

const updateUser = catchError(async(req,res,next)=>{
    let user = await User.findByIdAndUpdate(req.params.id, req.body , {new:true})
     user || next(AppError('user not found', 404))
    !user || res.json({message:'success',user})
})

const deleteUser = deleteOne(User)

export {
    addUser,
    getUser,
    allUser,
    updateUser,
    deleteUser
}