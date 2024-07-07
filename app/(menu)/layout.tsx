"use client";
import React, { useEffect } from "react";
import SideBar from "@/components/shared-components/SideBar";
import HomePageNav from "@/components/shared-components/HomePageNav";
import { Separator } from "@/components/ui/separator";
import DrawerTest from "@/components/shared-components/DrawerTest";
import ToolTip from "@/components/ToolTip";
import PhoneViewPannel from "../../components/Pannels/PhoneViewPannel";
import { useMediaQuery } from "react-responsive";
import { Plus } from "lucide-react";
import { useUserContext } from "@/context/UserContext";
import axios from "@/axiosConfig";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { user, setUser } = useUserContext();
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
  });

  const isPhoneView = useMediaQuery({ query: "(max-width: 767px)" });
  return (
    <div className="flex h-screen">
      {isPhoneView ? <PhoneViewPannel /> : <SideBar />}
      <div className="flex flex-col w-full h-screen">
        <HomePageNav />
        <Separator />
        <div className="flex-1 overflow-auto">{children}</div>
        {!isPhoneView && (
          <div className="absolute bottom-20 right-20">
            <ToolTip content="Start creating test" classNames="mb-2">
              <DrawerTest>
                <div className="bg-primary p-4 text-white rounded-full">
                  <Plus className="h-8 w-8" />
                </div>
              </DrawerTest>
            </ToolTip>
          </div>
        )}
      </div>
    </div>
  );
};

export default Layout;
