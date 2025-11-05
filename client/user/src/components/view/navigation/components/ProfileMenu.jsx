"use client";

import { Button } from "@/components/ui/button";
import DropMenu from "@/components/ui/DropMenu";
import { IconButton } from "@/components/ui/icon";
import Loader from "@/components/ui/Loader";
import { useLogout } from "@/hooks/api-hooks/auth-api-hooks";
import { useInit } from "@/provider/init-provider";
import { LogOut, UserRound, UserRoundCog } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import {
  MdOutlineLocalShipping,
  MdOutlineLocationOn,
  MdOutlineSell,
} from "react-icons/md";
import { useSelector } from "react-redux";

const ProfileMenu = () => {
  const router = useRouter();

  const { user } = useSelector((state) => state.user);

  const { isLoading } = useInit();

  const { mutateAsync: logout } = useLogout();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error(err);
    }
  };

  return user && user?._id ? (
    <DropMenu
      triggerContent={
        <IconButton className="rounded-full text-zinc-500" variant="outline">
          <UserRound />
        </IconButton>
      }
      lable={<span className="text-xs text-zinc-500">My Account</span>}
      contentData={[
        {
          name: user?.userName || "Account",
          icon: <UserRoundCog className="text-blue-600" />,
          onClick: () => {
            router.push("/profile");
          },
        },
        {
          name: "Your orders",
          icon: <MdOutlineLocalShipping className="text-green-500" />,
          onClick: () => {},
        },
        {
          name: "Your Addresses",
          icon: <MdOutlineLocationOn className="text-purple-500" />,
          onClick: () => {},
        },
        {
          name: "Seller Account",
          icon: <MdOutlineSell className="text-amber-600" />,
          onClick: () => {
            window.open(
              `${process.env.NEXT_PUBLIC_VENDOR_URL}?ref=${process.env.NEXT_PUBLIC_CLIENT_URL}`,
              "_blank",
              "noopener,noreferrer"
            );
          },
        },
        {
          name: "Sign Out",
          icon: <LogOut className="text-red-600" />,
          onClick: () => {
            handleLogout();
          },
          separator: true,
        },
      ]}
    />
  ) : (
    <div
      aria-disabled={isLoading}
      tabIndex={isLoading ? -1 : 0}
      style={isLoading ? { pointerEvents: "none", opacity: 0.6 } : {}}
    >
      <Link href="/auth/signup">
        <Button
          disabled={isLoading}
          className="bg-teal-700 hover:bg-teal-600 rounded-full"
        >
          {isLoading && <Loader />} Sign up
        </Button>
      </Link>
    </div>
  );
};

export default ProfileMenu;
