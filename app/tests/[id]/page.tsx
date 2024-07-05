"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import type { Test } from "@/app/types/types";
import axios from "axios";
import { useTestInfoContext } from "@/context/TestInfoContext";
import type { TestInfo } from "@/app/types/types";
import Question from "@/components/Question";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";

const TestPage = () => {
  const [test, setTest] = useState<Test | null>(null);
  const [selectedOption, setSelectedOption] = useState<number>();
  const { testInfo, setTestInfo } = useTestInfoContext();
  const { id } = useParams();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    function handleOnBeforeUnLoad(event: BeforeUnloadEvent) {
      event.preventDefault();
      return (event.returnValue = "");
    }

    window.addEventListener("beforeunload", handleOnBeforeUnLoad, {
      capture: true,
    });
  }, [id]);

  useEffect(() => {
    async function fetchData() {
      const response = await axios.get<Test>(`/api/tests/${id}`);
      if (response.status === 200) {
        setTest(response.data);
        setTestInfo((prev: TestInfo | undefined) => {
          return { ...prev, testId: response.data.id };
        });
      }
    }
    fetchData();
  }, [id]);

  return (
    <Question
      test={test!}
      setTest={setTest!}
      selectedOption={selectedOption!}
      setSelectedOption={setSelectedOption!}
      testInfo={testInfo!}
      setTestInfo={setTestInfo!}
    />
  );
};

export default TestPage;
