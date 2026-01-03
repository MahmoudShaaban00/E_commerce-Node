import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import { AppError } from "../utils/appError.js";
import fs from "fs";
import path from "path";

const ensureFolder = (folderName) => {
  const dir = path.join("uploads", folderName);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

const fileUpload = (folderName) => {

  ensureFolder(folderName);

  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, `uploads/${folderName}`);
    },
    filename: (req, file, cb) => {
      cb(null, uuidv4() + "-" + file.originalname);
    },
  });

  const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image")) {
      cb(null, true);
    } else {
      cb(new AppError("Invalid mime type, only images are allowed", 401), false);
    }
  };

  return multer({ storage, fileFilter });
};

export const uploadSingleFile = (filename, folderName) => {
  return fileUpload(folderName).single(filename);
};

export const uploadMultipleFiles = (fields, folderName) => {
  return fileUpload(folderName).fields(fields);
};
