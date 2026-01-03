import { AppError } from "../utils/appError.js";


export const validate = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate({...req.body,...req.params, ...req.query}, { abortEarly: false });
        if (!error) {
          next();
        } else {
          const errorDetails = error.details.map(detail => detail.message);
          next(new AppError(`Validation error: ${errorDetails.join(', ')}`, 400));
        }
    };
}