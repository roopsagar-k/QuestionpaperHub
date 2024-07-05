import { auth } from "@/auth";
import { NextResponse } from "next/server";
import { db } from "@/lib/drizzle/db";
import { UserTable } from "@/lib/drizzle/schema";
import { eq } from "drizzle-orm";

export const GET = auth(async function GET(req) {
  const session = await auth()
  console.log("req.auth: ", req.auth);
  if (req.auth) {
    const response = await db
      .select()
      .from(UserTable)
      .where(eq(UserTable.id, req?.auth.user?.id!));
      console.log('req auth res: ', response);
    return NextResponse.json({ id:response[0].id, email: response[0].email, name: response[0].name, userName: response[0].userName, image: response[0].imgUrl });
  }
  return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
});
