"use server";
import cloudinary from "./cloudinary";

export const UploadImage = async (file: File, folder: string) => {
  const buffer = await file.arrayBuffer();
  const bytes = Buffer.from(buffer);
  return new Promise(async (resolve, reject) => {
    await cloudinary.uploader.upload_stream(
      {
        resource_type: "auto",
        folder: folder,
      },
      async (error, result) => {
        if (error) {
          return reject(error.message);
        }
        console.log(result);
        return resolve(result);
      }
    ).end(bytes)
  });
};
