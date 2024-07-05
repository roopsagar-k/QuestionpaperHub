import { db } from "@/lib/drizzle/db";
import { CommentsTable } from "@/lib/drizzle/schema";
import { eq } from "drizzle-orm";
import { NestedComment } from "@/app/types/types";

export const PUT = async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { updatedMessage, nested, nestedCommentId } = await req.json();

  if (!nested) {
    // Update the main comment if it's not a nested comment
    await db
      .update(CommentsTable)
      .set({ message: updatedMessage })
      .where(eq(CommentsTable.id, params.id));
    return new Response(
      JSON.stringify({
        message: "Comment updated successfully",
      }),
      {
        status: 201,
      }
    );
  } else {
    // Update the nested comment
    const comment = await db
      .select()
      .from(CommentsTable)
      .where(eq(CommentsTable.id, params.id));

    let nestedComments: NestedComment[] = comment[0]
      .nestedComments as NestedComment[];

    const commentIndex = nestedComments?.findIndex(
      (comment: NestedComment) => comment.id === nestedCommentId
    );

    if (commentIndex !== -1) {
      nestedComments[commentIndex].message = updatedMessage;

      // Save the updated nested comments array back to the database
      await db
        .update(CommentsTable)
        .set({ nestedComments })
        .where(eq(CommentsTable.id, params.id));

      return new Response(
        JSON.stringify({
          message: "Nested comment updated successfully",
        }),
        {
          status: 201,
        }
      );
    } else {
      return new Response(
        JSON.stringify({
          message: "Nested comment not found",
        }),
        {
          status: 404,
        }
      );
    }
  }
};
