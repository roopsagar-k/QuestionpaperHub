import NextAuth, { AuthError } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import Discord from "next-auth/providers/discord";
import { db } from "./lib/drizzle/db";
import { UserTable } from "./lib/drizzle/schema";
import { count, eq } from "drizzle-orm";
import bcypt from "bcryptjs";
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
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
      authorization: { params: { access_type: "offline", prompt: "consent" } },
    }),
    Discord({
      clientId: process.env.AUTH_DISCORD_ID,
      clientSecret: process.env.AUTH_DISCORD_SECRET,
      authorization: { params: { access_type: "offline", prompt: "consent" } },
    }),
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        const user = await db
          .select()
          .from(UserTable)
          .where(eq(UserTable.email, credentials.email as string));

        if (user.length === 0) {
          throw new AuthError("User not found.");
        }

        const isValidPassword = await bcypt.compare(
          credentials.password as string,
          user[0].password
        );

        if (!isValidPassword) {
          throw new AuthError("Invalid password, try again!");
        }

        return isValidPassword ? user[0] : null;
      },
    }),
  ],
  callbacks: {
    async signIn({ account, profile, user }) {
      const allUsers = await db.select().from(UserTable);
      console.log(account, profile, user, allUsers);
      const totalUsers = allUsers.length;
      if(account?.provider === "credentials"){
        return true;
      }
      if (account?.provider === "google") {
        if (profile?.email_verified) {
          const result = await db
            .select()
            .from(UserTable)
            .where(eq(UserTable.email, profile?.email!));
          if (result.length === 0) {
            await db.insert(UserTable).values({
              id: user.id,
              email: profile?.email!,
              password: "google-auth",
              name: profile?.name!,
              imgUrl: profile?.picture,
              userName:
                (profile?.given_name! + profile?.family_name).toLowerCase() +
                specialCharacters[
                  Math.floor(Math.random() * specialCharacters.length)
                ] +
                (totalUsers + 1).toString(),
            });
          } else {
            //   await db
            //     .update(UserTable)
            //     .set({
            //       id: user.id,
            //       password: "google-auth",
            //     })
            //     .where(eq(UserTable.email, profile?.email!));
          }
          return true;
        }
        return false;
      }
      if (account?.provider === "discord") {
        if (profile?.verified) {
          const result = await db
            .select()
            .from(UserTable)
            .where(eq(UserTable.email, profile?.email!));

          if (result.length === 0) {
            await db.insert(UserTable).values({
              id: user.id,
              email: profile?.email!,
              password: "discord-auth",
              imgUrl: profile?.image_url as string,
              name: profile?.global_name as string,
              userName:
                profile?.username +
                specialCharacters[
                  Math.floor(Math.random() * specialCharacters.length)
                ] 
                + (totalUsers + 1).toString(),
            });
          } else {
            // await db
            //   .update(UserTable)
            //   .set({
            //     id: user.id,
            //     password: "discord-auth",
            //     name: profile?.name!,
            //   })
            //   .where(eq(UserTable.email, profile?.email!));
          }
          return true;
        }
        return false;
      }
      return false;
    },
    async jwt({ token, user, account }) {
      const User = await db
        .select()
        .from(UserTable)
        .where(eq(UserTable.email, token?.email!));

      if (account?.provider === "google" || account?.provider === "discord") {
        if (User.length > 0) {
          token.id = User[0].id?.toString();
          user.id = User[0].id?.toString();
        }
      }

      if (user) {
        token.id = User[0]?.id?.toString();
        token.email = user.email?.toString();
        token.picture = User[0]?.imgUrl?.toString();
      }

      return token;
    },
    async session({ session, token, user }) {
      if (token) {
        session.user.id = token.id?.toString()!;
        session.user.email = token.email?.toString()!;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  cookies: {
    pkceCodeVerifier: {
      name: "next-auth.pkce.code_verifier",
      options: {
        httpOnly: true,
        sameSite: "none",
        path: "/",
        secure: true,
      },
    },
  },
});
