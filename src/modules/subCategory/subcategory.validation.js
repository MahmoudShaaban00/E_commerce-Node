import Joi from "joi";


const addSubCategoryValidation = Joi.object({
  name: Joi.string().min(2).max(30).required(),
  slug: Joi.string().lowercase().required(),
  category: Joi.string().required(),
  image: Joi.object({
    fieldname: Joi.string().required(),
    originalname: Joi.string().required(),
    encoding: Joi.string().required(),
    mimetype: Joi.string().valid("image/jpeg", "image/png", "image/gif").required(),
    size: Joi.number().max(5 * 1024 * 1024).required(), // max 5MB
    destination: Joi.string().required(),
    filename: Joi.string().required(),
    path: Joi.string().required()
  }).required()
});

export { addSubCategoryValidation };
