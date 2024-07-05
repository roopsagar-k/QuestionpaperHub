"use client";
import { Test } from "@/app/types/types";
import { TestInfoProvider } from "@/context/TestInfoContext";
import axios from "axios";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { id, pagination } = useParams();
  const [test, setTest] = useState<Test | null>(null);
  useEffect(() => {
    async function fetchData() {
      const response = await axios.get<Test>(`/api/tests/${id}`);
      if (response.status === 200) {
        setTest(response.data);
      }
    }
    fetchData();
  }, []);
  return <TestInfoProvider>{children}</TestInfoProvider>;
};

export default Layout;
