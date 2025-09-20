/* eslint-disable no-useless-escape */
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { CloudinaryUpload } from "./cloudinary.config";

const storage = new CloudinaryStorage({
  cloudinary: CloudinaryUpload,
  params: (req, file) => {
    const filename = file.originalname
      .replace(/\./g, "-")
      .replace(/[^a-z0-9\-\.]/g, "")

    const extension = file.originalname.split(".").pop()
    const uniqueFileName = Math.random().toString(36).substring(2) + "-" + Date.now() + "-" + filename + "-" + extension


    return uniqueFileName
  }

})


export const multerUpload = multer({
  storage: storage
})