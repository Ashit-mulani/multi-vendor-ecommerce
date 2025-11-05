import React from "react";
import { TbShoppingBagCheck } from "react-icons/tb";

const NameLogo = () => {
  return (
    <div className="flex items-center gap-2 w-[max-content]">
      <div className="p-0.5 rounded bg-amber-300 shadow-md">
        <TbShoppingBagCheck size={22} className="text-amber-800" />
      </div>
      <div className="flex flex-col justify-end items-end">
        <span className="font-bold text-sm">BuyCart</span>
        <span className="font-bold text-[10px] -mt-1 text-teal-700 italic">
          vendor
        </span>
      </div>
    </div>
  );
};

export default NameLogo;
