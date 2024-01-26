import VerifyEmail from "@/app/(auth)/_component/VerifyEmail";
import Image from "next/image";
import React from "react";

interface PageProps {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
}

const VerifyPage = ({ searchParams }: PageProps) => {
  const token = searchParams.token;
  const toEmail = searchParams.to;

  return (
    <>
      {token && typeof token === "string" ? (
        <div className="grid gap-6">
          <VerifyEmail token={token} />
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-full space-y-1">
          <div className="relative mb-4 w-60 h-60 text-muted-foreground">
            <Image src="/email-sent.png" fill alt="Email sent message" />
          </div>

          <h3 className="text-2xl font-semibold">Check your email</h3>

          {toEmail ? (
            <p className="text-center text-muted-foreground">
              We&apos;ve sent a verification email to{" "}
              <span className="font-semibold">{toEmail}</span>.
            </p>
          ) : (
            <p className="text-center text-muted-foreground">
              We&apos;ve sent a verification link to your email
            </p>
          )}
        </div>
      )}
    </>
  );
};

export default VerifyPage;
