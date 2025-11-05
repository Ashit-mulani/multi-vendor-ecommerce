"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import NameLogo from "@/components/logo/NameLogo";
import CInput from "@/components/ui/CInput";
import GoogleOAuthWrapper from "@/components/view/auth/GoogleOAuthWrapper";
import { useSingUp } from "@/hooks/api-hooks/auth-api-hooks";
import { useForm } from "react-hook-form";
import Loader from "@/components/ui/Loader";
import { useRouter } from "next/navigation";
import Back from "@/components/view/auth/Back";

const page = () => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const { mutateAsync, isPending, error } = useSingUp();

  const onSubmit = async (data) => {
    await mutateAsync(data);
    router.push("/auth/verify-otp");
  };

  return (
    <div className="flex items-center justify-center mt-8">
      <div className="flex flex-col gap-6 max-w-[275px]">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <Back href={"/"} />
            <NameLogo />
            <div>
              <h1 className="text-lg font-medium">Sign Up</h1>
              <p className="text-xs font-medium text-zinc-500">
                Create your account using Gmail and password.
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-2.5">
            <CInput
              label="Name"
              type="text"
              id="name"
              placeholder="Enter name . . . "
              {...register("userName", { required: "Name is required" })}
              error={errors.userName?.message}
            />
            <CInput
              label="Email"
              type="email"
              id="email"
              placeholder="Gmail address . . . "
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@gmail\.com$/,
                  message: "Only Gmail addresses are allowed",
                },
              })}
              error={errors.email?.message}
            />
            <CInput
              label="Password"
              type="password"
              id="password"
              placeholder="Password . . . "
              {...register("password", {
                required: "password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
              error={errors.password?.message}
            />
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
            {isPending && <Loader />} Sign Up
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
          <span>Already have account ?</span>
          <Link href="/auth/login" className="text-blue-500 hover:underline">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default page;
