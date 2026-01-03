import slugify from 'slugify';
import { catchError } from '../../middleware/catchError.js';
import { AppError } from '../../utils/appError.js';
import { Brand } from './../../../database/models/brand.model.js';
import { deleteOne } from '../refactor/refactor.js';

const addBrand = catchError(async (req, res, next) => {
    if (!req.file) {
        return next(new AppError("Logo is required", 400));
    }

    req.body.slug = slugify(req.body.name);
    req.body.logo = req.file.filename; 

    const brand = new Brand(req.body);
    await brand.save();

    res.json({ message: 'brand added successfully', brand });
});

const allBrands = catchError(async (req, res, next) => {
    const brands = await Brand.find();
    res.json({ message: "success", brands });
});

const getBrand = catchError(async (req, res, next) => {
    const brand = await Brand.findById(req.params.id);
    if (!brand) return next(new AppError("brand not found", 404));

    res.json({ message: 'success', brand });
});

const updateBrand = catchError(async (req, res, next) => {
    if (req.body.name) req.body.slug = slugify(req.body.name);
    if (req.file) req.body.logo = req.file.filename;

    const brand = await Brand.findByIdAndUpdate(req.params.id, req.body, { new: true });

    if (!brand) return next(new AppError("brand not found", 404));

    res.json({ message: 'brand updated successfully', brand });
});

const deleteBrand = deleteOne(Brand)

export {
    addBrand,
    allBrands,
    getBrand,
    updateBrand,
    deleteBrand
};
