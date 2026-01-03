import slugify from 'slugify';
import { catchError } from '../../middleware/catchError.js';
import { AppError } from '../../utils/appError.js';
import { Coupon } from '../../../database/models/coupon.model.js';
import { deleteOne } from '../refactor/refactor.js';

const addCoupon = catchError(async (req, res, next) => {
    let isExist = await Coupon.findOne({code : req.body.code})
    if(isExist) return next(new AppError("coupon is exist",409))
    const coupon = new Coupon(req.body);
    await coupon.save();

    res.json({ message: 'coupon added successfully', coupon });
});

const allCoupons = catchError(async (req, res, next) => {
    const coupons = await Coupon.find();
    res.json({ message: "success", coupons });
});

const getCoupon = catchError(async (req, res, next) => {
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) return next(new AppError("coupon not found", 404));

    res.json({ message: 'success', coupon });
});

const updateCoupon = catchError(async (req, res, next) => {
  
    const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, { new: true });

    if (!coupon) return next(new AppError("coupon not found", 404));

    res.json({ message: 'coupon updated successfully', coupon });
});

const deleteCoupon = deleteOne(Coupon)

export {
    addCoupon,
    allCoupons,
    getCoupon,
    updateCoupon,
    deleteCoupon
};
