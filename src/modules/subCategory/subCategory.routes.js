import { Router } from "express";
import { addSubCategory, allSubCategories, deleteSubCategory, getSubCategory, updateSubCategory } from "./subCategory.controller.js";
import { uploadSingleFile } from "../../fileUpload/fileUpload.js";
import { addSubCategoryValidation } from "./subcategory.validation.js";
import { validate } from "../../middleware/validate.js";
import { allowedTo, protectedRoutes } from "../auth/auth.controller.js";

const subCategoryRouter = Router({ mergeParams: true });

subCategoryRouter.use(protectedRoutes, allowedTo("admin"));

subCategoryRouter.route("/").post(validate(addSubCategoryValidation),uploadSingleFile('image', 'subCategories'),addSubCategory)
  .get(allSubCategories);

subCategoryRouter.route("/:id").get(getSubCategory)
  .put(uploadSingleFile('image', 'subCategories'),updateSubCategory)
  .delete(deleteSubCategory);

export default subCategoryRouter;
//jfxT3fQfA85HrPZI