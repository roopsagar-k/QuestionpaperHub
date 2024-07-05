import { db } from "@/lib/drizzle/db";
import { TestTable } from "@/lib/drizzle/schema";
import { Test } from "@/app/types/types";
import { auth } from "@/auth";
import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs-extra";
import path from "path";
import { pipeline } from "stream";
import { promisify } from "util";

export const POST = auth(async function POST(req) {
  let id: string = "";
  if (req.auth) {
    id = req.auth?.user?.id!;
  }

  function fileToGenerativePart(buffer: ArrayBuffer, mimeType: string) {  
    return {
      inlineData: {
        data: Buffer.from(buffer).toString("base64"),
        mimeType,
      },
    };
  }

  const formData = await req.formData();
  const textFile: File = formData.get("file") as File;
  const dataString = formData.get("data");
  const textFileBuffer = await textFile.arrayBuffer();

  try {
    if (typeof dataString === "string") {
      const data: Test = JSON.parse(dataString);

      // Save file
      const pipelineAsync = promisify(pipeline);
      const uploadsDir = path.join(process.cwd(), "uploads");
      await fs.ensureDir(uploadsDir);
      const filePath = path.join(uploadsDir, textFile.name);
      console.log("filePath: ", filePath);
      await pipelineAsync(textFile.stream() as any, fs.createWriteStream(filePath));


      // Create google file manager

      const genAI = new GoogleGenerativeAI(
        process.env.GEMINI_API_KEY as string
      );

      await fs.promises.unlink(filePath);
      console.log("Deleted file: ", filePath);
      try {

        const model = genAI.getGenerativeModel({
          model: "gemini-1.5-flash",
        });

        const prompt = 'Transform the PDF text or images text into an array of JavaScript objects following this structure: [{"question": "", "answer": optionNumber (1, 2, ...), "options": [{"option": ""}, {"option": ""}]}]. Correct any odd symbols, including mathematical, physics, and chemistry symbols, to their correct representations using the actual forms of these symbols (e.g., use "²" instead of "^2" or "<sup>2</sup>"). Ensure the output is in plain JSON format, parsable by JSON.parse(), and does not include any introductory text, variable declarations, or enclosing tags. Make sure to complete the JSON array properly, even if it means missing some questions.'
        const result = await model.generateContent([prompt, fileToGenerativePart(textFileBuffer, "text/plain")]);
        console.log("Gemini Result: ", result.response);
        let jsonString = result.response.text().trim();
        jsonString = jsonString
          .replace(/```/g, "")
          .replace(/[^\x20-\x7E]/g, "");
        console.log("JSON String: ", jsonString);
        const arrayOfObjects = JSON.parse(jsonString);
        console.log("Array of Objects: ", arrayOfObjects);

       
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
            questions: arrayOfObjects,
            createdAt: Date.now().toString(),
          })
          .returning({ testId: TestTable.id });

        return new Response(
          JSON.stringify({
            message: "test created successfully",
            testId: response[0].testId,
            result: result,
            jsonString: jsonString,
          }),
          {
            status: 201,
          }
        );
      } catch (error) {
        console.error("Error occurred while parsing the pdf:", error);
        return new Response(
          JSON.stringify({
            message: "Error occurred while parsing the pdf",
          }),
          {
            status: 500,
          }
        );
      }
    } else {
      return new Response(
        JSON.stringify({
          message: "Invalid data",
        }),
        {
          status: 400,
        }
      );
    }
  } catch (error) {
    console.error("Error occurred:", error);
    return new Response(
      JSON.stringify({
        message: "An error occurred while processing the request",
        error: error instanceof Error ? error.message : error,
      }),
      {
        status: 500,
      }
    );
  }
});
