"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import {
  AuthEmailValidator,
  TAuthEmailValidator,
} from "@/lib/validators/account-credentials-validator";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

const ForgotPasswordPage = () => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TAuthEmailValidator>({
    resolver: zodResolver(AuthEmailValidator),
  });

  const onSubmit = async ({ email }: TAuthEmailValidator) => {
    await fetch("/api/users/forgot-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });
    router.push("/reset-password?to=" + email);
  };

  return (
    <>
      <div className="flex flex-col items-center space-y-2 text-center grow">
        <div className="relative w-24 h-24">
          <Image src="/logo.png" fill alt="Digibee Logo" />
        </div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Reset your account password
        </h1>

        <Link
          className={buttonVariants({
            variant: "link",
            className: "gap-1.5",
          })}
          href="/sign-in"
        >
          Remember your password?
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid gap-6">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-2">
            <div className="grid gap-1 py-2">
              <Label htmlFor="email">Email</Label>
              <Input
                {...register("email")}
                className={cn({
                  "focus-visible:ring-red-500": errors.email,
                })}
                placeholder="you@example.com"
              />
              {errors?.email && (
                <p className="text-sm text-red-500">{errors?.email?.message}</p>
              )}
            </div>

            <Button>Submit</Button>
          </div>
        </form>
      </div>
    </>
  );
};

export default ForgotPasswordPage;
