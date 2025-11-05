"use client";

import React from "react";
import CInput from "@/components/ui/CInput";
import { Button } from "@/components/ui/button";
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import NameLogo from "@/components/logo/NameLogo";
import { useVerifyOtp } from "@/hooks/api-hooks/auth-api-hooks";
import Loader from "@/components/ui/Loader";
import Back from "@/components/view/auth/Back";
import { useRouter } from "next/navigation";

const page = () => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const { user } = useSelector((state) => state.user);

  const { mutateAsync, error, isPending } = useVerifyOtp();

  const submit = async (data) => {
    await mutateAsync({ email: user?.email, ...data });
    router.push("/");
  };

  return (
    <div className="flex items-center justify-center mt-8">
      <div className="flex flex-col gap-6 max-w-[275px]">
        <form onSubmit={handleSubmit(submit)} className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <Back href={"/auth/signup"} redirect={false} />
            <NameLogo />
            <div>
              {user?.email ? (
                <>
                  <h1 className="text-lg font-medium">Email Verification</h1>
                  <p className="text-xs font-medium text-zinc-500">
                    Please enter the verification code sent to your Gmail{" "}
                    {user?.email}
                  </p>
                </>
              ) : (
                <p className="text-xs font-medium text-zinc-500">
                  <span className="text-red-500">Email not Found</span>, Go back
                  and try again to verify email.
                </p>
              )}
            </div>
          </div>
          <CInput
            label="OTP"
            type="number"
            id="otp"
            placeholder="Enter Otp . . . "
            {...register("otp", { required: "otp is required" })}
            error={errors?.otp?.message}
          />
          {error && (
            <span className="text-xs font-medium text-red-500">
              {error.message || "somthing went wrong"}
            </span>
          )}
          <Button
            disabled={isPending || !user?.email}
            className="bg-teal-800 hover:bg-teal-900 text-white"
          >
            {isPending ? <Loader /> : "Verify"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default page;
