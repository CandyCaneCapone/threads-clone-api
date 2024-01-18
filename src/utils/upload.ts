import multer, { Multer } from "multer";
import { Request, Express } from "express";
import path from "path";

const storage = multer.diskStorage({
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const originalname = file.originalname;
    const filename = `${timestamp}_${originalname}`;
    cb(null, filename);
  },
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
});
 
const fileFilter = (req: any, file: any, callback: any) => {
  const allowedMimeTypes = ["image/png", "image/jpeg"];
  const allowedExtensions = [".png", ".jpg", ".jpeg"];

  // Check MIME type
  if (!allowedMimeTypes.includes(file.mimetype)) {
    return callback(
      new Error("Invalid file type. Only PNG and JPEG files are allowed."),
      false
    );
  }

  // Check file extension
  const fileExtension = path.extname(file.originalname).toLowerCase();
  if (!allowedExtensions.includes(fileExtension)) {
    return callback(
      new Error("Invalid file extension. Only PNG and JPEG files are allowed."),
      false
    );
  }

  // File is allowed
  callback(null, true);
};

const limits = {
  fileSize: 1024 * 1024 * 5,
};

const upload: Multer = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: limits,
});

export default upload;
