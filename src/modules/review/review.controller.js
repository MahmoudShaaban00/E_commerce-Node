import { catchError } from '../../middleware/catchError.js';
import { AppError } from '../../utils/appError.js';
import { Review } from './../../../database/models/review.model.js';
import { deleteOne } from '../refactor/refactor.js';

const addReview = catchError(async (req, res, next) => {
    req.body.user = req.user._id;
    let isExist = await Review.findOne({user : req.user._id , product : req.body.product})
    if(isExist) return next(new AppError("you already added a review for this product", 409));
    const review = new Review(req.body);
    await review.save();
    res.json({ message: 'review added successfully', review });
});

const allReviews = catchError(async (req, res, next) => {
    const reviews = await Review.find();
    res.json({ message: "success", reviews });
});

const getReview = catchError(async (req, res, next) => {
    const review = await Review.findById(req.params.id);
    if (!review) return next(new AppError("review not found", 404));

    res.json({ message: 'success', review });
});

const updateReview = catchError(async (req, res, next) => {
    const review = await Review.findByIdAndUpdate({ _id: req.params.id, user: req.user._id }, req.body, { new: true });
    if (!review) return next(new AppError("review not found", 404));
    res.json({ message: 'review updated successfully', review });
});

const deleteReview = deleteOne(Review)

export {
    addReview,
    allReviews,
    getReview,
    updateReview,
    deleteReview
};
