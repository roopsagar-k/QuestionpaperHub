import { db } from "@/lib/drizzle/db";
import { VotesTable } from "@/lib/drizzle/schema";
import { eq } from "drizzle-orm";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  let votes = await db
    .select()
    .from(VotesTable)
    .where(eq(VotesTable.postId, params.id));

  votes = votes.filter((vote) => vote.upVote === true);
  return new Response(JSON.stringify(votes), {
    status: 200,
  });
}
