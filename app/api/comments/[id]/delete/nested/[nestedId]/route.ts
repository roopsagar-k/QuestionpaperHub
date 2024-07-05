import { db } from "@/lib/drizzle/db";
import { CommentsTable } from "@/lib/drizzle/schema";
import { eq } from "drizzle-orm";
import { NestedComment } from "@/app/types/types";

export async function DELETE(
  req: Request,
  { params }: { params: { id: string; nestedId: string } }
) {
  const comment = await db
    .select()
    .from(CommentsTable)
    .where(eq(CommentsTable.id, params.id));
  let nestedComments: NestedComment[] = comment[0]
    .nestedComments as NestedComment[];
  const commentIndex = nestedComments?.findIndex(
    (comment: NestedComment) => comment.id === params.nestedId
  );
  if(commentIndex !== -1) {
    nestedComments.splice(commentIndex, 1);
    await db
      .update(CommentsTable)
      .set({ nestedComments })
      .where(eq(CommentsTable.id, params.id));
  }
  return new Response(
    JSON.stringify({
      message: "Comment deleted successfully",
    }),
    {
      status: 200,
    }
  );
}
