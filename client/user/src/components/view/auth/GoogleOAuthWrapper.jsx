"use client";

import React from "react";
import { useGoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { FcGoogle } from "react-icons/fc";
import { toast } from "sonner";
import Loader from "@/components/ui/Loader";
import { useSingUpWithGoogle } from "@/hooks/api-hooks/auth-api-hooks";

const GoogleLoginBtn = () => {
  const router = useRouter();

  const mutation = useSingUpWithGoogle();

  const handleGoogleResponse = async (result) => {
    try {
      if (result.code) {
        await mutation.mutateAsync(result.code);
        router.push("/");
      }
    } catch (error) {
      toast.error("Google login failed");
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: handleGoogleResponse,
    onError: handleGoogleResponse,
    flow: "auth-code",
  });

  return (
    <Button
      disabled={mutation.isPending}
      variant="outline"
      onClick={() => googleLogin()}
      className="flex items-center gap-2"
    >
      {mutation.isPending && <Loader />}
      <FcGoogle size={20} />
      Google
    </Button>
  );
};

const GoogleOAuthWrapper = () => {
  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}>
      <GoogleLoginBtn />
    </GoogleOAuthProvider>
  );
};

export default GoogleOAuthWrapper;
