import { NextRequest } from "next/server";
import { db } from "@/lib/drizzle/db";
import { TestTable } from "@/lib/drizzle/schema";
import { and, eq, ilike, or } from "drizzle-orm";
import { UserTable } from "@/lib/drizzle/schema";

export async function GET(req: NextRequest) {
  try {
    const searchQuery = req.nextUrl.searchParams.get("q");

    const queryResults = await db
      .select()
      .from(TestTable)
      .innerJoin(UserTable, eq(TestTable.userId, UserTable.id))
      .where(
        and(
          or(
            ilike(TestTable.title, `%${searchQuery}%`),
            ilike(TestTable.tags, `%${searchQuery}%`)
          ),
          eq(TestTable.privatePost, false)
        )
      );

    return new Response(
      JSON.stringify({ message: "search successfull", queryResults }),
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error fetching search data:", error);
    return new Response(JSON.stringify({ message: "search failed" }), {
      status: 500,
    });
  }
}
