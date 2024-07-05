import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import type { QuestionType, Answer } from "@/app/types/types";
import { Button } from "@/components/ui/button";
import axios from "axios";
import classNames from "classnames";

const Questions = ({
  questions,
  setQuestions,
  deletedImages,
  setDeletedImages,
  readOnly = false,
  answers,
  showAnswers = false,
}: {
  questions: QuestionType[];
  setQuestions?: React.Dispatch<React.SetStateAction<QuestionType[]>>;
  deletedImages?: string[];
  setDeletedImages?: React.Dispatch<React.SetStateAction<string[]>>;
  readOnly?: boolean;
  answers?: Answer[];
  showAnswers?: boolean;
}) => {
  const deleteImage = async (index: number, imageIndex: number) => {
    setDeletedImages!((prev) => {
      const newArray = [...prev];
      newArray.push(questions[index].images![imageIndex]);
      return newArray;
    });
    setQuestions!((prev) => {
      const newArray = [...prev];
      newArray[index].images?.splice(imageIndex, 1);
      return newArray;
    });
  };

  const addOption = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    index: number
  ): void => {
    setQuestions!((prev) => {
      const newArray = [...prev];
      newArray[index] = {
        ...newArray[index],
        options: [...newArray[index].options, { option: "" }],
      };
      return newArray;
    });
  };

  const deleteOption = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    questionIndex: number,
    optionIndex: number
  ): void => {
    setQuestions!((prev) => {
      const newArray = [...prev];
      newArray[questionIndex].options.splice(optionIndex, 1);
      return newArray;
    });
  };
  const addQuestion = () => {
    setQuestions!((prev) => {
      const newQuestion: QuestionType = {
        question: "",
        options: [{ option: "" }, { option: "" }],
        answer: "",
        images: [],
      };
      const newArr = [...prev, newQuestion];
      return newArr;
    });
  };

  const uploadPhoto = async (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    e.preventDefault();
    e.preventDefault();
    const files = e.target.files;
    if (files && files.length > 0) {
      const formData = new FormData();
      for (let i = 0; i < files.length; i++) {
        formData.append("file", files[i]);
      }
      try {
        const response = await axios.post("/api/upload", formData);
        const { uploadedFiles } = response.data;

        setQuestions!((prev) => {
          const newArray = [...prev];
          uploadedFiles.forEach((fileName: string) => {
            newArray[index].images
              ? !newArray[index].images?.includes(fileName) &&
                newArray[index].images?.push(fileName)
              : (newArray[index]["images"] = [fileName]);
          });
          return newArray;
        });
      } catch (error) {
        console.error("Error uploading files:", error);
      }
    }
  };
  return (
    <div>
      {questions?.map((question, index) => (
        <Card key={index} className="py-4 mt-4 shadow-md">
          <CardHeader>
            <CardTitle>
              Question {index + 1}.{" "}
              {!answers?.find((ans) => ans.questionIndex === index) &&
                showAnswers &&
                "(NA)"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              className="h-max"
              placeholder="Question"
              value={questions[index].question}
              readOnly={readOnly}
              onChange={(e) => {
                setQuestions!((prev) => {
                  const newArray = [...prev];
                  newArray[index].question = e.target.value;
                  return newArray;
                });
              }}
            />
            <div>
              {question?.images?.length! > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 my-4 gap-1 overflow-hidden rounded-md">
                  {question?.images?.map((image, imageIndex) => (
                    <div key={image} className="relative">
                      <img
                        key={imageIndex}
                        src={"/images/" + image}
                        alt={image}
                        className="object-cover w-full h-auto"
                      />
                      <div className={`${readOnly && "hidden size-0"}`}>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          onClick={() => deleteImage(index, imageIndex)}
                          className={classNames(
                            "lucide lucide-trash-2 absolute bottom-0 right-0 w-8 h-8 cursor-pointer rounded-full p-1 abs backdrop-blur-lg bg-transparent text-gray-700 dark:text-[#A8B3CF]"
                          )}
                        >
                          <path d="M3 6h18" />
                          <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                          <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                          <line x1="10" x2="10" y1="11" y2="17" />
                          <line x1="14" x2="14" y1="11" y2="17" />
                        </svg>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="grid grid-cols-2 gap-2 mt-4">
              {question?.options.map((option, optionIndex) => (
                <Textarea
                  placeholder={`Option ${optionIndex + 1}`}
                  value={questions[index].options[optionIndex].option}
                  key={optionIndex}
                  readOnly={readOnly}
                  className={classNames(
                    answers?.find((ans) => ans.questionIndex === index)
                      ?.answer ===
                      optionIndex + 1 && "bg-green-700",
                    parseInt(question.answer) !==
                      answers?.find((ans) => ans.questionIndex === index)
                        ?.answer &&
                      answers?.find((ans) => ans.questionIndex === index)
                        ?.answer ===
                        optionIndex + 1 &&
                      "bg-destructive",
                    parseInt(question.answer) === optionIndex + 1 &&
                      showAnswers &&
                      "bg-green-700 bg-opacity-85"
                  )}
                  onChange={(e) =>
                    setQuestions!((prev) => {
                      const newArray = [...prev];
                      newArray[index].options[optionIndex].option =
                        e.target.value;
                      return newArray;
                    })
                  }
                />
              ))}
            </div>
          </CardContent>
          <CardFooter
            className={classNames(
              "flex flex-col md:flex-row gap-4",
              readOnly && "size-0 hidden"
            )}
          >
            <div className="flex gap-4">
              <Button onClick={(e) => addOption(e, index)}>Add Option</Button>
              <Button
                onClick={(e) =>
                  deleteOption(e, index, questions[index].options.length - 1)
                }
              >
                Delete Option
              </Button>
              <div className="bg-secondary p-2.5 rounded-md relative cursor-pointer">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6 cursor-pointer"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m18.375 12.739-7.693 7.693a4.5 4.5 0 0 1-6.364-6.364l10.94-10.94A3 3 0 1 1 19.5 7.372L8.552 18.32m.009-.01-.01.01m5.699-9.941-7.81 7.81a1.5 1.5 0 0 0 2.112 2.13"
                  />
                </svg>
                <Input
                  className="absolute top-0 right-0 bottom-0 left-0 opacity-0 cursor-pointer"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => uploadPhoto(e, index)}
                />
              </div>
            </div>
            <Input
              type="number"
              name="answer"
              max={questions[index].options.length}
              min={0}
              value={questions[index].answer}
              onChange={(e) =>
                setQuestions!((prev) => {
                  const newArray = [...prev];
                  newArray[index].answer = e.target.value;
                  return newArray;
                })
              }
              placeholder="Enter the correct answer number (e.g., 1, 2, 3...)"
            />
          </CardFooter>
        </Card>
      ))}
      <Button
        className={classNames("mt-4 w-full", readOnly && "size-0 hidden")}
        onClick={(e) => addQuestion()}
      >
        Add Question
      </Button>
    </div>
  );
};

export default Questions;
