import "dotenv/config";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { db } from "@/lib/drizzle/db";
import { UserTable } from "@/lib/drizzle/schema";
import { eq } from "drizzle-orm";

export async function POST(request: Request) {
  const { email, password } = await request.json();
  const hashedPassword = await bcrypt.hash(password, 10);
  const specialCharacters = [
    "!",
    "#",
    "$",
    "%",
    "&",
    "*",
    "+",
    "-",
    "=",
    "?",
    "^",
    "_",
    "~",
    ".",
    "@",
  ];
  try {
    const result = await db
      .select()
      .from(UserTable)
      .where(eq(UserTable.email, email));
    if (result.length > 0) {
      return new NextResponse(
        JSON.stringify({ message: "User already exists" }),
        {
          status: 400,
        }
      );
    }
    const user = await db
      .insert(UserTable)
      .values({
        email: email,
        password: hashedPassword,
        name: email.split("@")[0],
        imgUrl:
          "https://lh3.googleusercontent.com/a/ACg8ocIrN86IwRht-WxTwqSSTIum3FHrPwBuYbBqmCXbjp8rNHcB3ws=s288-c-no",
        userName:
          email.split("@")[0] +
          specialCharacters[
            Math.floor(Math.random() * specialCharacters.length)
          ] +
          (result.length + 1).toString(),
      })
      .returning();

    return new NextResponse(
      JSON.stringify({
        message: "Registration successfull",
        user: {
          email: user[0]?.email,
          id: user[0]?.id,
          name: user[0]?.name,
          userName: user[0]?.userName,
          image: user[0]?.imgUrl,
        },
      }),
      { status: 201 }
    );
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "unknown error: " + error;

    return new NextResponse(JSON.stringify({ errorMessage: errorMessage }), {
      status: 500,
    });
  }
}
