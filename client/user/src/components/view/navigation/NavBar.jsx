import React from "react";
import Link from "next/link";
import NameLogo from "@/components/logo/NameLogo";
import MenuIcon from "./components/MenuIcon";

const NavBar = () => {
  return (
    <div className="flex items-center justify-between bg-zinc-50 border-b-2 border-zinc-500/5 p-2 px-4">
      <div className="flex items-center justify-center gap-2">
        <Link href="/">
          <NameLogo />
        </Link>
      </div>
      <MenuIcon />
    </div>
  );
};

export default NavBar;
