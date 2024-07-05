import { auth } from "@/auth";
import { db } from "@/lib/drizzle/db";
import { CommentsVotesTable } from "@/lib/drizzle/schema";
import { and, eq } from "drizzle-orm";
import { NestedCommentsVotesTable } from "@/lib/drizzle/schema";


export const GET = async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await auth();

  try {
    if (!session?.user?.id) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }

    if (!params.id) {
      return new Response(JSON.stringify({ error: "Comment ID is required" }), {
        status: 400,
      });
    }

    let response = await db
      .select()
      .from(CommentsVotesTable)
      .where(
        and(
          eq(CommentsVotesTable.commentId, params.id),
          eq(CommentsVotesTable.userId, session?.user.id)
        )
      );

    const allVotes = await db
      .select()
      .from(CommentsVotesTable)
      .where(
        and(
          eq(CommentsVotesTable.commentId, params.id),
          eq(CommentsVotesTable.upVote, true)
        )
      );

    const count = allVotes.length;

    const commentVotes = {
      upVote: response.length > 0 ? response[0].upVote : false,
      downVote: response.length > 0 ? response[0].downVote : false,
    };

    return new Response(JSON.stringify({ commentVotes, count }), {
      status: 200,
    });
  } catch (error) {
    console.error("Error fetching comment votes:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
};

export const PUT = async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  const { nested, votes, nestedCommentId } = await req.json();
  let count = 0;

  if (!nested) {
    let response = await db
      .select()
      .from(CommentsVotesTable)
      .where(
        and(
          eq(CommentsVotesTable.commentId, params.id),
          eq(CommentsVotesTable.userId, session?.user?.id!)
        )
      );

    if (response.length > 0) {
      await db
        .update(CommentsVotesTable)
        .set({ upVote: votes.upVote, downVote: votes.downVote })
        .where(
          and(
            eq(CommentsVotesTable.commentId, params.id),
            eq(CommentsVotesTable.userId, session?.user?.id!)
          )
        );
    } else {
      await db.insert(CommentsVotesTable).values({
        upVote: votes.upVote,
        downVote: votes.downVote,
        userId: session?.user?.id!,
        commentId: params.id,
      });
    }
    const commentAllVotes = await db
      .select()
      .from(CommentsVotesTable)
      .where(
        and(
          eq(CommentsVotesTable.commentId, params.id),
          eq(CommentsVotesTable.upVote, true)
        )
      );
    count = commentAllVotes.length;
  } else {
    let response = await db
      .select()
      .from(NestedCommentsVotesTable)
      .where(
        and(
          eq(NestedCommentsVotesTable.commentId, params.id),
          eq(NestedCommentsVotesTable.userId, session?.user?.id!),
          eq(NestedCommentsVotesTable.nestedCommentId, nestedCommentId)
        )
      );
    if (response.length > 0) {
      await db
        .update(NestedCommentsVotesTable)
        .set({ upVote: votes.upVote, downVote: votes.downVote })
        .where(
          and(
            eq(NestedCommentsVotesTable.commentId, params.id),
            eq(NestedCommentsVotesTable.userId, session?.user?.id!),
            eq(NestedCommentsVotesTable.nestedCommentId, nestedCommentId)
          )
        );
    } else {
      await db.insert(NestedCommentsVotesTable).values({
        upVote: votes.upVote,
        downVote: votes.downVote,
        userId: session?.user?.id!,
        commentId: params.id,
        nestedCommentId: nestedCommentId,
      });
    }
    const commentAllVotes = await db
      .select()
      .from(NestedCommentsVotesTable)
      .where(
        and(
          eq(NestedCommentsVotesTable.commentId, params.id),
          eq(NestedCommentsVotesTable.nestedCommentId, nestedCommentId),
          eq(NestedCommentsVotesTable.upVote, true)
        )
      );
    count = commentAllVotes.length;
  }

  return new Response(
    JSON.stringify({
      message: "Comment updated successfully",
      count,
    }),
    {
      status: 201,
    }
  );
};
