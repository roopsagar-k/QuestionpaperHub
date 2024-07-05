import { v4 as uuidv4 } from "uuid";
import { db } from "@/lib/drizzle/db";
import { CommentsTable, UserTable } from "@/lib/drizzle/schema";
import { auth } from "@/auth";
import { eq } from "drizzle-orm";
import { NextRequest } from "next/server";

export const PUT = async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth();

  const { commentMessage, commentId, recipientId } = await req.json();
  const comment = await db
    .select()
    .from(CommentsTable)
    .where(eq(CommentsTable.id, commentId));
  let nestComments = comment[0].nestedComments;
  if (nestComments === null) {
    nestComments = [];
  }
  nestComments.push({
    id: uuidv4(),
    message: commentMessage,
    createdAt: Date.now(),
    userId: session?.user?.id!,
    recipientId: recipientId,
    postId: params.id,
  });
  await db
    .update(CommentsTable)
    .set({ nestedComments: nestComments })
    .where(eq(CommentsTable.id, commentId));
  return new Response(
    JSON.stringify({
      message: "comment added successfully",
    }),
    {
      status: 201,
    }
  );
};

export const POST = async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  const { comment } = await req.json();
  await db.insert(CommentsTable).values({
    message: comment,
    postId: params.id,
    userId: session?.user?.id!,
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
};

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const comments = await db
    .select()
    .from(CommentsTable)
    .innerJoin(UserTable, eq(CommentsTable.userId, UserTable.id))
    .where(eq(CommentsTable.postId, params.id));

  const commentsWithNestedUserDetails = await Promise.all(
    comments.map(async (comment) => {
      let nestedComments = comment.comments.nestedComments || [];

      const nestedCommentsWithUserDetails = await Promise.all(
        nestedComments.map(async (nestedComment: any) => {
          const user = await db
            .select()
            .from(UserTable)
            .where(eq(UserTable.id, nestedComment.userId))
            .then((res) => res[0]);

          const recipient = await db
            .select()
            .from(UserTable)
            .where(eq(UserTable.id, nestedComment.recipientId))
            .then((res) => res[0]);

          return {
            ...nestedComment,
            user,
            recipient,
          };
        })
      );

      return {
        ...comment,
        comments: {
          ...comment.comments,
          nestedComments: nestedCommentsWithUserDetails,
        },
      };
    })
  );

  return new Response(JSON.stringify(commentsWithNestedUserDetails), {
    status: 200,
  });
}
