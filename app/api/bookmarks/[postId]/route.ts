import { auth } from "@/auth";
import { db } from "@/lib/drizzle/db";
import { BookMarkTable } from "@/lib/drizzle/schema";
import { and, eq } from "drizzle-orm";
import { NextRequest } from "next/server";

export const GET = async function GET(
  req: NextRequest,
  { params }: { params: { postId: string } }
) {
  const session = await auth();
  const userId = session?.user?.id;
  const response = await db
    .select()
    .from(BookMarkTable)
    .where(
      and(
        eq(BookMarkTable.userId, userId!),
        eq(BookMarkTable.postId, params.postId)
      )
    );

  return Response.json(response);
};
