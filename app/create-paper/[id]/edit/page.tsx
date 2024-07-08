"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import type { Test, cloudinaryImagObj } from "@/app/types/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import Questions from "@/components/Questions";
import type { QuestionType } from "@/app/types/types";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";

const EditPage = () => {
  const [test, setTest] = useState<Test | null>(null);
  const { toast } = useToast();
  const { id } = useParams();
  const [questions, setQuestions] = useState<QuestionType[]>([]);
  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      const response = await axios.get<Test>(`/api/tests/${id}`);
      if (response.status === 200) {
        setTest(response.data);
        setQuestions(response.data.questions || []);
      }
    }
    fetchData();
  }, [id]);

  const [deletedImages, setDeletedImages] = useState<cloudinaryImagObj[]>([]);

  const handleSaveChanges = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    const data: Test = {
      ...test!,
      questions: questions,
    };

    await axios.put("/api/upload", { deletedImages });

    const response = await axios.put(`/api/tests/${id}`, { data });

    if (response.status === 200) {
      toast({ description: "Changes updated successfully! :)" });
      router.back();
    }
  };

  return (
    <div className="px-4 sm:px-6 md:px-[10%] lg:px-[20%] py-8">
      <div className="max-w-screen-lg mx-auto">
        <div className="my-4">
          <Label className="font-semibold text-lg" htmlFor="title">
            Title
          </Label>
          <Input
            id="title"
            name="title"
            placeholder="Title"
            type="text"
            value={test?.title || ""}
            onChange={(e) =>
              setTest((prev) => ({ ...prev!, title: e.target.value }))
            }
            className="mt-2"
          />
        </div>
        <div className="mt-4">
          <Label className="font-semibold text-lg" htmlFor="description">
            Description
          </Label>
          <Textarea
            id="description"
            name="description"
            value={test?.description || ""}
            onChange={(e) =>
              setTest((prev) => ({ ...prev!, description: e.target.value }))
            }
            className="mt-2"
            placeholder="Share your thoughts about this post..."
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          <div>
            <Label className="font-semibold text-lg" htmlFor="tags">
              Tags
            </Label>
            <Input
              id="tags"
              name="tags"
              onChange={(e) =>
                setTest((prev) => ({ ...prev!, tags: e.target.value }))
              }
              type="text"
              value={test?.tags || ""}
              placeholder="Add relevant tags (comma-separated)"
            />
          </div>
          <div className="flex items-center justify-center gap-4 mt-6">
            <Label className="font-semibold text-lg" htmlFor="private-post">
              Private Post:
            </Label>
            <Switch
              id="private-post"
              name="privatePost"
              checked={test?.privatePost || false}
              onCheckedChange={(val) =>
                setTest((prev) => ({ ...prev!, privatePost: val }))
              }
            />
          </div>
        </div>
      </div>
      <div className="mt-4">
        <Questions
          questions={questions}
          setQuestions={setQuestions}
          deletedImages={deletedImages}
          setDeletedImages={setDeletedImages}
        />
        <Button
          variant="secondary"
          className="mt-4 w-full max-w-sm mx-auto sm:max-w-full"
          onClick={(e) => handleSaveChanges(e)}
        >
          Save Changes
        </Button>
      </div>
    </div>
  );
};

export default EditPage;
