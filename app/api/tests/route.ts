import { db } from "@/lib/drizzle/db";
import { TestTable } from "@/lib/drizzle/schema";
import { Test } from "@/app/types/types";
import { auth } from "@/auth";
import { eq } from "drizzle-orm";

export const GET = auth(async function GET(req) {
  if (req.auth) {
    const tests = await db
      .select()
      .from(TestTable)
      .where(eq(TestTable.userId, req.auth?.user?.id!));

    return new Response(JSON.stringify(tests), { status: 200 });
  }
});

export const POST = auth(async function POST(req) {
  let id: string = "";
  if (req.auth) {
    id = req.auth?.user?.id!;
  }
  const data: Test = await req.json();

  const response = await db
    .insert(TestTable)
    .values({
      title: data.title,
      description: data.description,
      duration: data.duration,
      tags: data.tags,
      ownTest: data.ownTest,
      privatePost: data.privatePost,
      userId: id,
      createdAt: Date.now().toString(),
    })
    .returning({ testId: TestTable.id });

  return new Response(
    JSON.stringify({
      message: "test created successfully",
      testId: response[0].testId,
    }),
    {
      status: 201,
    }
  );
});

export async function PUT(request: Request) {
  const data = await request.json();

  await db
    .update(TestTable)
    .set({ privatePost: data.privatePost })
    .where(eq(TestTable.id, data.id));
  return new Response(JSON.stringify({ message: "PUT request" }), {
    status: 200,
  });
}

// import axios from "axios";
// import { NextResponse } from "next/server";
// import { ocrSpace } from "ocr-space-api-wrapper";
// import fs from "fs-extra";
// import path from "path";
// import { pipeline } from "stream";
// import { promisify } from "util";

// const pipelineAsync = promisify(pipeline);

// export async function POST(request: Request) {
//   let filePath = "";
//   try {
//     const formData = await request.formData();
//     const file = formData.get("file");
//     const uploadsDir = path.join(process.cwd(), "uploads");
//     await fs.ensureDir(uploadsDir);

//     const fileName = `${Date.now()}-${file?.name}`;
//     filePath = path.join(uploadsDir, fileName);
//

//     // Create a writable stream and pipe the file stream into it
//     await pipelineAsync(file.stream(), fs.createWriteStream(filePath));

//     const response = await ocrSpace(filePath, {
//       apiKey: process.env.OCR_SPACE_API_KEY,
//     });
//
//   } catch (error) {
//     console.error("Error processing file: ", error);
//   }

//   return new NextResponse(
//     JSON.stringify({ message: "test created successfully" }),
//     { status: 201 }
//   );
// }
