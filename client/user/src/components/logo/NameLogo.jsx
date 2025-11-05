import React from "react";
import { TbShoppingBagCheck } from "react-icons/tb";

const NameLogo = () => {
  return (
    <div className="flex items-center gap-2">
      <div className="p-0.5 rounded bg-amber-300 shadow-md">
        <TbShoppingBagCheck size={22} className="text-amber-800" />
      </div>
      <span className="font-bold text-sm">BuyCart</span>
    </div>
  );
};

export default NameLogo;
