import { db } from "@/lib/drizzle/db";
import { VotesTable } from "@/lib/drizzle/schema";
import { and, eq } from "drizzle-orm";
import { auth } from "@/auth";

export const GET = async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  const votes = await db
    .select()
    .from(VotesTable)
    .where(
      and(
        eq(VotesTable.postId, params.id),
        eq(VotesTable.userId, session?.user?.id!)
      )
    );

  const vote = {
    postId: votes.length > 0 ? votes[0].postId : params.id,
    upVote: votes.length > 0 ? votes[0].upVote : false,
    downVote: votes.length > 0 ? votes[0].downVote : false,
  };

  return new Response(JSON.stringify(vote), {
    status: 200,
  });
};
