import slugify from 'slugify';
import { catchError } from '../../middleware/catchError.js';
import { AppError } from '../../utils/appError.js';
import { Category } from './../../../database/models/category.model.js';
import { deleteOne } from '../refactor/refactor.js';
import { APIFeatures } from '../../utils/apiFeatures.js';

const addCategory = catchError(async (req, res, next) => {
    if (!req.file) {
        return next(new AppError("Image is required", 400));
    }
    console.log(req.file);
    req.body.slug = slugify(req.body.name);
    req.body.image = req.file.filename;  // 🔥 المهم
    const category = new Category(req.body);
    await category.save();
    res.json({ message: 'Category added successfully', category });
});


const allCategories = catchError( async (req, res, next) => {
   let apiFeatures = new APIFeatures(Category.find(), req.query)
       .search().filter().sort().fields().pagination();
   
     const categories = await apiFeatures.mongooseQuery;
     res.json({ message: 'success', page : apiFeatures.pageNumber, categories
  });
})

const getCategory = catchError(async (req, res, next) => {
    const category = await Category.findById(req.params.id);
    category || next(new AppError("category not found"))
    !category || res.json({ message: 'Category deleted successfully', category });
})

const updateCategory = catchError(async (req, res, next) => {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (req.body.slug) req.body.slug = slugify(req.body.name);
    if(req.file)    req.body.image = req.file.filename;  // 🔥 المهم
    category || next(new AppError("category not found"))
    !category || res.json({ message: 'Category deleted successfully', category });
})

const deleteCategory = deleteOne(Category)

export {
    addCategory,
    allCategories,
    getCategory,
    updateCategory,
    deleteCategory
}