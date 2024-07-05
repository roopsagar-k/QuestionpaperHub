import { auth } from "@/auth";
import { db } from "@/lib/drizzle/db";
import { TestTable, TestsTakenTable } from "@/lib/drizzle/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export const GET = auth(async function GET(req) {
  const userId = req?.auth?.user?.id;
  const result = await db
    .select()
    .from(TestsTakenTable)
    .leftJoin(TestTable, eq(TestsTakenTable.testId, TestTable.id))
    .where(eq(TestsTakenTable.userId, userId!));

    return new NextResponse(JSON.stringify({ testsTaken: result}), { status: 200 });
});
