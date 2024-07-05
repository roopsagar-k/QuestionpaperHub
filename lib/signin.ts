"use server";
import { signIn } from "@/auth";

export const SignIn = async (email: string, password: string, pathname: string) => {
  try {
    await signIn("credentials", {
      email: email,
      password: password,
      redirect: true,
      redirectTo: pathname,
    });
  } catch (error) {
    throw error;
  }
};
