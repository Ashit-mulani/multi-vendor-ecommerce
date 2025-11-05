import React from "react";
import { Route, Routes } from "react-router-dom";
import Auth from "@/auth/Auth";
import AppTopBar from "@/components/view/navigation/AppTopBar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AppSideBar from "@/components/view/navigation/AppSideBar";
import Profile from "@/view/profile/profile";
import Home from "@/view/home/Home";

const AppLayout = () => {
  return (
    <SidebarProvider>
      <div className="flex h-screen overflow-x-hidden w-full">
        <AppSideBar />
        <main className="flex flex-col flex-1 min-w-0">
          <div className="flex gap-1 items-center w-full sticky top-0 z-20 p-1.5 bg-[#FAFAFA] border-b">
            <SidebarTrigger className="size-9 cursor-pointer opacity-60 hover:opacity-100" />
            <div className="flex-1 z-50">
              <AppTopBar />
            </div>
          </div>
          <div className="md:p-4 p-2 ">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route
                path="/profile"
                element={
                  <Auth>
                    <Profile />
                  </Auth>
                }
              />
            </Routes>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default AppLayout;
