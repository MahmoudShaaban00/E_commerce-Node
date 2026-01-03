import { Router } from "express";
import { addCategory, allCategories, deleteCategory, getCategory, updateCategory } from "./category.controller.js";
import { uploadSingleFile } from "../../fileUpload/fileUpload.js";
import { validate } from "../../middleware/validate.js";
import { addCategoryValidation } from "./category.validation.js";
import subCategoryRouter from "../subCategory/subCategory.routes.js";
import { allowedTo, protectedRoutes } from "../auth/auth.controller.js";



const categoryRouter = Router();
categoryRouter.use('/:category/subcategories',subCategoryRouter)
categoryRouter.route("/").post(protectedRoutes,allowedTo("admin","user"),uploadSingleFile('image','categories'),validate(addCategoryValidation),addCategory).get(allCategories);
categoryRouter.route("/:id").get(getCategory).put(protectedRoutes,allowedTo("admin","user"),uploadSingleFile('image','categories'),updateCategory).delete(deleteCategory);

export default categoryRouter;