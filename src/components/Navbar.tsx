import { getServerSideUser } from "@/lib/payload-utlis";
import { cookies } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import Cart from "./Cart";
import MaxWidthWrapper from "./MaxWidthWrapper";
import NavItems from "./NavItems";
import UserAccountNav from "./UserAccountNav";
import { buttonVariants } from "./ui/button";
import MobileNav from "./MobileNav";

const Navbar = async () => {
  const nextCookies = cookies();

  const { user } = await getServerSideUser(nextCookies);

  return (
    <div className="sticky inset-x-0 top-0 z-50 h-16 bg-background">
      <header className="relative bg-white">
        <MaxWidthWrapper>
          <div className="border-b border-gray-200">
            <div className="flex items-center h-16">
              {/* Mobile Nav */}
              <MobileNav />
              <div className="ml-4 lg:ml-0">
                <Link href="/">
                  <div className="w-12 h-12 relative">
                    <Image src="/logo.png" fill alt="Digibee Logo" />
                  </div>
                </Link>
              </div>
              <div className="z-50 hidden lg:ml-8 lg:block lg:self-stretch">
                <NavItems />
              </div>

              <div className="ml-auto flex items-center">
                <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:space-x-6 lg:items-center">
                  {user ? null : (
                    <Link
                      href="/sign-in"
                      className={buttonVariants({ variant: "ghost" })}
                    >
                      Sign In
                    </Link>
                  )}
                  {user ? null : (
                    <span className="h-6 w-px bg-gray-200" aria-hidden="true" />
                  )}

                  {user ? (
                    <UserAccountNav user={user} />
                  ) : (
                    <Link
                      href="/sign-up"
                      className={buttonVariants({ variant: "ghost" })}
                    >
                      Create Account
                    </Link>
                  )}

                  {user ? (
                    <span className="h-6 w-px bg-gray-200" aria-hidden="true" />
                  ) : null}

                  {user ? null : (
                    <div className="flex lg:ml-6">
                      <span
                        className="h-6 w-px bg-gray-200"
                        aria-hidden="true"
                      />
                    </div>
                  )}
                </div>
                <div className="ml-4 flow-root lg:ml-6">
                  <Cart />
                </div>
              </div>
            </div>
          </div>
        </MaxWidthWrapper>
      </header>
    </div>
  );
};

export default Navbar;
