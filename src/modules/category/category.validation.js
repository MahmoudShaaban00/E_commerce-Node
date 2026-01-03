import Joi from "joi";

const addCategoryValidation = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  image: Joi.object({
    fieldname: Joi.string().required(),
    originalname: Joi.string().required(),
    encoding: Joi.string().required(),
    mimetype: Joi.string().valid("image/jpeg", "image/png", "image/gif").required(),
    size: Joi.number().max(5 * 1024 * 1024).required(),
    destination: Joi.string().required(),
    filename: Joi.string().required(),
    path: Joi.string().required()
  }),

});

export { addCategoryValidation };