import { User } from "../../../database/models/user.model.js";
import { catchError } from "../../middleware/catchError.js";
import bycrpt from "bcrypt"
import jwt from "jsonwebtoken"
import { AppError } from "../../utils/appError.js";



const signup = catchError(async (req, res, next) => {
    let user = new User(req.body);
    await user.save();
    let token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_KEY);
    res.json({ message: "success", token })
})

const signin = catchError(async (req, res, next) => {
    let user = await User.findOne({ email: req.body.email });

    if (user && bycrpt.compareSync(req.body.password, user.password)) {
        let token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_KEY);;
        return res.json({ message: "success", token });
    }

    next(new AppError("in-valid email or password", 401));
});


const changePassword = catchError(async (req, res, next) => {
    let user = await User.findOne({ email: req.body.email });

    if (user && bycrpt.compareSync(req.body.oldPassword, user.password)) {
        await User.findOneAndUpdate(
            { email: req.body.email },
            {
                password: bycrpt.hashSync(req.body.newPassword, 8),
                changePasswordAt: new Date()
            }
        );

        let token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_KEY);;

        return res.json({ message: "password changed", token });
    }

    next(new AppError("in-valid email or password", 401));
});


const protectedRoutes = catchError(async (req, res, next) => {
    let { token } = req.headers;
    let userPayload = null;
    if (!token) return next(new AppError("you are not logged in", 401));
    jwt.verify(token, process.env.JWT_KEY, (err, payload) => {
        if (err) return next(new AppError(err, 401));
        userPayload = payload;
    })

    let user = await User.findById(userPayload.userId);
    if (!user) return next(new AppError("the user is not exist", 401));

    if (user.changePasswordAt) {
        let time = parseInt(user.changePasswordAt.getTime() / 1000);
        if (time > userPayload.iat) {
            return next(new AppError("user changed his password , please login again", 401));
        }
    }
    req.user = user;
    next();
})

const allowedTo = (...roles) => {
    return catchError(async (req, res, next) => {
        if (!roles.includes(req.user.role))
            return next(new AppError("you are not authorized to endpoint", 401));
        return next();

    })
}

export {
    signup,
    signin,
    changePassword,
    protectedRoutes,
    allowedTo
}