import fs from "fs-extra";
import path, { join } from "path";
import { pipeline } from "stream";
import { promisify } from "util";
export async function POST(req: Request) {
  const formData = await req.formData();
  const pdfFile: File = formData.get("file") as File;
  console.log("pdfFile: ", pdfFile);
  try {
    const pipelineAsync = promisify(pipeline);
    const uploadsDir = path.join(process.cwd(), "uploads");
    await fs.ensureDir(uploadsDir);
    const fileNmame = Date.now().toString() + "-" + pdfFile.name;
    const filePath = path.join(uploadsDir, fileNmame);
    console.log("filePath: ", filePath);
    await pipelineAsync(
      pdfFile.stream() as any,
      fs.createWriteStream(filePath)
    );
    
    
   
   

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
        console.log(error);
        return new Response(JSON.stringify({ success: false }), { status: 500 });
  }
}
