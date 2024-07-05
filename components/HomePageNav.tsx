"use client";
import React, { useState } from "react";
import { Input } from "./ui/input";
import { LogOut, Mail, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUserContext } from "@/context/UserContext";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useMediaQuery } from "react-responsive";

const HomePageNav = () => {
  const { theme, setTheme } = useTheme();
  const { user } = useUserContext();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isSearched, setIsSearched] = useState<boolean>(false);
  const router = useRouter();
  const isPhoneView = useMediaQuery({ query: "(max-width: 767px)" });
  function toggleTheme(): void {
    theme === "light" ? setTheme("dark") : setTheme("light");
  }

  const onSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSearched(true);
    const encodedQuery = encodeURI(searchQuery.trim());
    router.push(`/search?q=${encodedQuery}`);
  };

  return (
    <div className="w-full h-20 flex gap-2 items-center px-4 justify-between">
      <div className="w-[90%] flex justify-center">
        <div className="relative w-[95%] md:w-[55%] text-gray-700 dark:text-[#A8B3CF]">
          <form onSubmit={onSearch}>
            <Input
              type="search"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => {
                if (e.target.value === "" && isSearched) {
                  router.back();
                  setIsSearched(false);
                }
                setSearchQuery(e.target.value);
              }}
              className="pl-10 md:pl-14 border sm:h-full py-3 md:text-xl"
            />
          </form>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            className="w-6 h-6 md:w-8 md:h-8 absolute left-3 top-1/2 transform -translate-y-1/2 text-text-tertiary"
          >
            <path
              d="M10 3.347c1.138 0 2.213.266 3.163.739-.255.462-.74.764-1.283.787l-.87.036A5.636 5.636 0 0010 4.818c-3.038 0-5.5 2.415-5.5 5.394 0 2.906 2.344 5.276 5.279 5.39l.221.004.221-.004c2.935-.114 5.279-2.484 5.279-5.39l-.003-.13.082-.215c.2-.524.676-.893 1.234-.967l.058-.005a6.771 6.771 0 01-.803 4.742 2.849 2.849 0 012.076.657l.157.143 1.872 1.836a2.731 2.731 0 010 3.916 2.864 2.864 0 01-3.852.13l-.14-.13-1.872-1.836a2.732 2.732 0 01-.818-2.19 7.062 7.062 0 01-3.491.914c-3.866 0-7-3.073-7-6.865 0-3.791 3.134-6.865 7-6.865zm5.37 12.13a1.28 1.28 0 00-.097 1.73l.096.106 1.872 1.836c.241.236.552.362.868.378h.135l.135-.013c.269-.04.527-.162.733-.365a1.28 1.28 0 00.097-1.73l-.097-.106-1.871-1.835a1.342 1.342 0 00-1.872 0zm.05-12.056l.044 1.013a2.493 2.493 0 001.648 2.225l.97.355c.457.167.35.83-.138.85l-1.033.044a2.592 2.592 0 00-.304.03l-.05.01c-.08.014-.159.032-.236.054l-.147.046-.18.07-.168.08-.113.063-.141.09-.164.121-.032.026c-.323.27-.579.62-.734 1.026l-.361.95a.43.43 0 01-.373.285h-.078l-.077-.012a.429.429 0 01-.34-.407l-.044-1.014a2.493 2.493 0 00-1.648-2.224l-.97-.355c-.457-.167-.35-.83.138-.85l1.034-.044c.3-.013.588-.077.855-.185l.109-.048c.175-.08.34-.178.49-.294l.148-.122.12-.114.136-.152.045-.056.078-.104.055-.082-.03.046a2.47 2.47 0 00.262-.505l.362-.95c.17-.45.846-.345.867.134z"
              fill="currentColor"
              fillRule="evenodd"
            ></path>
          </svg>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="bg-secondary border-2 border-primary p-2 text-gray-700 dark:text-[#A8B3CF] rounded-md cursor-pointer">
          <svg
            xmlnsXlink="http://www.w3.org/1999/xlink"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            className="w-7 h-7 pointer-events-none"
            width="1"
            height="1"
          >
            <path
              d="M12 3a2.312 2.312 0 012.25 2.847 6.39 6.39 0 014.106 5.491l.015.264.004.21v2.226l.072.022c.803.28 1.405.988 1.53 1.852l.018.175.005.158c0 1.224-.95 2.226-2.154 2.307l-.159.006-2.046-.001-.013.033a3.94 3.94 0 01-3.216 2.384l-.21.016-.202.005a3.926 3.926 0 01-3.536-2.22l-.083-.183-.015-.035H6.313c-1.171 0-2.139-.87-2.292-1.998l-.016-.156L4 16.245c0-.903.52-1.693 1.325-2.076l.165-.071.135-.048v-2.238A6.377 6.377 0 019.75 5.846 2.312 2.312 0 0112 3zm0 3.938c-.437 0-.86.057-1.262.165l-.148.042a4.876 4.876 0 00-3.46 4.441l-.005.226v2.808c0 .414-.31.756-.71.806l-.197.012a.813.813 0 00-.007 1.613l.101.007h3.25l.005.143a2.438 2.438 0 002.272 2.289l.161.005.16-.005a2.438 2.438 0 002.272-2.265l.005-.168h3.25l.102-.006a.813.813 0 000-1.612l-.196-.012a.813.813 0 01-.712-.704l-.006-.103v-2.807l-.003-.183a4.878 4.878 0 00-3.461-4.485l-.143-.041A4.881 4.881 0 0012 6.937zM12 4.5a.812.812 0 10.788 1.013l.018-.099.007-.101A.812.812 0 0012 4.5z"
              fill="currentColor"
              fill-rule="evenodd"
            ></path>
          </svg>
        </div>
        <Button
          variant="outline"
          className="px-4 py-6"
          onClick={() => toggleTheme()}
        >
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger disabled={!isPhoneView && true} asChild>
            <Avatar className="cursor-pointer size-12 rounded-sm">
              <AvatarImage className="rounded-lg" src={user?.image} />
              <AvatarFallback>{user?.image}</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={async () => {
                  await signOut({ callbackUrl: "/login" });
            }}>
              <LogOut className="mr-2 h-4 w-4" />
              <span className="mr-2">Log out</span>
              <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default HomePageNav;
