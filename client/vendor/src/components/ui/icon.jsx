import React from "react";
import { Button } from "./button";
import { cn } from "@/lib/utils";

function IconButton({ className, variant, asChild, children, ...props }) {
  return (
    <Button
      type="button"
      size="icon"
      variant={variant}
      asChild={asChild}
      className={cn("p-0 flex items-center justify-center", className)}
      {...props}
    >
      {children}
    </Button>
  );
}

function IconButtons({ icons = [], className, ...props }) {
  return (
    <div className={cn("flex gap-2", className)} {...props}>
      {icons.map(({ icon: Icon, key, ...btnProps }) => (
        <IconButton
          key={key || Icon?.displayName || Math.random()}
          {...btnProps}
        >
          {Icon && <Icon />}
        </IconButton>
      ))}
    </div>
  );
}

export { IconButton, IconButtons };
