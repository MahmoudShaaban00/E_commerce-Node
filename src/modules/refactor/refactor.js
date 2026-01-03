import { catchError } from "../../middleware/catchError.js";
import { AppError } from "../../utils/appError.js";

export const deleteOne = (model) => {
  return catchError(async (req, res, next) => {
    const document = await model.findByIdAndDelete(req.params.id);

    if (!document) {
      return next(new AppError("document not found", 404));
    }

    res.json({
      message: "document deleted successfully",
      document
    });
  });
};
