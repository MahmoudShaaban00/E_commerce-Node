import { catchError } from '../../middleware/catchError.js';
import { AppError } from '../../utils/appError.js';
import { User } from '../../../database/models/user.model.js';




const addToWishList = catchError(async (req, res, next) => {

    let wishlist = await User.findByIdAndUpdate(req.user._id,
        { $addToSet: { wishList: req.body.product } }, { new: true });

    if (!wishlist) return next(new AppError("wishlist not found", 404));

    res.json({ message: 'wishlist added successfully', wishList: wishlist.wishList });
});

const deleteFromWishList = catchError(async (req, res, next) => {

    let wishlist = await User.findByIdAndUpdate(req.user._id,
        { $pull: { wishList: req.params.id} }, { new: true });

    if (!wishlist) return next(new AppError("wishlist not found", 404));

    res.json({ message: 'wishlist deleted successfully', wishList: wishlist.wishList });
});

const getloggedUserWishList = catchError(async (req, res, next) => {

    let wishlist = await User.findById(req.user._id).populate('wishList');
    if (!wishlist) return next(new AppError("wishlist not found", 404));

    res.json({ message: 'wishlist retrieved successfully', wishList: wishlist.wishList });
});


export {
    addToWishList,
    deleteFromWishList,
    getloggedUserWishList
};
