import { catchError } from '../../middleware/catchError.js';
import { AppError } from '../../utils/appError.js';
import { User } from '../../../database/models/user.model.js';




const addAddresses = catchError(async (req, res, next) => {

    let addresses = await User.findByIdAndUpdate(req.user._id,
        { $push: { addresses: req.body} }, { new: true });

    if (!addresses) return next(new AppError("addresses not found", 404));

    res.json({ message: 'addresses added successfully', addresses: addresses.addresses });
});

const deleteAddresses = catchError(async (req, res, next) => {

    let addresses = await User.findByIdAndUpdate(req.user._id,
               { $pull: { addresses: { _id: req.params.id } } }, { new: true });

    if (!addresses) return next(new AppError("addresses not found", 404));

    res.json({ message: 'addresses deleted successfully', addresses: addresses.addresses });
});

const getloggedUserAddresses = catchError(async (req, res, next) => {

    let addresses = await User.findById(req.user._id)
    if (!addresses) return next(new AppError("addresses not found", 404));

    res.json({ message: 'addresses retrieved successfully', addresses: addresses.addresses });
});


export {
    addAddresses,
    deleteAddresses,
    getloggedUserAddresses
};
