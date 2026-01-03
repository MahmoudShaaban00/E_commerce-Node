import { catchError } from '../../middleware/catchError.js';
import { AppError } from '../../utils/appError.js';
import { SubCategory } from '../../../database/models/subCategory.model.js';
import slugify from 'slugify';
import { deleteOne } from '../refactor/refactor.js';
import { APIFeatures } from '../../utils/apiFeatures.js';

const addSubCategory = catchError(async (req, res, next) => {
    if (!req.file) {
        return next(new AppError("Image is required", 400));
    }
    console.log(req.file);
    req.body.slug = slugify(req.body.name);
    req.body.image = req.file.filename;  // 🔥 المهم
    const subCategory = new SubCategory(req.body);
    await subCategory.save();
    res.json({ message: 'SubCategory added successfully', subCategory });
});

const allSubCategories = catchError(async (req, res, next) => {
    let filterObj = {};
    if (req.params.category) filterObj.category = req.params.category
    let apiFeatures = new APIFeatures(SubCategory.find(filterObj), req.query)
        .search().filter().sort().fields().pagination();

    const subCategories = await apiFeatures.mongooseQuery;
    res.json({ message: 'success', page: apiFeatures.pageNumber, subCategories });
})

const getSubCategory = catchError(async (req, res, next) => {
    const subCategory = await SubCategory.findById(req.params.id);
    subCategory || next(new AppError("subCategory not found"))
    !subCategory || res.json({ message: 'subCategory found successfully', subCategory });
})

const updateSubCategory = catchError(async (req, res, next) => {
    const subCategory = await SubCategory.findByIdAndUpdate(req.params.id, req.body, { new: true });
    subCategory || next(new AppError("subCategory not found"))
    !subCategory || res.json({ message: 'subCategory update successfully', subCategory });
})

const deleteSubCategory = deleteOne(SubCategory)

export {
    addSubCategory,
    allSubCategories,
    getSubCategory,
    updateSubCategory,
    deleteSubCategory
}