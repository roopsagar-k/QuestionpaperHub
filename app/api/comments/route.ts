import { db } from "@/lib/drizzle/db";
import { CommentsTable } from "@/lib/drizzle/schema";
import { auth } from "@/auth";


export const POST = auth(async function POST(req) {
  const { comment, postId } = await req.json();
    await db.insert(CommentsTable).values({
      message: comment,
      postId: postId,
      userId: req.auth?.user?.id!,
      createdAt: Date.now().toString(),
    });
  return new Response(
    JSON.stringify({
      message: "comment added successfully",
    }),
    {
      status: 201,
    }
  );
})
