import { v2 as cloudinary } from 'cloudinary';
import { envVars } from './env';
import AppError from '../helpers/CustomError';


cloudinary.config({
  cloud_name: envVars.CLOUDINARY_NAME,
  api_key: envVars.CLOUDINARY_API_KEY,
  api_secret: envVars.CLOUDINARY_API_SECRET
})


export const deleteCloudinaryImage = async (url: string) => {
  try {
    const regex = /\/v\d+\/(.*?)\.(jpg|jpeg|png|gif|webp)$/i;
    const match = url.match(regex)

    if (match && match[1]) {
      const public_id = match[1];
      await cloudinary.uploader.destroy(public_id)

      console.log(`file ${public_id} is deleted from cloudinary`)
    }

  } catch (error: any) {
    throw new AppError(401, `Delete operation not working ${error.message}`)
  }
}

export const CloudinaryUpload = cloudinary;

