import slugify from 'slugify';
import { catchError } from '../../middleware/catchError.js';
import { AppError } from '../../utils/appError.js';
import { Product } from './../../../database/models/product.model.js';
import { deleteOne } from '../refactor/refactor.js';
import { APIFeatures } from '../../utils/apiFeatures.js';



// ===== Add Product =====
const addProduct = catchError(async (req, res, next) => {
  req.body.slug = slugify(req.body.title);
  if (req.files.imageCover) req.body.imageCover = req.files.imageCover[0].filename;
  if (req.files.images) req.body.images = req.files.images.map(img => img.filename);

  const product = new Product(req.body);
  await product.save();

  res.json({ message: 'Product added successfully', product });
});

// ===== Get All Products with Advanced Filtering =====
const allProduct = catchError(async (req, res, next) => {
  
  let apiFeatures = new APIFeatures(Product.find(), req.query)
    .search()
    .filter()
    .sort()
    .fields()
    .pagination();

  const products = await apiFeatures.mongooseQuery;

  res.json({
    message: 'success',
    page : apiFeatures.pageNumber,
    products
  });
});

// ===== Get Single Product =====
const getProduct = catchError(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) return next(new AppError('Product not found', 404));

  res.json({ message: 'success', product });
});

// ===== Update Product =====
const updateProduct = catchError(async (req, res, next) => {
  if (req.files.imageCover) req.body.imageCover = req.files.imageCover[0].filename;
  if (req.files.images) req.body.images = req.files.images.map(img => img.filename);

  const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!product) return next(new AppError('Product not found', 404));

  res.json({ message: 'Product updated successfully', product });
});

// ===== Delete Product =====
const deleteProduct = deleteOne(Product);

export {
  addProduct,
  allProduct,
  getProduct,
  updateProduct,
  deleteProduct
};
