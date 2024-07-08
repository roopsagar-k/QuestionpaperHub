"use server";
import cloudinary from "./cloudinary";

export const DeleteImage = async (publicId: string) => {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
}