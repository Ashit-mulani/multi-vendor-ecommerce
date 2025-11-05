"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import NameLogo from "@/components/logo/NameLogo";
import CInput from "@/components/ui/CInput";
import GoogleOAuthWrapper from "@/components/view/auth/GoogleOAuthWrapper";
import { useLogin } from "@/hooks/api-hooks/auth-api-hooks";
import { useForm } from "react-hook-form";
import Loader from "@/components/ui/Loader";
import { useRouter } from "next/navigation";
import Back from "@/components/view/auth/Back";
import { useStoreRedirect } from "@/hooks/utils-hooks/getRedirectUrl";

const page = () => {
  useStoreRedirect();

  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const { mutateAsync, isPending, error } = useLogin();

  const onSubmit = async (data) => {
    const res = await mutateAsync(data);
    if (res?.data?.isVerified) return router.push("/");
    router.push("/auth/verify-otp");
  };

  return (
    <div className="flex items-center justify-center mt-8">
      <div className="flex flex-col gap-6 max-w-[275px]">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <Back href="/" />
            <NameLogo />
            <div>
              <h1 className="text-lg font-medium">Sign In</h1>
              <p className="text-xs font-medium text-zinc-500">
                Sign in using your registered Gmail and password.
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-2.5">
            <CInput
              label="Email"
              type="email"
              id="email"
              placeholder="Email . . . "
              {...register("email", { required: "Email is required" })}
              error={errors?.email?.message}
            />
            <div className="flex flex-col gap-2">
              <CInput
                label="Password"
                type="password"
                id="password"
                placeholder="Password . . . "
                {...register("password", {
                  required: "password is required",
                })}
                error={errors?.password?.message}
              />
              <Link
                href={"/auth/reset-password-otp"}
                className="text-xs font-medium text-zinc-500 hover:underline ml-1 justify-end flex hover:text-blue-500"
              >
                Forgot password ?
              </Link>
            </div>
          </div>
          {error && (
            <span className="text-xs font-medium text-red-500">
              {error.message || "somthing went wrong"}
            </span>
          )}
          <Button
            disabled={isPending}
            className="bg-teal-700 hover:bg-teal-600 text-white"
          >
            {isPending && <Loader />} Login
          </Button>
        </form>
        <div className="flex items-center justify-center gap-1 ">
          <span className="border-t  flex-1"></span>
          <span className="text-xs font-medium shrink-0 text-zinc-500/50 -mt-1">
            or continue with
          </span>
          <span className="border-t flex-1"></span>
        </div>
        <GoogleOAuthWrapper />
        <div className="flex items-center gap-1 w-full justify-end text-xs font-medium text-zinc-500">
          <span>Create new account !</span>
          <Link href={"/auth/signup"} className="text-blue-500 hover:underline">
            Signup
          </Link>
        </div>
      </div>
    </div>
  );
};

export default page;
