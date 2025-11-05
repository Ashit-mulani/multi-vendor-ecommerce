import useUserApi from "@/api/user-api";
import React from "react";
import { useSelector } from "react-redux";
import CLoader from "./CLoader";
import { Button } from "./button";

const SingupBtn = () => {
  const { appLoading } = useSelector((state) => state.user);

  const { singup } = useUserApi();
  return (
    <div
      aria-disabled={appLoading}
      tabIndex={appLoading ? -1 : 0}
      style={appLoading ? { pointerEvents: "none", opacity: 0.6 } : {}}
    >
      <Button
        onClick={() => singup()}
        disabled={appLoading}
        className="bg-teal-700 hover:bg-teal-600 rounded-full"
      >
        {appLoading && <CLoader />} Sign up
      </Button>
    </div>
  );
};

export default SingupBtn;
