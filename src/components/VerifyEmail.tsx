"use client";

import { trpc } from "@/trpc/client";
import { Loader2, XCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { buttonVariants } from "./ui/button";

interface VerifyEmailProps {
  token: string;
}

const VerifyEmail = ({ token }: VerifyEmailProps) => {
  const { data, isLoading, isError } = trpc.auth.verifyEmail.useQuery({
    token,
  });

  if (data?.success) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <div className="relative mb-4 h-60 w-60 text-muted-foreground">
          <Image src="/hippo-email-sent.png" fill alt="the email was sent" />
        </div>

        <h3 className="text-2xl font-semibold">You&apos;re all set!</h3>
        <p className="mt-1 text-center text-muted-foreground">
          Thank you for verifying your email.
        </p>
        <Link className={buttonVariants({ variant: "link" })} href="/sign-in">
          Sign in
        </Link>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center gap-2">
        <Loader2 className="w-8 h-8 animate-spin text-zinc-300" />
        <h3 className="text-xl font-semibold">Verifying...</h3>
        <p className="text-sm text-muted-foreground">
          This won&apos;t take long.
        </p>
      </div>
    );
  }

  // Error State of the Component
  if (isError)
    return (
      <div className="flex flex-col items-center gap-2">
        <XCircle className="w-8 h-8 text-red-600" />
        <h3 className="text-xl font-semibold">There was a problem</h3>
        <p className="text-sm text-muted-foreground">
          This token is not valid or might be expired. Please try again.
        </p>
      </div>
    );
};

export default VerifyEmail;
