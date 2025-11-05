import React from "react";
import { Button } from "@/components/ui/button";
import {
  getRedirectUrl,
  clearRedirectUrl,
} from "@/hooks/utils-hooks/getRedirectUrl";
import { MdOutlineKeyboardBackspace } from "react-icons/md";
import { useRouter } from "next/navigation";

const Back = ({ href, redirect = true }) => {
  const router = useRouter();

  const goBack = () => {
    const redirectUrl = getRedirectUrl();
    if (redirectUrl && redirectUrl?.startsWith("http") && redirect) {
      clearRedirectUrl();
      window.location.href = redirectUrl;
    } else if (href) {
      router.push(href);
    } else {
      router.back();
    }
  };

  return (
    <Button
      size="sm"
      variant="ghost"
      onClick={goBack}
      type="button"
      className="text-xs hover:bg-blue-500/10 text-blue-500 hover:text-blue-700 w-[max-content]"
    >
      <MdOutlineKeyboardBackspace />
      Back
    </Button>
  );
};

export default Back;
