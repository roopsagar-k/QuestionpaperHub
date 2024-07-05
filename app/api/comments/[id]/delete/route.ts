import { db } from "@/lib/drizzle/db";
import { CommentsTable } from "@/lib/drizzle/schema";
import { eq } from "drizzle-orm";

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  await db.delete(CommentsTable).where(eq(CommentsTable.id, params.id));
  return new Response(
    JSON.stringify({
      message: "Comment deleted successfully",
    }),
    {
      status: 200,
    }
  );
}
