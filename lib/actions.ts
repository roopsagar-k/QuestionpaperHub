"use server";
import { and, eq } from "drizzle-orm";
import { db } from "./drizzle/db";
import { BookMarkTable, TestsTakenTable } from "./drizzle/schema";
import { TestTable } from "./drizzle/schema";
import { QuestionType } from "@/app/types/types";
import { TestInfo } from "@/app/types/types";
import nodemailer from "nodemailer";
import { GoogleGenAI } from "@google/genai";

function fileToGenerativePart(buffer: string, mimeType: string) {
  return {
    inlineData: {
      data: buffer,
      mimeType,
    },
  };
}

function toSuperscript(text: string): string {
  const superscripts: { [key: string]: string } = {
    "0": "⁰",
    "1": "¹",
    "2": "²",
    "3": "³",
    "4": "⁴",
    "5": "⁵",
    "6": "⁶",
    "7": "⁷",
    "8": "⁸",
    "9": "⁹",
    "-": "⁻",
  };
  return text
    .split("")
    .map((char) => superscripts[char] || char)
    .join("");
}

export async function getArrayOfObjects(base64: string) {
  const genAI = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY as string,
  });

  const prompt = `Extract all questions and answers from this PDF into a well-formed **JSON array**.
Strictly follow this format:

[
  {
    "question": "Sample question?",
    "answer": 1,
    "options": [
      { "option": "Option A" },
      { "option": "Option B" },
      { "option": "Option C" },
      { "option": "Option D" }
    ]
  }
]

Ensure:
- The output is valid JSON.
- There is **no extra text** before or after the JSON.
- The JSON **must not be truncated**. If necessary, return the data in multiple responses instead of cutting it off.
- HTML tags like <sup>-1</sup> should be replaced with Unicode superscripts (e.g., "ms<sup>-1</sup>" → "ms⁻¹").`;

  const contents = [
    { text: prompt },
    fileToGenerativePart(base64, "application/pdf"),
  ];

  const result = await genAI.models.generateContent({
    model: "gemini-2.5-pro-exp-03-25",
    contents: contents,
    config: {
      maxOutputTokens: 32384,
      temperature: 0.3,
    },
  });

  let jsonString = result?.text?.trim();
  console.log("Raw Gemini Output: ", jsonString);
  console.log("--end--");
  // Remove unwanted backticks and ensure valid encoding
  jsonString = jsonString
    ?.replace(/```json|```/g, "") // Remove unnecessary backticks
    ?.replace(/<sup>(.*?)<\/sup>/g, (_, exp) => toSuperscript(exp)); // Convert <sup> to Unicode

  try {
    const resultArray = JSON.parse(jsonString!);
    if (!Array.isArray(resultArray))
      throw new Error("Parsed JSON is not an array.");
    return resultArray;
  } catch (error) {
    console.error("JSON Parsing Error:", error);
    return [];
  }
}

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
