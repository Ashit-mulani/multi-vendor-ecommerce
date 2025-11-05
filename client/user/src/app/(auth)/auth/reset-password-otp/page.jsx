"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import NameLogo from "@/components/logo/NameLogo";
import CInput from "@/components/ui/CInput";
import { useResetPassOtp } from "@/hooks/api-hooks/auth-api-hooks";
import { useForm } from "react-hook-form";
import Loader from "@/components/ui/Loader";
import { useRouter } from "next/navigation";
import Back from "@/components/view/auth/Back";
import { toast } from "sonner";

const page = () => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const { mutateAsync, isPending, error } = useResetPassOtp();

  const onSubmit = async (data) => {
    const res = await mutateAsync(data);
    console.log(res);
    if (res) {
      router.push("/auth/set-new-password");
      toast.success("Password reset successfully");
    }
  };

  return (
    <div className="flex items-center justify-center mt-8">
      <div className="flex flex-col gap-6 max-w-[275px]">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <Back href="/auth/login" redirect={false} />
            <NameLogo />
            <div>
              <h1 className="text-lg font-medium">Reset Password</h1>
              <p className="text-xs font-medium text-zinc-500">
                Please enter your email address to receive a password reset OTP.
              </p>
            </div>
          </div>
          <CInput
            label="Email"
            type="email"
            id="otp"
            placeholder="Email . . . "
            {...register("email", { required: "Eamil is required" })}
            error={errors?.email?.message}
          />
          {error && (
            <span className="text-xs font-medium text-red-500 ml-1">
              {error.message || "Somthing went wrong !"}
            </span>
          )}
          <Button
            disabled={isPending}
            className="bg-teal-800 hover:bg-teal-900 text-white"
          >
            {isPending ? <Loader /> : "Get OTP"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default page;
