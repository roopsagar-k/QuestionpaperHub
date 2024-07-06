"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "./ui/button";
import { Loader2, Moon, Origami, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { useMediaQuery } from "react-responsive";

const LandingNav = ({ children }: { children?: React.ReactNode }) => {
  const { theme, setTheme } = useTheme();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();
  function toggleTheme(): void {
    theme === "light" ? setTheme("dark") : setTheme("light");
  }

  const handleLogin = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    setIsLoading(true);
    const response = await fetch("/api/admin");
    console.log(response);
    if (response.status === 401) {
      router.push("/login");
      setIsLoading(false);
    } else {
      router.push("/home");
      setIsLoading(false);
    }
  };

  const isPhoneView = useMediaQuery({ query: "(max-width: 767px)" });

  return (
    <main>
      <div className="fixed top-0 left-0 right-0 w-full grid grid-cols-2 px-2 py-4 bg-transparent backdrop-blur-sm sm:text-sm md:text-base lg:text-lg xl:text-xl z-[1000]">
        <div className="logo flex gap-2 items-center text-primary">
          <Origami className="size-8 md:size-6 lg:size-8" />
          <p className="hidden sm:block font-semibold">Question Paper Hub</p>
        </div>
        {/* <div className="flex gap-4 items-center font-medium justify-center text-black dark:text-[#A8B3CF]">
          <Link href={"/"} className="ladingNavLink">
            Pricing
          </Link>
          <Link href={"/"} className="ladingNavLink">
            About
          </Link>
          <Link href={"/"} className="ladingNavLink">
            Documetion
          </Link>
          <Link href={"/"} className="ladingNavLink">
            Features
          </Link>
        </div> */}
        <div className="flex items-center gap-4 justify-end">
          <Button
            onClick={(e) => handleLogin(e)}
            className="bg-primary px-3 py-2 flex gap-2"
          >
            {isLoading ? (
              <div className="flex gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Login
              </div>
            ) : (
              <div>Login</div>
            )}
          </Button>
          <Button
            variant="outline"
            className="px-4 py-6"
            onClick={() => toggleTheme()}
          >
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </div>
      </div>
    </main>
  );
};

export default LandingNav;
