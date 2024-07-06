"use client";
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader } from "./ui/card";
import Link from "next/link";
import { Library, LibraryBig, Plus } from "lucide-react";
import classNames from "classnames";
import DrawerTest from "./DrawerTest";
import { usePathname } from "next/navigation";
import { useUserContext } from "@/context/UserContext";
import axiosInstance from "@/axiosConfig";

const PhoneViewPannel = () => {
  const [active, setActive] = useState("");
  const pathname = usePathname();
  const { user, setUser } = useUserContext();
  useEffect(() => {
    async function checkAuthenticated() {
      if (!user) {
        try {
          const response = await axiosInstance.get("/api/admin");
          if (response.status === 200) {
            console.log("user dta: ", response.data);
            setUser(response.data);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    }
    checkAuthenticated();
  });

  return (
    <Card className="fixed bottom-0 left-0 right-0 z-50 mt-4">
      <CardDescription className="flex justify-between items-center h-full mx-2 text-gray-700 dark:text-[#A8B3CF]">
        <Link
          onClick={() => setActive("home")}
          href="/home"
          className={classNames(
            "flex flex-col flex-1 justify-center py-4 items-center",
            {
              "text-primary": active === "home",
              "border-t-2 border-primary text-primary": pathname === "/home",
            }
          )}
        >
          <div>
            <svg
              width="1em"
              height="1em"
              name="home"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              className="w-7 h-7 pointer-events-none"
            >
              <path
                d="M9.855 3.853l-5.886 5.13-.076.071a3.043 3.043 0 00-.843 1.605l-.04.279-.009.145L3 17.833a3.167 3.167 0 006.333 0v-2.5l.004-.069c.003-.03.076-.097.163-.097h5l.07.003c.029.003.097.076.097.163v2.5a3.167 3.167 0 106.333 0v-6.666c0-.114-.008-.228-.025-.34a2.996 2.996 0 00-.868-1.773l-.076-.07-5.887-5.131.065.062a3.124 3.124 0 00-4.274-.135l-.08.073zm3.293 1.123l5.898 5.139a1.544 1.544 0 01.454 1.052v6.666a1.667 1.667 0 01-3.333 0v-2.5c0-.878-.68-1.598-1.543-1.662l-.124-.004h-5c-.879 0-1.598.68-1.662 1.542l-.005.124v2.5a1.667 1.667 0 01-3.333 0v-6.666a1.544 1.544 0 01.454-1.052l5.898-5.14a1.624 1.624 0 012.296 0z"
                fill="currentColor"
                fill-rule="evenodd"
              ></path>
            </svg>
          </div>
          <p className="text-xs mt-0.5">Home</p>
        </Link>
        <Link
          href="/bookmark"
          onClick={() => setActive("bookmark")}
          className={classNames(
            "flex flex-col flex-1  justify-center py-4 items-center",
            {
              "text-primary": active === "bookmark",
              "border-t-2 border-primary": pathname === "/bookmark",
            }
          )}
        >
          <div>
            <svg
              name="bookmark"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              className="w-7 h-7 cursor-pointer fill-current peer-hover:text-primary"
            >
              <path
                d="M15.874 3H8.126a3.357 3.357 0 00-3.35 3.152l-.772 12.77c-.028.459.106.915.38 1.286l.101.125c.666.764 1.818.9 2.647.287L12 17.023l4.868 3.597a1.964 1.964 0 003.128-1.7l-.771-12.767A3.358 3.358 0 0015.874 3zm0 1.5c.981 0 1.794.764 1.854 1.744l.771 12.768a.464.464 0 01-.74.402l-5.207-3.848a.929.929 0 00-1.104 0L6.24 19.414a.464.464 0 01-.74-.402l.773-12.768c.06-.98.872-1.744 1.853-1.744h7.748z"
                fill="currentColor"
                fill-rule="evenodd"
              ></path>
            </svg>
          </div>
          <p className="text-xs mt-0.5">Bookmarks</p>
        </Link>
        <DrawerTest>
          <div className="p-3 mx-2 rounded-lg border flex-1 border-[#A8B3CF]">
            <Plus />
          </div>
        </DrawerTest>
        <Link
          href="/tests-created"
          onClick={() => setActive("tests-created")}
          className={classNames(
            "flex flex-col flex-1  h-full py-4 justify-center items-center",
            {
              "text-primary": active === "tests-created",
              "border-t-2 border-primary": pathname === "/tests-created",
            }
          )}
        >
          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-6 h-6"
            >
              <path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-8.4 8.4a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32l8.4-8.4Z" />
              <path d="M5.25 5.25a3 3 0 0 0-3 3v10.5a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3V13.5a.75.75 0 0 0-1.5 0v5.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5V8.25a1.5 1.5 0 0 1 1.5-1.5h5.25a.75.75 0 0 0 0-1.5H5.25Z" />
            </svg>
          </div>
          <p className="text-xs mt-1">My QPs</p>
        </Link>
        <Link
          href="/dashboard"
          onClick={() => setActive("dashboard")}
          className={classNames(
            "flex flex-col flex-1 py-4 justify-center items-center",
            {
              "text-primary": active === "dashboard",
              "border-t-2 border-primary text-primary":
                pathname === "/dashboard",
            }
          )}
        >
          <div>
            <LibraryBig />
          </div>
          <p className="text-xs mt-1">Records</p>
        </Link>
      </CardDescription>
    </Card>
  );
};

export default PhoneViewPannel;
