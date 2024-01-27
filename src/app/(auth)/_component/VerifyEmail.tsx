"use client";

import { trpc } from "@/trpc/client";
import Image from "next/image";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import ErrorAndLoading from "./ErrorAndLoading";

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
          <Image src="/email-sent.png" fill alt="the email was sent" />
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

  <ErrorAndLoading isLoading={isLoading} isError={isError} />;
};

export default VerifyEmail;
