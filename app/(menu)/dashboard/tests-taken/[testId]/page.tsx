"use client";
import axios from "@/axiosConfig";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { QuestionType, TestInfo } from "@/app/types/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import moment from "moment";
import Questions from "@/components/Questions";

const Page = () => {
  const { testId } = useParams();
  const [testDetails, setTestDetails] = useState<TestInfo>();
  const [totalDuration, setTotalDuration] = useState<number>(0);
  const [questions, setQuestions] = useState<QuestionType[]>();

  useEffect(() => {
    async function fetchTestsDetails() {
      const response = await axios.get(`api/tests-taken/${testId}`);
      const { testDetails, totalDuration, questions } = response.data;
      setTestDetails(testDetails);
      setTotalDuration(totalDuration);
      setQuestions(questions);
    }
    fetchTestsDetails();
  }, []);

  return (
    <div className="px-4 md:px-[10%] lg:px-[20%] py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl md:text-2xl">Scores</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col md:flex-row items-start md:items-center justify-between">
          <div className="font-semibold text-lg md:text-2xl mb-4 md:mb-0 flex gap-2 md:flex-col items-center text-center md:text-left">
            Latest Score:{" "}
            <span className="px-3 py-1 mt-1 md:mt-0 rounded border-2 bg-secondary border-blue-500">
              {testDetails?.currentScore}
            </span>
          </div>
          <div className="font-semibold text-lg md:text-2xl mb-4 md:mb-0 flex gap-2 md:flex-col items-center text-center md:text-left">
            Highest Achieved Score:{" "}
            <span className="px-3 py-1 mt-1 md:mt-0 rounded border-2 bg-secondary border-blue-500">
              {testDetails?.highestScore}
            </span>
          </div>
          <div className="font-semibold text-lg md:text-2xl flex  gap-2 md:flex-col items-center text-center md:text-left">
            Total Score:{" "}
            <span className="px-3 py-1 mt-1 md:mt-0 rounded border-2 bg-secondary border-blue-500">
              {testDetails?.totalScore}
            </span>
          </div>
        </CardContent>
      </Card>
      <Card className="mt-4">
        <CardHeader></CardHeader>
        <CardContent className="flex gap-4 flex-col md:flex-row justify-between text-lg md:text-xl items-start md:items-center font-semibold">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <p>Time Taken:</p>
            <span className="px-3 py-1 rounded border-2 bg-secondary border-blue-500">
              {moment
                .duration(totalDuration, "minutes")
                .subtract(
                  moment
                    .duration(testDetails?.minutes, "minutes")
                    .add(testDetails?.seconds, "seconds")
                )
                .minutes()}
              {" minutes "}:{" "}
              {moment
                .duration(totalDuration, "minutes")
                .subtract(
                  moment
                    .duration(testDetails?.minutes, "minutes")
                    .add(testDetails?.seconds, "seconds")
                )
                .seconds()}{" "}
              {" seconds"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <p>Total Duration:</p>
            <span className="px-3 py-1 rounded border-2 bg-secondary border-blue-500">
              {totalDuration}
              {" minutes "}: {"00 seconds"}
            </span>
          </div>
        </CardContent>
      </Card> 
      <Card className="mt-4 py-4 px-8">
        <CardDescription className="flex flex-col gap-2 md:flex-row justify-around">
          <div className="flex gap-2">
            <div className="w-4 h-4 bg-green-700"></div>
            <p>Correct Answer</p>
          </div>
          <div className="flex gap-2">
            <div className="w-4 h-4 bg-destructive"></div>
            <p>Wrong Answer</p>
          </div>
          <div className="flex gap-3">
            <div className="w-4 h-4 text-black dark:text-white">NA</div>
            <p>Not Attended</p>
          </div>
        </CardDescription>
      </Card>
      <Questions
        questions={questions!}
        answers={testDetails?.answers}
        showAnswers={true}
        readOnly={true}
      />
    </div>
  );
};

export default Page;
