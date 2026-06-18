import multer from "multer";
import path from "node:path";
import { AppError } from "../utils/appError";

const allowedExtensions = new Set([".jpg", ".jpeg", ".png", ".webp", ".HEIC"]);

const storage = multer.diskStorage({
  destination: "uploads",
  filename: (_req, file, callback) => {
    const extension = path.extname(file.originalname).toLowerCase();
    const basename = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    callback(null, `${basename}${extension}`);
  }
});

export const uploadImage = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024
  },
  fileFilter: (_req, file, callback) => {
    const extension = path.extname(file.originalname).toLowerCase();

    if (!allowedExtensions.has(extension)) {
      callback(new AppError("Unsupported image format.", 400));
      return;
    }

    callback(null, true);
  }
});
