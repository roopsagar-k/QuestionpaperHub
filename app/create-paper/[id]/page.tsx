"use client";
import React, { useEffect, useState } from "react";
import Questions from "@/components/Questions";
import type { QuestionType, Test, cloudinaryImagObj } from "@/app/types/types";
import { Button } from "@/components/ui/button";
import { useParams } from "next/navigation";
import axios from "axios";
import { useRouter } from "next/navigation";
import { TriangleAlert } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const CreatePaper = () => {
  const { id: testId } = useParams();
  const { toast } = useToast();
  const router = useRouter();
  const [deletedImages, setDeletedImages] = useState<cloudinaryImagObj[]>([]);
  const [warningText, setWarningText] = useState<string>("");
  const [questions, setQuestions] = useState<QuestionType[]>([
    {
      question: "",
      options: [{ option: "" }, { option: "" }],
      answer: "",
    },
  ]);

  useEffect(() => {
    async function fetchQuestions() {
      const response = await axios.get<Test>(`/api/tests/${testId}`);
      if (response.status === 200) {
        if (response.data.questions) {
          setQuestions(response.data.questions!);
          setWarningText(
            "Please attach any images and answers to the questions, as the AI does not add them automatically."
          );
        }
      }
    }
    fetchQuestions();
  }, []);

  const handleSubmit = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();

    await axios.put("/api/upload", { deletedImages });
    const response = await axios.put("/api/tests/add-questions", {
      questions,
      testId,
    });

    if (response.status === 200) {
      toast({ description: "Questions updated successfully! :)" });
      router.replace("/tests-created");
    }
  };

  return (
    <div className="px-[2rem] md:px-[10%] lg:px-[20%] py-8">
      <div className="bg-gradient-to-r from-primary to-secondary-foreground text-transparent bg-clip-text relative">
        <h1 className="text-xl font-bold text-center md:text-3xl lg:text-5xl">
          Create and Share Your Ultimate Online Question Paper.
        </h1>
      </div>
      <div className="leading-7 [&:not(:first-child)]:mt-6 text-yellow-600">
        {warningText ? (
          <div className="flex gap-2">
            <TriangleAlert />
            <p>{warningText}</p>
          </div>
        ) : (
          `Whether you're preparing for an exam, conducting a quiz, our intuitive interface makes it easy to tailor question papers to your exact specifications. If the question consists of any diagrams, you have an option to attach an image for each question. Start crafting your unique question papers today and elevate your learning experience like never before!`
        )}
      </div>
      <div className="flex flex-col gap-2 mt-4">
        <Questions
          questions={questions}
          setQuestions={setQuestions}
          deletedImages={deletedImages}
          setDeletedImages={setDeletedImages}
        />
      </div>
      <Button
        className="w-full mt-2"
        variant={"secondary"}
        onClick={(e) => handleSubmit(e)}
      >
        Submit
      </Button>
    </div>
  );
};

export default CreatePaper;
