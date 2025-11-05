"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import NameLogo from "@/components/logo/NameLogo";
import CInput from "@/components/ui/CInput";
import { useSetNewPasssword } from "@/hooks/api-hooks/auth-api-hooks";
import { useForm } from "react-hook-form";
import Loader from "@/components/ui/Loader";
import { useRouter } from "next/navigation";
import Back from "@/components/view/auth/Back";
import { useSelector } from "react-redux";

const page = () => {
  const router = useRouter();

  const { user } = useSelector((state) => state.user);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const { mutateAsync, isPending, error } = useSetNewPasssword();

  const onSubmit = async (data) => {
    const res = await mutateAsync({ email: user?.email, ...data });
    if (res?.Success) return router.push("/auth/login");
  };

  return (
    <div className="flex items-center justify-center mt-8">
      <div className="flex flex-col gap-6 max-w-[275px]">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <Back href="/auth/reset-password-otp" redirect={false} />
            <NameLogo />
            <div>
              {user?.email ? (
                <>
                  <h1 className="text-lg font-medium">Reset Your Password</h1>
                  <p className="text-xs font-medium text-zinc-500">
                    Enter the OTP sent to your email {user?.email} and set a new
                    password.
                  </p>
                </>
              ) : (
                <p className="text-xs font-medium text-zinc-500">
                  <span className="text-red-500">Email not found</span>, Go back
                  and try again to reset password.
                </p>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-2.5">
            <CInput
              label="OTP"
              type="number"
              id="otp"
              placeholder="OTP . . . "
              {...register("otp", { required: "otp is required" })}
              error={errors?.otp?.message}
            />
            <CInput
              label="New Password"
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
              error={errors?.password?.message}
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
            {isPending && <Loader />} Reset
          </Button>
        </form>
      </div>
    </div>
  );
};

export default page;
