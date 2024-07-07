import { db } from "@/lib/drizzle/db";
import { TestTable, UserTable } from "@/lib/drizzle/schema";
import { eq } from "drizzle-orm";
export const dynamic = "force-dynamic";

export async function GET() {
  const tests = await db
    .select()
    .from(TestTable)
    .innerJoin(UserTable, eq(TestTable.userId, UserTable.id))
    .where(eq(TestTable.privatePost, false));
console.log("tests from home route", tests)
  return new Response(JSON.stringify(tests), { status: 200 });
}
