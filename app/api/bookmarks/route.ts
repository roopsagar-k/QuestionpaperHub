import { auth } from "@/auth";
import { db } from "@/lib/drizzle/db";
import { BookMarkTable, TestTable, UserTable } from "@/lib/drizzle/schema";
import { eq, and } from "drizzle-orm";

export const GET = auth(async function GET(req) {
  const userId = req?.auth?.user?.id;
  const result = await db
    .select()
    .from(TestTable)
    .innerJoin(
      BookMarkTable,
      and(
        eq(BookMarkTable.userId, userId!),
        eq(BookMarkTable.postId, TestTable.id)
      )
    )
    .innerJoin(UserTable, eq(TestTable.userId, UserTable.id));

  return new Response(JSON.stringify(result), { status: 200 });
});
