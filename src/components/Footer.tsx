"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import MaxWidthWrapper from "./MaxWidthWrapper";

const Footer = () => {
  const pathname = usePathname();
  const pathsToMinimize = ["/verify-email", "/sign-up", "/sign-in" , "/forgot-password"];

  return (
    <footer className="flex-grow-0 mt-5 ">
      <MaxWidthWrapper>
        <div className="border-t border-foreground/15">
          {pathsToMinimize.includes(pathname) ? null : (
            <div className="py-3">
              <div className="flex justify-center">
                <Link href="/">
                  <div className="relative w-16 h-16">
                    <Image src="/logo.png" fill alt="Digibee Logo" />
                  </div>
                </Link>
              </div>
            </div>
          )}

          {pathsToMinimize.includes(pathname) ? null : (
            <div>
              <div className="relative flex items-center px-6 py-6 sm:py-8 lg:mt-0">
                <div className="absolute inset-0 overflow-hidden rounded-lg">
                  <div
                    aria-hidden="true"
                    className="absolute bg-foreground/5 inset-0 bg-gradient-to-br bg-opacity-90"
                  />
                </div>

                <div className="text-center relative mx-auto max-w-sm">
                  <h3 className="font-semibold text-foreground/90">
                    Become a seller
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    If you&apos;d like to sell high-quality digital products,
                    you can do so in minutes.{" "}
                    <Link
                      href="/sign-in?as=seller"
                      className="whitespace-nowrap font-medium text-foreground hover:text-foreground/80"
                    >
                      Get started &rarr;
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="py-5 md:flex md:items-center md:justify-between">
          <div className="text-center md:text-left">
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} All Rights Reserved
            </p>
          </div>

          <div className="mt-4 flex items-center justify-center md:mt-0">
            <div className="flex space-x-8">
              <Link
                href="#"
                className="text-sm text-muted-foreground hover:text-foreground/80"
              >
                Terms
              </Link>
              <Link
                href="#"
                className="text-sm text-muted-foreground hover:text-foreground/80"
              >
                Privacy Policy
              </Link>
              <Link
                href="#"
                className="text-sm text-muted-foreground hover:text-foreground/80"
              >
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </MaxWidthWrapper>
    </footer>
  );
};

export default Footer;
