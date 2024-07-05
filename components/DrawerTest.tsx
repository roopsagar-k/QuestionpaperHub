"use client";
import React, { useEffect, useRef, useState } from "react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useRouter } from "next/navigation";
import { Test } from "@/app/types/types";
import axios from "@/axiosConfig";
import AuthModal from "./AuthModal";
import Register from "./Register";
import Login from "./Login";
import pdfToImages from "@/lib/pdfToImage";
import { useUserContext } from "@/context/UserContext";
import { Loader2 } from "lucide-react";
import { createWorker } from "tesseract.js";

const DrawerTest = ({ children }: { children?: React.ReactNode }) => {
  const router = useRouter();
  const [ownTest, setOwnTest] = useState(false);
  const [privatePost, setPrivatePost] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [openLoginDialog, setOpenLoginDialog] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const [text, setText] = useState<string>("");
  const [openDrawer, setOpenDrawer] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const { user } = useUserContext();

  const workerRef = useRef<Tesseract.Worker | null>(null);
  useEffect(() => {
    async function worker() {
      workerRef.current = await createWorker({
        logger: (message) => {
          if ("progress" in message) {
            console.log("progress", message.progress);
            console.log(message.progress === 1 ? "Done" : message.status);
          }
        },
      });
    }
    worker();
    return () => {
      workerRef.current?.terminate();
      workerRef.current = null;
    };
  }, []);

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    let files = e.target.files;
    const worker = workerRef.current;
    await worker?.load();
    await worker?.loadLanguage("eng");
    await worker?.initialize("eng");

    if (files && files[0].type === "application/pdf") {
      setFile(files[0]);
      setIsProcessing(true);
      console.log("it is pdf");
      const pdfUrl = URL.createObjectURL(files[0]);
      const imageUrls = await pdfToImages(pdfUrl);
      console.log("image urls", imageUrls);
      for (let i = 0; i < imageUrls.length; i++) {
        const response = await worker?.recognize(imageUrls[i]);
        console.log(response?.data.text, "response");
        setText((prev) => prev + " " + response?.data.text);
      }
      setIsProcessing(false);
    }

    if (files && files[0].type === "image/*") {
      setFile(files[0]);
      setIsProcessing(true);
      for (let i = 0; i < files.length; i++) {
        const url = URL.createObjectURL(files[i]);
        const response = await worker?.recognize(url);
        console.log(response?.data.text, "response");
        setText((prev) => prev + " " + response?.data.text);
      }
      setIsProcessing(false);
    }
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    const titleInput = e.currentTarget.title as unknown as HTMLInputElement;
    const data: Test = {
      title: titleInput.value,
      description: e.currentTarget.description.value,
      duration: parseInt(e.currentTarget.duration.value),
      tags: e.currentTarget.tags.value,
      ownTest: ownTest,
      privatePost: privatePost,
    };
    let testId = "";
    if (file) {
      const formData = new FormData();
      const blob = new Blob([text], { type: "text/plain" });
      const file = new File([blob], "converted-text.txt", {
        type: "text/plain",
      });
      formData.append("file", file);
      formData.append("data", JSON.stringify(data));
      try {
        setIsLoading(true);
        const response = await axios.post("api/tests/file", formData);
        testId = response.data.testId;
        console.log("respnse 201 chekc", response);
        if (response.status === 201) {
          setIsLoading(false);
          router.push(`/create-paper/${testId}`);
        } else {
          setIsLoading(false);
          setErrorMessage("Failed to parse your pdf file.");
        }
      } catch (error) {
        setIsLoading(false);
        setErrorMessage("Failed to parse your pdf file.");
        console.error("Error creating test: ", error);
      }
    } else {
      try {
        const res = await axios.post("api/tests", data);
        testId = res.data.testId;
        if (data.ownTest) {
          router.push(`/create-paper/${testId}`);
          return;
        }
      } catch (error) {
        console.error("Error creating test: ", error);
      }
    }
  };

  return (
    <>
      {openLoginDialog && (
        <AuthModal open={openLoginDialog} setOpen={setOpenLoginDialog}>
          {!isLogin ? (
            <Register setIsLogin={setIsLogin} />
          ) : (
            <Login setIsLogin={setIsLogin} />
          )}
        </AuthModal>
      )}
      <Drawer open={openDrawer} onOpenChange={setOpenDrawer}>
        <div
          onClick={() =>
            user ? setOpenDrawer(true) : setOpenLoginDialog(true)
          }
        >
          {children}
        </div>
        <DrawerContent className="sm:px-[10%] md:[15%] lg:px-[20%]">
          <form onSubmit={(e) => handleSubmit(e)}>
            <DrawerHeader className="max-h-screen overflow-y-scroll">
              <DrawerTitle>Test creation</DrawerTitle>
              <DrawerDescription>
                <p className="text-destructive">
                  {errorMessage && errorMessage}
                </p>
                Create test by uploading PDF/Images or Add the questions and
                options manually
              </DrawerDescription>
              <div className="grid grid-cols-2 gap-4 mt-2">
                <Card className="flex flex-col gap-3 items-center text-justify sm:flex-row sm:items-start shadow-md sm:text-left p-3">
                  <div>
                    <CardTitle className="text-md">
                      Compose Your Own Test
                    </CardTitle>
                    <CardDescription className="text-xs sm:text-sm">
                      Manually add questions, options, answers, and attach
                      PDFs/images to create your own question paper.
                    </CardDescription>
                  </div>
                  <Switch
                    id="own-test"
                    name="ownTest"
                    checked={ownTest}
                    value={ownTest ? "on" : "off"}
                    onCheckedChange={() => setOwnTest(!ownTest)}
                  />
                </Card>
                <Card className="flex flex-col gap-3 items-center text-justify shadow-md sm:flex-row sm:items-start sm:text-left p-3">
                  <div>
                    <CardTitle className=" text-md">Private post</CardTitle>
                    <CardDescription className="text-xs">
                      By checking this, your post or test will be visible only
                      to those who access them via links, not even to your
                      followers.
                    </CardDescription>
                  </div>
                  <Switch
                    id="private-post"
                    name="privatePost"
                    value={privatePost ? "on" : "off"}
                    checked={privatePost}
                    onCheckedChange={() => setPrivatePost(!privatePost)}
                  />
                </Card>
              </div>
              <Card className="flex items-center justify-center shadow-md relative">
                <CardContent className="flex flex-col items-center justify-center mt-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-12 h-12"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10.5 3.75a6 6 0 0 0-5.98 6.496A5.25 5.25 0 0 0 6.75 20.25H18a4.5 4.5 0 0 0 2.206-8.423 3.75 3.75 0 0 0-4.133-4.303A6.001 6.001 0 0 0 10.5 3.75Zm2.03 5.47a.75.75 0 0 0-1.06 0l-3 3a.75.75 0 1 0 1.06 1.06l1.72-1.72v4.94a.75.75 0 0 0 1.5 0v-4.94l1.72 1.72a.75.75 0 1 0 1.06-1.06l-3-3Z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <CardDescription className="text-primary">
                    <p>Choose PDF/images or drag and drop</p>
                    <p className="text-center text-white mt-2 underline">
                      {file ? file.name : ""}
                    </p>
                  </CardDescription>
                </CardContent>
                <Input
                  className="w-full h-full absolute opacity-0"
                  id="file"
                  name="file"
                  onChange={(e) => onFileChange(e)}
                  multiple={true}
                  type="file"
                  required={!ownTest}
                  disabled={ownTest}
                  accept="image/*, application/pdf"
                />
              </Card>
              <div className="flex mt-4 gap-4">
                <div className="flex flex-col w-full gap-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    name="title"
                    placeholder="Title"
                    type="text"
                    required
                  />
                </div>
                <div className="flex flex-col w-full gap-2">
                  <Label htmlFor="title">Duration in mins</Label>
                  <Input
                    id="duration"
                    name="duration"
                    type="number"
                    placeholder="Enter the test duration in minutes"
                    required
                  />
                </div>
              </div>
              <div className="flex flex-col mt-4 gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  typeof="text"
                  id="description"
                  name="description"
                  placeholder="Share your thoughts about this post..."
                  required
                />
              </div>
              <div className="flex flex-col mt-4 gap-2">
                <Label htmlFor="tags">Tags</Label>
                <Input
                  id="tags"
                  name="tags"
                  type="text"
                  placeholder="Add relevant tags (comma-separated)"
                  required
                />
              </div>
            </DrawerHeader>
            <DrawerFooter>
              <Button disabled={isProcessing} type="submit">
                {isProcessing && (
                  <div className="flex gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>
                      Analyzing Your Document, This May Take a Moment...
                    </span>
                  </div>
                )}
                {isLoading ? (
                  <div className="flex gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>
                      Hang tight! Gemini AI is working its magic ✨
                    </span>{" "}
                  </div>
                ) : (
                  !isProcessing && <span>Submit</span>
                )}
              </Button>
              <DrawerClose>
                <Button variant="outline" className="w-full" type="button">
                  Cancel
                </Button>
              </DrawerClose>
            </DrawerFooter>
          </form>
        </DrawerContent>
      </Drawer>
      <script src="pdf.mjs" type="module" />
    </>
  );
};

export default DrawerTest;
