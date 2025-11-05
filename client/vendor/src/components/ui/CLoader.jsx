import React from "react";
import { LuLoaderCircle } from "react-icons/lu";

const CLoader = ({ size, className = "" }) => {
  return <LuLoaderCircle size={size} className={`${className} animate-spin`} />;
};

export default CLoader;
