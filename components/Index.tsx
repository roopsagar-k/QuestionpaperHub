"use client";
import React from "react";
import SideBar from "@/components/SideBar";
import HomePageNav from "@/components/HomePageNav";
import { Separator } from "@/components/ui/separator";
import DrawerTest from "@/components/DrawerTest";
import ToolTip from "./ToolTip";

const Index = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex h-screen">
      <SideBar />
      <div className="flex flex-col w-full h-screen">
        <HomePageNav />
        <Separator />
        <div className="flex-1 overflow-auto">{children}</div>
        <div className="absolute bottom-20 right-20">
          <ToolTip content="Start creating test" classNames="mb-2">
            <DrawerTest />
          </ToolTip>  
        </div>  
      </div>
    </div>
  );
};

export default Index;
