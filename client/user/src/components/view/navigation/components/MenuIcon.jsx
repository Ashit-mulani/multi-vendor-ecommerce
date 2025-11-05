import React from "react";
import { IconButton } from "@/components/ui/icon";
import { Heart, ShoppingCart } from "lucide-react";
import Link from "next/link";
import ProfileMenu from "./ProfileMenu";

const MenuIcon = () => {
  return (
    <div className="flex items-center gap-2">
      {[
        {
          icon: <Heart />,
          path: "/wish-list",
        },
        {
          icon: <ShoppingCart />,
          path: "/cart",
        },
      ].map((m) => (
        <Link key={m.path} href={m.path}>
          <IconButton className="rounded-full text-zinc-500 " variant="outline">
            {m.icon}
          </IconButton>
        </Link>
      ))}
      <ProfileMenu />
    </div>
  );
};

export default MenuIcon;
