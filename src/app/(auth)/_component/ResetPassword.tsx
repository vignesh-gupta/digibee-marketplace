"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import {
  AuthPasswordValidator,
  TAuthPasswordValidator,
} from "@/lib/validators/account-credentials-validator";
import { trpc } from "@/trpc/client";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import ErrorAndLoading from "./ErrorAndLoading";

interface ResetPasswordProps {
  token: string;
}

const ResetPassword = ({ token }: ResetPasswordProps) => {
  const [isReset, setIsReset] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TAuthPasswordValidator>({
    resolver: zodResolver(AuthPasswordValidator),
  });

  const {
    mutate: updatePassword,
    isLoading,
    isError,
  } = trpc.auth.resetPassword.useMutation({
    onSuccess: ({ success }) => {
      if (success) {
        setIsReset(true);
        toast.success("Password updated successfully");
      } else {
        toast.error("Something went wrong");
      }
    },
    onError: (error) => {
      console.error("[ERROR]",error);
      toast.error(error.message);
    },
  });

  const onSubmit = ({ password }: TAuthPasswordValidator) => {
    updatePassword({ password, token });
  };

  <ErrorAndLoading isLoading={isLoading} isError={isError} />;

  if (isReset) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <div className="relative mb-4 h-60 w-60 text-muted-foreground">
          <Image src="/email-sent.png" fill alt="the email was sent" />
        </div>

        <h3 className="text-2xl font-semibold">You&apos;re all set!</h3>
        <p className="mt-1 text-center text-muted-foreground">
          Your password has been updated!
        </p>
        <Link className={buttonVariants({ variant: "link" })} href="/sign-in">
          Sign in
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col items-center space-y-2 text-center grow">
        <div className="relative w-24 h-24">
          <Image src="/logo.png" fill alt="Digibee Logo" />
        </div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Update your password
        </h1>
      </div>

      <div className="grid gap-6">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-2">
            <div className="grid gap-1 py-2">
              <Label htmlFor="password">New Password</Label>
              <Input
                {...register("password")}
                className={cn({
                  "focus-visible:ring-red-500": errors.password,
                })}
                placeholder="*****"
                type="password"
              />
              {errors?.password && (
                <p className="text-sm text-red-500">
                  {errors?.password?.message}
                </p>
              )}
            </div>

            <Button>Submit</Button>
          </div>
        </form>
      </div>
    </>
  );
};

export default ResetPassword;
