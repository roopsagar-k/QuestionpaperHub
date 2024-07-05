import { auth } from "@/auth";
import { db } from "@/lib/drizzle/db";
import { TestTable, TestsTakenTable } from "@/lib/drizzle/schema";
import { and, eq } from "drizzle-orm";

export const GET = async function GET(
  req: Request,
  { params }: { params: { testId: string } }
) {
  const session = await auth();
  const result = await db
    .select()
    .from(TestsTakenTable)
    .where(
      and(
        eq(TestsTakenTable.testId, params.testId),
        eq(TestsTakenTable.userId, session?.user?.id!)
      )
    );

  const response = await db
    .select({
      totalDuration: TestTable.duration,
      questions: TestTable.questions,
    })
    .from(TestTable)
    .where(eq(TestTable.id, result[0].testId));

  return Response.json(
    {
      testDetails: result[0],
      totalDuration: response[0].totalDuration,
      questions: response[0].questions,
    },
    { status: 200 }
  );
};
