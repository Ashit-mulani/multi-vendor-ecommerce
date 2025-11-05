import React from "react";
import { LuLoaderCircle } from "react-icons/lu";

const Loader = ({ size, className = "" }) => {
  return <LuLoaderCircle size={size} className={`${className} animate-spin`} />;
};

export default Loader;
