import { DeleteImage } from "@/lib/DeleteImage";
import { UploadImage } from "@/lib/uploadImage";
import { NextRequest } from "next/server";

export async function POST(request: Request) {
  const uploadedFiles: { url: string, publicId: string }[] = [];
  const formData = await request.formData();
  const files = formData.getAll("file") as Array<File>;

  for (let i = 0; i < files.length; i++) {
    const cloudinaryResult:any = await UploadImage(files[i], "questionpaper-hub")
    console.log(cloudinaryResult);
    uploadedFiles.push({ url: cloudinaryResult.secure_url, publicId: cloudinaryResult.public_id });
   }

  return new Response(
    JSON.stringify({ message: "file uploaded", uploadedFiles }),
    {
      status: 200,
    }
  );
}

export async function PUT(request: NextRequest) {
  const { deletedImages } = await request.json();
  console.log(deletedImages, "delete images")
  for (let i = 0; i < deletedImages.length; i++) {
    const cloudinaryResult:any = await DeleteImage(deletedImages[i].publicId);
    console.log(cloudinaryResult);
  }
  return new Response("Delete request", { status: 200 });
}
