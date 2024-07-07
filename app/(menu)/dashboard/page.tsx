"use client";
import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import axios from "@/axiosConfig";
import { Test, TestInfo } from "../../types/types";
import { Button } from "@/components/ui/button";
import moment from "moment";
import { Clock } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMediaQuery } from "react-responsive";

type UserTestTakenType = {
  tests: Test;
  tests_taken: TestInfo;
};

const Dashboard = () => {
  const [takenTests, setTakenTests] = useState<UserTestTakenType[]>();
  const router = useRouter();
  const isPhoneView = useMediaQuery({ query: "(max-width: 767px)" });
  useEffect(() => {
    async function fetchTestsTaken() {
      const response = await axios.get("api/tests-taken");
      const { testsTaken }: { testsTaken: UserTestTakenType[] } = response.data;
      console.log("records : ", testsTaken);
      setTakenTests(testsTaken);
    }
    fetchTestsTaken();
  }, []);
  return (
    <div className="container mx-auto p-3 sm:p-6 md:p-8 lg:p-10 xl:p-12 flex flex-col items-center">
      {takenTests?.length! > 0 ? (
        takenTests?.map((test) => (
          <Card
            key={test?.tests?.id!}
            className="md:w-[35rem] lg:w-[55rem] mt-6 cursor-pointer dark:hover:bg-slate-900 shadow-sm shadow-gray-400 dark:shadow-none"
          >
            <CardHeader>
              <CardTitle className="text-xl md:text-lg lg:text-xl">
                {test?.tests?.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="-mt-4">
              <CardDescription>
                {" "}
                {test.tests.description.length > 400
                  ? test.tests.description.slice(0, isPhoneView ? 200 : 400) +
                    "..."
                  : test.tests.description}
              </CardDescription>
            </CardContent>
            <CardFooter className="w-full flex flex-col gap-2 md:flex-row items-center justify-between">
              <p className="flex gap-2 items-center text-wrap justify-center">
                <Clock className="w-4 h-4" /> Total time taken:{" "}
                {moment
                  .duration(test.tests.duration, "minutes")
                  .subtract(
                    moment
                      .duration(test.tests_taken.minutes, "minutes")
                      .add(test.tests_taken.seconds, "seconds")
                  )
                  .minutes()}{" "}
                minutes :
                {moment
                  .duration(test.tests.duration, "minutes")
                  .subtract(
                    moment
                      .duration(test.tests_taken.minutes, "minutes")
                      .add(test.tests_taken.seconds, "seconds")
                  )
                  .seconds()}{" "}
                seconds
              </p>
              <div className="flex gap-2">
                <Button
                  variant={"secondary"}
                  onClick={() => {
                    router.push(`tests/${test.tests_taken.testId}`);
                  }}
                >
                  Retake Test
                </Button>
                <Button
                  onClick={() =>
                    router.push(
                      `dashboard/tests-taken/${test.tests_taken.testId}`
                    )
                  }
                  className="text-white font-semibold"
                >
                  View Results
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))
      ) : (
        <div className="w-full text-center text-gray-500">
          You haven't taken test of any QP yet. Start now to see your results
          here!
        </div>
      )}
      <div className="h-16"></div>
    </div>
  );
};

export default Dashboard;
