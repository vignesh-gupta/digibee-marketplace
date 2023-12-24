import { getServerSideUser } from "@/lib/payload-utlis";
import { cookies } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import Cart from "../Cart";
import MaxWidthWrapper from "../MaxWidthWrapper";
import UserAccountNav from "./UserAccountNav";
import { buttonVariants } from "../ui/button";
import MobileNav from "./MobileNav";
import NavItems from "./NavItems";
import UserNav from "./UserNav";
import { ThemeSwitch } from "../ui/theme-switch";

const Navbar = async () => {
  const nextCookies = cookies();

  const { user } = await getServerSideUser(nextCookies);

  return (
    <div className="sticky border-b border-foreground/10 top-0 z-50 h-16 bg-background">
      <header className="relative w-full">
        <MaxWidthWrapper>
          <div className="">
            <div className="flex items-center h-16">
              <MobileNav user={user} />
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
                <UserNav
                  user={user}
                  className="hidden lg:flex lg:flex-1 lg:justify-end lg:space-x-6 lg:items-center"
                />
                <div className="ml-4 flow-root lg:ml-6">
                  <ThemeSwitch />
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
