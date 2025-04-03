"use server";
import { and, eq } from "drizzle-orm";
import { db } from "./drizzle/db";
import { BookMarkTable, TestsTakenTable } from "./drizzle/schema";
import { TestTable } from "./drizzle/schema";
import { QuestionType } from "@/app/types/types";
import { TestInfo } from "@/app/types/types";
import nodemailer from "nodemailer";


export async function addToBookMark(postId: string, userId: string) {
  const response = await db
    .insert(BookMarkTable)
    .values({ postId: postId, userId: userId })
    .returning();
}

export async function removeBookMark(postId: string, userId: string) {
  const response = await db
    .delete(BookMarkTable)
    .where(
      and(eq(BookMarkTable.postId, postId), eq(BookMarkTable.userId, userId))
    )
    .returning();
}

export async function insertTestTakenInfo(testInfo: TestInfo, userId: string) {
  const result = await db
    .select({ questions: TestTable.questions })
    .from(TestTable)
    .where(eq(TestTable.id, testInfo.testId!));

  const response = await db
    .select()
    .from(TestsTakenTable)
    .where(
      and(
        eq(TestsTakenTable.testId, testInfo.testId!),
        eq(TestsTakenTable.userId, userId)
      )
    );

  const { questions }: { questions: QuestionType[] } = result[0] as {
    questions: QuestionType[];
  };

  console.log(testInfo, "testInfo form actions");

  let currentScore = 0;
  testInfo.answers?.forEach((answer) => {
    const questionIndex = answer.questionIndex;

    if (questions[questionIndex].answer == answer.answer.toString()) {
      currentScore += 1;
    }
    console.log(currentScore, "yoji");
  });

  if (response.length > 0) {
    let highestScore = response[0].highestScore;
    await db
      .update(TestsTakenTable)
      .set({
        testId: testInfo.testId!,
        userId: userId,
        answers: testInfo.answers,
        minutes: testInfo.minutes,
        seconds: testInfo.seconds,
        currentScore: currentScore,
        highestScore: highestScore > currentScore ? highestScore : currentScore,
        totalScore: questions.length,
      })
      .where(
        and(
          eq(TestsTakenTable.testId, testInfo.testId!),
          eq(TestsTakenTable.userId, userId)
        )
      );
  } else {
    await db.insert(TestsTakenTable).values({
      testId: testInfo.testId!,
      userId: userId,
      answers: testInfo.answers,
      minutes: testInfo.minutes,
      seconds: testInfo.seconds,
      currentScore: currentScore,
      highestScore: currentScore,
      totalScore: questions.length,
    });
  }
}

export async function sendOtp(email: string, genratedOtp: string) {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_APP_PASSWORD,
    },
  });

  try {
    const info = await transporter.sendMail({
      from: `"QuestionPaper Hub" <${process.env.EMAIL}>`,
      to: email,
      subject: "Hello from QuestionPaper Hub!",
      text: `Your OTP code is: ${genratedOtp}`,
      html: `<p>Your OTP code is: <b>${genratedOtp}</b></p>`,
    });

    console.log("Message sent: %s", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Error sending OTP: ", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : error,
    };
  }
}
