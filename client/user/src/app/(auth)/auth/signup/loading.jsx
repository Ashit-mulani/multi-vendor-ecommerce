import Loader from "@/components/ui/Loader";
import React from "react";

const loading = () => {
  return (
    <div className="h-screen w-screen flex items-center justify-center">
      <Loader />
    </div>
  );
};

export default loading;
