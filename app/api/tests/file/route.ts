import { db } from "@/lib/drizzle/db";
import { TestTable } from "@/lib/drizzle/schema";
import { auth } from "@/auth";

export const POST = auth(async function POST(req) {
  let id: string = "";
  if (req.auth) {
    id = req.auth?.user?.id!;
  }

  const { data, arrayOfObjects } = await req.json();
  console.log("data", data);
  console.log("arrayOfObjects", arrayOfObjects);
  try {
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
        error: error instanceof Error ? error.message : error,
      }),
      {
        status: 500,
      }
    );
  }
});
