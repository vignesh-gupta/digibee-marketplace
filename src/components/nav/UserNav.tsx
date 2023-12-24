import { User } from "@/payload-types";
import React from "react";
import UserAccountNav from "./UserAccountNav";
import Link from "next/link";
import { buttonVariants } from "../ui/button";
import { ClassNameValue } from "tailwind-merge";
import { cn } from "@/lib/utils";

type UserNavProps = {
  user: User | null;
  className?: ClassNameValue;
};

const UserNav = ({ user, className }: UserNavProps) => {
  return (
    <div className={cn(className)}>
      {user ? null : (
        <Link href="/sign-in" className={buttonVariants({ variant: "ghost" })}>
          Sign In
        </Link>
      )}
      {user ? null : (
        <span className="h-6 w-px bg-foreground/5" aria-hidden="true" />
      )}

      {user ? (
        <UserAccountNav user={user} />
      ) : (
        <Link href="/sign-up" className={buttonVariants({ variant: "ghost" })}>
          Create Account
        </Link>
      )}

      {user ? (
        <span className="h-6 w-px bg-foreground/5" aria-hidden="true" />
      ) : null}

      {user ? null : (
        <div className="flex lg:ml-6">
          <span className="h-6 w-px bg-foreground/5" aria-hidden="true" />
        </div>
      )}
    </div>
  );
};

export default UserNav;
