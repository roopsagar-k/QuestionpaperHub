import React, { useEffect, useState } from "react";
import Pagination from "@/components/PaginationChange";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Test } from "@/app/types/types";
import { TestInfo } from "@/app/types/types";
import classNames from "classnames";
import Timer from "./Timer";
import { Button } from "./ui/button";
import { insertTestTakenInfo } from "@/lib/actions";
import { useUserContext } from "@/context/UserContext";
import axios from "@/axiosConfig";
import { useRouter } from "next/navigation";

interface QuestionProps {
  test: Test;
  setTest: React.Dispatch<React.SetStateAction<Test | null>>;
  selectedOption: number;
  setSelectedOption: React.Dispatch<React.SetStateAction<number | undefined>>;
  testInfo: TestInfo;
  setTestInfo: React.Dispatch<React.SetStateAction<TestInfo | undefined>>;
}

const Question: React.FC<QuestionProps> = ({
  test,
  setTest,
  selectedOption,
  setSelectedOption,
  testInfo,
  setTestInfo,
}) => {
  const [index, setIndex] = useState<number>(0);
  const [userElapsedMinutes, setUserElapsedMinutes] = useState<number>(0);
  const [userElapsedSeconds, setUserElapsedSeconds] = useState<number>(0);
  const [stopTimer, setStopTimer] = useState<boolean>(false);
  const router = useRouter();
  const { user, setUser } = useUserContext();


  useEffect(() => {
    async function checkAuthenticated() {
      if (!user) {
        try {
          const response = await axios.get("/api/admin");
          if (response.status === 200) {
            setUser(response.data);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    }
    checkAuthenticated();
  }, [user]);

  useEffect(() => {
    const answerObj = testInfo?.answers?.find(
      (answer) => answer.questionIndex === index
    );
    if (answerObj) {
      setSelectedOption(answerObj.answer);
    } else {
      setSelectedOption(undefined);
    }
  }, [index]);

  const handleSubmit = async () => {
    setStopTimer(true);
    testInfo.minutes = userElapsedMinutes;
    testInfo.seconds = userElapsedSeconds;
    testInfo.userId = user?.id;
    await insertTestTakenInfo(testInfo, user?.id!);
    router.push(`/dashboard`);
  };
  return (
    <div className="p-3 sm:p-6 md:p-8 lg:p-10 xl:p-12 h-screen flex flex-col gap-4">
      <div className="flex flex-wrap justify-center gap-2 md:justify-between items-center">
        <h1 className="scroll-m-20 text-2xl md:text-4xl font-extrabold tracking-tight lg:text-5xl max-w-[90%] md:max-w-[60%] lg:max-w-[50%] truncate">
          {test?.title} &nbsp;
        </h1>
        <div className="flex gap-3 items-center">
          {index + 1 === test?.questions?.length ? (
            <Button
              onClick={handleSubmit}
              className="font-semibold h-12 text-white text-xl px-4 py-2"
            >
              Submit
            </Button>
          ) : (
            // <Button className="font-semibold h-12 text-white text-xl px-4 py-2">
            //   {" "}
            //   Save & exit
            // </Button>
            <></>
          )}
          <Timer
            timeInMinutes={test?.duration!}
            stopTimer={stopTimer}
            setUserElapsedMinutes={setUserElapsedMinutes}
            setUserElapsedSeconds={setUserElapsedSeconds}
          />
        </div>
      </div>
      <Card className="my-4 mb-20 md:mb-12 w-full flex-grow overflow-auto px-6 shadow-md">
        <CardHeader>
          <CardTitle className="whitespace-pre-wrap break-words text-xl md:text-2xl text-pretty font-medium">
            {index + 1 + ".  "} {test?.questions![index].question}
          </CardTitle>
          <div className="flex flex-wrap px-6 justify-center">
            {test?.questions![index].images?.map((image, imgIndex) => (
              <Image
                key={imgIndex}
                src={"/images/" + image}
                width={600}
                height={400}
                className="mt-4"
                alt="Question Image"
              />
            ))}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {test?.questions![index].options?.map((option, OptionIndex) => (
              <div key={OptionIndex} className="flex items-center space-x-2">
                <label
                  className={classNames(
                    `p-4 border-2 w-full h-full border-l-4 border-l-primary dark:bg-black backdrop-blur-xl ${
                      selectedOption !== OptionIndex + 1 &&
                      "hover:bg-blue-100 dark:hover:bg-slate-900 dark:hover:bg-opacity-50"
                    } cursor-pointer rounded-sm`,
                    selectedOption === OptionIndex + 1 &&
                      "bg-blue-200 dark:bg-blue-950"
                  )}
                  htmlFor={`r${OptionIndex}`}
                >
                  <input
                    value={OptionIndex + 1}
                    checked={selectedOption === OptionIndex + 1}
                    className="hidden"
                    onChange={(e) => {
                      const selectedValue = parseInt(e.target.value);
                      if (selectedOption === selectedValue) {
                        setSelectedOption(undefined);
                        setTestInfo((prev: TestInfo | undefined) => {
                          const answers =
                            prev?.answers?.filter(
                              (answer) => answer.questionIndex !== index
                            ) || [];
                          return {
                            ...prev,
                            answers,
                          };
                        });
                      } else {
                        setSelectedOption(selectedValue);
                        setTestInfo((prev: TestInfo | undefined) => {
                          const answers =
                            prev?.answers?.filter(
                              (answer) => answer.questionIndex !== index
                            ) || [];
                          return {
                            ...prev,
                            answers: [
                              ...answers!,
                              {
                                questionIndex: index,
                                answer: selectedValue,
                              },
                            ],
                          };
                        });
                      }
                    }}
                    type="checkbox"
                    id={`r${OptionIndex}`}
                    name="question"
                  />
                  <p>
                    <span className="font-semibold">
                      {`Option ${String.fromCharCode(65 + OptionIndex)}:`}{" "}
                    </span>
                    &nbsp;
                    {option.option}
                  </p>
                </label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      <Pagination
        pageNo={index + 1}
        test={test!}
        index={index}
        setIndex={setIndex}
      />
    </div>
  );
};

export default Question;
