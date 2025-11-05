import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import { HiDotsVertical } from "react-icons/hi";
import { Button } from "./button";

const DropMenu = ({
  triggerContent = (
    <div className="w-full px-3.5">
      <Button variant="outline" size="icon">
        <HiDotsVertical />
      </Button>
    </div>
  ),
  contentData = [],
  lable,
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{triggerContent}</DropdownMenuTrigger>
      <DropdownMenuContent className="dark:bg-[#212121] mx-1">
        {lable && (
          <>
            <DropdownMenuLabel>{lable}</DropdownMenuLabel>
            <DropdownMenuSeparator />
          </>
        )}
        {contentData.map((m) => (
          <div key={m?.name}>
            {m.lable && (
              <DropdownMenuLabel className="text-[11px] font-medium text-zinc-500">
                {m.lable}
              </DropdownMenuLabel>
            )}
            {m?.separator && <DropdownMenuSeparator />}
            <DropdownMenuItem
              className={`cursor-pointer gap-12 text-[13px] font-medium dark:font-normal text-zinc-700 dark:text-zinc-300`}
              onClick={m?.onClick}
            >
              <div className="flex items-center gap-2">
                {m?.icon}
                {m?.name}
              </div>
              <DropdownMenuShortcut>{m?.endIcon}</DropdownMenuShortcut>
            </DropdownMenuItem>
          </div>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default DropMenu;
