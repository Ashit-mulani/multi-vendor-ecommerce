import useUserApi from "@/api/user-api";
import DropMenu from "@/components/ui/DropMenu";
import { IconButton } from "@/components/ui/icon";
import SingupBtn from "@/components/ui/singup";
import { useCraeteStore } from "@/hooks/api-hook/store-api-hook";
import { LogOut, UserRound, UserRoundCog } from "lucide-react";
import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const AppTopBar = () => {
  const navigate = useNavigate();

  const { user, appLoading } = useSelector((state) => state.user);

  const { getMe, logout, singup } = useUserApi();

  const createStoreMutation = useCraeteStore();

  return (
    <div className="flex items-center justify-between bg-zinc-50 w-full">
      <div className="flex items-center justify-between gap-2 w-full">
        <i></i>
        {user ? (
          <DropMenu
            triggerContent={
              <IconButton
                className="rounded-full text-zinc-500"
                variant="outline"
              >
                <UserRound />
              </IconButton>
            }
            contentData={[
              {
                name: user?.userName || "Account",
                icon: <UserRoundCog className="text-blue-600" />,
                onClick: () => {
                  navigate("/profile");
                },
              },
              {
                name: "create store (test)",
                icon: <UserRoundCog className="text-blue-600" />,
                onClick: () => {
                  createStoreMutation.mutate({ name: "good-store" });
                },
              },
              {
                name: "Sign Out",
                icon: <LogOut className="text-red-600" />,
                onClick: () => {
                  logout();
                },
                separator: true,
              },
            ]}
          />
        ) : (
          <SingupBtn />
        )}
      </div>
    </div>
  );
};

export default AppTopBar;
