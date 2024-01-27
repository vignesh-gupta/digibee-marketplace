"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCart } from "@/hooks/use-cart";
import { cn } from "@/lib/utils";
import {
  AuthCredentialValidator,
  TAuthCredentialValidator,
} from "@/lib/validators/account-credentials-validator";
import { trpc } from "@/trpc/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const SignInPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const { loadItems } = useCart();

  const isSeller = searchParams.get("as") === "seller";
  const origin = searchParams.get("origin");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TAuthCredentialValidator>({
    resolver: zodResolver(AuthCredentialValidator),
  });

  const { mutate: getCart } = trpc.cart.getCart.useMutation({
    onSuccess: ({ cart: { products } }) => {
      // @ts-ignore TODO: Not sure what is the issue but it works
      loadItems(typeof products === "string" ? null : products);
    },
  });

  const { mutate: signIn, isLoading } = trpc.auth.signIn.useMutation({
    onSuccess: () => {
      getCart();

      if (origin) {
        router.push(decodeURIComponent(origin));
        return;
      }
      if (isSeller) {
        router.push(`/sell`);
        return;
      }
      router.push("/");

      router.refresh();
      toast.success("Signed in successfully");
    },

    onError: (error) => {
      if (error.data?.code === "UNAUTHORIZED") {
        toast.error("Invalid email or password");
        return;
      }
    },
  });

  const onSubmit = ({ email, password }: TAuthCredentialValidator) => {
    signIn({ email, password });
    // setTimeout(() => getCart(), 1000);
  };

  const continueAsRole = (isSeller: boolean = false) => {
    if (isSeller) {
      router.push("?as=seller");
    } else {
      router.replace("/sign-in", undefined);
    }
  };

  return (
    <>
      <div className="flex flex-col items-center space-y-2 text-center">
        <div className="relative w-24 h-24">
          <Image src="/logo.png" fill alt="Digibee Logo" />
        </div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Sign in to your {isSeller ? "seller" : ""} account
        </h1>

        <Link
          className={buttonVariants({
            variant: "link",
            className: "gap-1.5",
          })}
          href="/sign-up"
        >
          Don&apos;t have an account?
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

            <div className="grid gap-1 py-2">
              <Label htmlFor="password">Password</Label>
              <Input
                {...register("password")}
                type="password"
                className={cn({
                  "focus-visible:ring-red-500": errors.password,
                })}
                placeholder="Password"
              />
              {errors?.password && (
                <p className="text-sm text-red-500">
                  {errors?.password?.message}
                </p>
              )}
              <Link
                className="text-primary text-sm hover:underline underline-offset-4"
                href="/forgot-password"
              >
                forgot password?
              </Link>
            </div>

            <Button>Sign in</Button>
          </div>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span aria-hidden="true" className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="px-2 bg-background text-muted-foreground">or</span>
          </div>
        </div>

        {!isSeller ? (
          <Button
            variant="secondary"
            disabled={isLoading}
            onClick={() => continueAsRole(true)}
          >
            Continue as Seller
          </Button>
        ) : (
          <Button
            variant="secondary"
            disabled={isLoading}
            onClick={() => continueAsRole()}
          >
            Continue as Customer
          </Button>
        )}
      </div>
    </>
  );
};

export default SignInPage;
