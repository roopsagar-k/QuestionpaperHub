"use client";
import type React from "react";
import { useState } from "react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
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
import type { Test } from "@/app/types/types";
import axios from "axios";
import AuthModal from "../auth/AuthModal";
import Register from "../auth/Register";
import Login from "../auth/Login";
import { useUserContext } from "@/context/UserContext";
import { FileText, Loader2, Upload } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { GoogleGenAI } from "@google/genai";
import { cn } from "@/lib/utils";

const DrawerTest = ({ children }: { children?: React.ReactNode }) => {
  const router = useRouter();
  const [ownTest, setOwnTest] = useState(false);
  const [privatePost, setPrivatePost] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [openLoginDialog, setOpenLoginDialog] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const { user, setUser } = useUserContext();
  const [arrayOfObjects, setArrayOfObjects] = useState<any>([]);



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
  
async function getArrayOfObjects(base64: string) {
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


  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || !files[0]) {
      return;
    }
    setFile(files[0]);
    try {
      setIsLoading(true);
      setErrorMessage("");
      const resultArray = await getArrayOfObjects(
        Buffer.from(await files[0].arrayBuffer()).toString("base64")
      );
      setArrayOfObjects(resultArray);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      setErrorMessage(
        "Error occurred while parsing the PDF. Please try again."
      );
      console.error("Error occurred while parsing the pdf:", error);
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
      duration: Number.parseInt(e.currentTarget.duration.value),
      tags: e.currentTarget.tags.value,
      ownTest: ownTest,
      privatePost: privatePost,
    };

    setIsProcessing(true);
    let testId = "";

    try {
      if (file && !ownTest) {
        const response = await axios.post("api/tests/file", {
          arrayOfObjects,
          data,
        });
        testId = response.data.testId;

        if (response.data.error) {
          throw new Error(response.data.error);
        }

        if (response.status === 201) {
          router.push(`/create-paper/${testId}`);
        } else {
          throw new Error("Failed to parse your PDF file.");
        }
      } else if (ownTest) {
        const res = await axios.post("api/tests", data);
        testId = res.data.testId;
        router.push(`/create-paper/${testId}`);
      }
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "An error occurred while creating the test."
      );
      console.error("Error creating test: ", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const isSubmitDisabled = isProcessing || isLoading || (!ownTest && !file);

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
          className="cursor-pointer"
        >
          {children}
        </div>
        <DrawerContent className="sm:px-[10%] md:px-[15%] lg:px-[20%]">
          <form onSubmit={handleSubmit}>
            <ScrollArea className="max-h-[85vh] overflow-y-auto px-6 md:max-h-[90vh]">
              <DrawerHeader className="px-0 pt-6">
                <DrawerTitle className="text-2xl font-bold text-primary">
                  Create New Test
                </DrawerTitle>
                {errorMessage && (
                  <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-md mt-3 border border-destructive/20">
                    {errorMessage}
                  </div>
                )}
                <DrawerDescription className="mt-2 text-muted-foreground">
                  Create a test by uploading a PDF/Images or add questions
                  manually
                </DrawerDescription>

                <div className="mt-8 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="border-2 hover:border-primary/50 transition-colors duration-200">
                      <CardContent className="flex flex-col sm:flex-row items-start gap-4 justify-between p-4">
                        <div>
                          <CardTitle className="text-lg mb-2">
                            Compose Your Own Test
                          </CardTitle>
                          <CardDescription>
                            Manually add questions, options, and answers
                          </CardDescription>
                        </div>
                        <Switch
                          id="own-test"
                          checked={ownTest}
                          onCheckedChange={() => setOwnTest(!ownTest)}
                          className="mt-1"
                        />
                      </CardContent>
                    </Card>

                    <Card className="border-2 hover:border-primary/50 transition-colors duration-200">
                      <CardContent className="flex flex-col sm:flex-row items-start gap-4 justify-between p-4">
                        <div>
                          <CardTitle className="text-lg mb-2">
                            Private Post
                          </CardTitle>
                          <CardDescription>
                            Only accessible via direct link
                          </CardDescription>
                        </div>
                        <Switch
                          id="private-post"
                          checked={privatePost}
                          onCheckedChange={() => setPrivatePost(!privatePost)}
                          className="mt-1"
                        />
                      </CardContent>
                    </Card>
                  </div>

                  <Card
                    className={cn(
                      "relative overflow-hidden border-2 border-dashed",
                      file
                        ? "border-primary/70 bg-primary/5"
                        : "border-muted-foreground/30 hover:border-primary/30",
                      ownTest ? "opacity-50" : "" // Removed pointer-events-none here
                    )}
                  >
                    <CardContent className="flex flex-col items-center justify-center py-10 px-4">
                      {file ? (
                        <div className="flex items-center gap-3">
                          <div className="bg-primary/10 p-3 rounded-full">
                            <FileText className="w-8 h-8 text-primary" />
                          </div>
                          <div className="text-left">
                            <p className="font-medium">{file.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {(file.size / (1024 * 1024)).toFixed(2)} MB
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center">
                          <div className="bg-muted p-4 rounded-full inline-flex mb-4">
                            <Upload className="w-10 h-10 text-muted-foreground" />
                          </div>
                          <p className="text-lg font-medium">
                            Choose PDF or drag and drop
                          </p>
                          <p className="text-sm text-muted-foreground mt-1 max-w-md mx-auto">
                            PDF is supported. Upload your test document to
                            automatically generate questions.
                          </p>
                        </div>
                      )}

                      {(isLoading || isProcessing) && (
                        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center">
                          <div className="text-center bg-background p-6 rounded-lg shadow-lg">
                            <Loader2 className="w-10 h-10 animate-spin mx-auto mb-4 text-primary" />
                            <p className="font-medium text-lg">
                              {isLoading
                                ? "Processing your document..."
                                : "Creating test..."}
                            </p>
                            <p className="text-sm text-muted-foreground mt-2">
                              This may take a moment
                            </p>
                          </div>
                        </div>
                      )}
                    </CardContent>

                    {!ownTest && (
                      <Input
                        className="absolute top-0 bottom-0 z-50 w-full h-full opacity-0 cursor-pointer "
                        type="file"
                        onChange={onFileChange}
                        accept="application/pdf"
                        disabled={isLoading || isProcessing}
                      />
                    )}
                  </Card>

                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="title" className="text-sm font-medium">
                          Test Title
                        </Label>
                        <Input
                          id="title"
                          placeholder="Enter test title"
                          required
                          className="h-11"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label
                          htmlFor="duration"
                          className="text-sm font-medium"
                        >
                          Duration (minutes)
                        </Label>
                        <Input
                          id="duration"
                          type="number"
                          placeholder="Enter duration"
                          required
                          className="h-11"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="description"
                        className="text-sm font-medium"
                      >
                        Description
                      </Label>
                      <Textarea
                        id="description"
                        placeholder="Describe your test..."
                        className="min-h-[120px] resize-y"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="tags" className="text-sm font-medium">
                        Tags
                      </Label>
                      <Input
                        id="tags"
                        placeholder="Add tags (comma-separated)"
                        required
                        className="h-11"
                      />
                    </div>
                  </div>
                </div>
              </DrawerHeader>

              <DrawerFooter className="px-0 pb-8 pt-6">
                <Button
                  type="submit"
                  disabled={isSubmitDisabled}
                  className="w-full h-12 text-base font-medium"
                >
                  {isProcessing ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-5 w-5 animate-spin" />
                      <span>Creating test...</span>
                    </div>
                  ) : isLoading ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-5 w-5 animate-spin" />
                      <span>Processing document...</span>
                    </div>
                  ) : (
                    "Create Test"
                  )}
                </Button>
                <DrawerClose asChild>
                  <Button variant="outline" className="w-full h-12 text-base">
                    Cancel
                  </Button>
                </DrawerClose>
              </DrawerFooter>
            </ScrollArea>
          </form>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default DrawerTest;
