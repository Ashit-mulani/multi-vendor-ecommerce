import React from "react";
import {
  Sidebar,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import NameLogo from "@/components/logo/NameLogo";
import { Link } from "react-router-dom";

const AppSideBar = () => {
  return (
    <Sidebar>
      <SidebarHeader>
        <Link className="w-[max-content]" to={"/"}>
          <NameLogo />
        </Link>
      </SidebarHeader>
    </Sidebar>
  );
};

export default AppSideBar;
