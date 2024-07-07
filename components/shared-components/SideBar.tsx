"use client";
import React, { useEffect, useState } from "react";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import classNames from "classnames";
import {
  ArrowLeftFromLine,
  ArrowRightFromLine,
  LibraryBig,
  LogOut,
  PanelRightOpen,
} from "lucide-react";
import { PanelRightClose } from "lucide-react";
import { User } from "lucide-react";
import ToolTip from "../ToolTip";
import axios from "axios";
import { useUserContext } from "@/context/UserContext";
import { Origami } from "lucide-react";
import { signOut } from "next-auth/react";
import Link from "next/link";

const SideBar = () => {
  const [view, setView] = useState("desktop");

  const updateView = () => {
    const width = window.innerWidth;
    if (width < 768) {
      setView("phone");
    } else if (width >= 768 && width <= 1024) {
      expanded && setExpanded(false);
      setView("tablet");
    } else {
      setView("desktop");
    }
  };
  const [expanded, setExpanded] = useState(() => {
    let savedValue = "";
    if (typeof window !== "undefined" && localStorage) {
      savedValue = localStorage.getItem("sidebarExpanded")!;
    }
    return savedValue ? JSON.parse(savedValue) : true;
  });
  const { user, setUser } = useUserContext();
  const router = useRouter();
  const pathName: string = usePathname();
  const btnClass: string = `font-medium text-gray-700 dark:text-[#A8B3CF] text-lg flex items-center mx-2 mt-1 rounded-lg gap-2 py-4 px-3 cursor-pointer hover:rounded-lg ${
    !expanded && "flex items-center justify-center "
  }`;
  const [active, setActive] = useState("");
  useEffect(() => {
    if (localStorage)
      localStorage.setItem("sidebarExpanded", JSON.stringify(expanded));
  }, [expanded]);

  useEffect(() => {
    async function checkAuthenticated() {
      if (!user) {
        try {
          const response = await axios.get("/api/admin");
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
    updateView();
    window.addEventListener("resize", updateView);
    return () => window.removeEventListener("resize", updateView);
  }, [user]);

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/" });
  };

  const Home = () => {
    return (
      <Link
        href="/home"
        onClick={() => setActive("home")}
        className={classNames(btnClass, {
          "bg-primary text-white dark:text-white": pathName === "/home",
          "bg-accent": active === "home",
          "hover:bg-primary": pathName === "/home",
          "hover:bg-accent": pathName !== "/home",
        })}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-6 h-6"
        >
          <path d="M11.47 3.841a.75.75 0 0 1 1.06 0l8.69 8.69a.75.75 0 1 0 1.06-1.061l-8.689-8.69a2.25 2.25 0 0 0-3.182 0l-8.69 8.69a.75.75 0 1 0 1.061 1.06l8.69-8.689Z" />
          <path d="m12 5.432 8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 0 1-.75-.75v-4.5a.75.75 0 0 0-.75-.75h-3a.75.75 0 0 0-.75.75V21a.75.75 0 0 1-.75.75H5.625a1.875 1.875 0 0 1-1.875-1.875v-6.198a2.29 2.29 0 0 0 .091-.086L12 5.432Z" />
        </svg>
        {expanded && <span>Home</span>}
      </Link>
    );
  };

  const BookMark = () => {
    return (
      <Link
        href="/bookmark"
        onClick={() => setActive("bookmark")}
        className={classNames(btnClass, {
          "bg-primary text-white dark:text-white": pathName === "/bookmark",
          "bg-accent": active === "bookmark",
          "hover:bg-primary": pathName === "/bookmark",
          "hover:bg-accent": pathName !== "/bookmark",
        })}
      >
        <svg
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          className="w-7 h-7 pointer-events-none"
        >
          <path
            d="M16.444 3c1.178 0 2.152.917 2.224 2.092l.926 15.317a.557.557 0 01-.887.482l-6.247-4.616c-.394-.29-.931-.29-1.324 0L4.888 20.89a.557.557 0 01-.887-.482l.926-15.317A2.228 2.228 0 017.15 3h9.293z"
            fill="currentColor"
            fill-rule="evenodd"
          ></path>
        </svg>
        {expanded && <span>Bookmarks</span>}
      </Link>
    );
  };

  const TestsCreated = () => {
    return (
      <Link
        href="/tests-created"
        onClick={() => setActive("tests-created")}
        className={classNames(btnClass, {
          "bg-primary text-white dark:text-white":
            pathName === "/tests-created",
          "bg-accent": active === "tests-created",
          "hover:bg-primary": pathName === "/tests-created",
          "hover:bg-accent": pathName !== "/tests-created",
        })}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-6 h-6"
        >
          <path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-8.4 8.4a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32l8.4-8.4Z" />
          <path d="M5.25 5.25a3 3 0 0 0-3 3v10.5a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3V13.5a.75.75 0 0 0-1.5 0v5.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5V8.25a1.5 1.5 0 0 1 1.5-1.5h5.25a.75.75 0 0 0 0-1.5H5.25Z" />
        </svg>
        {expanded && <span>My QPs</span>}
      </Link>
    );
  };

  const Dashboard = () => {
    return (
      <Link
        href="/dashboard"
        className={classNames(btnClass, {
          "bg-primary text-white dark:text-white": pathName === "/dashboard",
          "bg-accent": active === "dashboard",
          "hover:bg-primary": pathName === "/dashboard",
          "hover:bg-accent": pathName !== "/dashboard",
        })}
      >
        <LibraryBig />
        {expanded && <span>Tests Records</span>}
      </Link>
    );
  };
  return (
    <div
      className={`border border-r-2 transition-all max-h-screen py-4 relative text-gray-700 dark:text-[#A8B3CF]    ${
        !expanded ? "xl:min-w-[50px]" : "xl:min-w-[370px]"
      }`}
    >
      <div className="flex flex-col gap-1">
        <div
          className={`flex ${
            expanded ? "justify-between" : "justify-center"
          } items-center px-5 relative py-2`}
        >
          <span>
            {expanded && (
              <div className="flex gap-2 items-center text-primary">
                <Origami className="w-6 h-6" />
                <div className="bg-gradient-to-r from-primary to-secondary-foreground text-transparent bg-clip-text relative">
                  <p className="font-bold text-xl animate-in animate-out">
                    Question Paper Hub
                  </p>
                </div>
              </div>
            )}
          </span>
          {view !== "tablet" && (
            <span
              className="p-3 rounded hover:bg-accent cursor-pointer"
              onClick={() => setExpanded(!expanded)}
            >
              {expanded ? (
                <ArrowLeftFromLine color="currentColor" size={"28px"} />
              ) : (
                <ArrowRightFromLine color="currentColor" size={"28px"} />
              )}
            </span>
          )}
          {view === "tablet" && <Origami className="w-6 h-6 text-primary" />}
        </div>
        <Separator color="white" />
        <div className="absolute bottom-0 left-0 right-0 flex flex-col justify-center items-left">
          <Separator color="white" />
          <div
            onClick={() => handleLogout()}
            className={`font-medium text-foreground dark:text-[#A8B3CF] items-center text-lg flex gap-3 py-4 px-3 hover:cursor-pointer hover:bg-secondary ${
              expanded ? "justify-start" : "justify-center"
            }`}
          >
            <p className={"flex gap-3 items-center text-destructive"}>
              <LogOut className={`w-6 h-6`} />
              {expanded && <span>Log out</span>}
            </p>
          </div>
          <Separator color="white" />
          {expanded ? (
            <div className="py-4 px-3 ">
              <p className="font-medium sm:text-md md:text-lg lg:text-xl truncate text-foreground dark:text-white">
                {user?.name ?? "Questionpaper Hub"}
              </p>
              <p className="py-2 text-gray-700 dark:text-gray-400 sm:text-sm md:text-base lg:text-lg truncate">
                {user?.email ?? "questionpaperhub@gmail.com"}
              </p>
            </div>
          ) : (
            <div
              className={`${
                !expanded && "flex justify-center items-center h-24"
              }`}
            >
              <User size={"24px"} />
            </div>
          )}
        </div>
        <ToolTip
          content="Home"
          classNames="absolute  left-12"
          expanded={expanded}
        >
          <Home />
        </ToolTip>
        <ToolTip
          content="Bookmarks"
          classNames="absolute  left-12"
          expanded={expanded}
        >
          <BookMark />
        </ToolTip>
        <ToolTip
          content="My QPs"
          classNames="absolute  left-12"
          expanded={expanded}
        >
          <TestsCreated />
        </ToolTip>
        <ToolTip
          content="Tests Records"
          classNames="absolute  left-12"
          expanded={expanded}
        >
          <Dashboard />
        </ToolTip>
      </div>
    </div>
  );
};

export default SideBar;
