"use client";

import { Button } from "@/components/ui/button";
import { PRODUCT_CATEGORIES } from "@/lib/config";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

type NavItemProps = {
  category: (typeof PRODUCT_CATEGORIES)[number];
  handleOpen: () => void;
  isOpen: boolean;
  isAnyOpen: boolean;
};

const NavItem = ({ category, handleOpen, isOpen, isAnyOpen }: NavItemProps) => {
  return (
    <div className="flex">
      <div className="relative flex items-center">
        <Button
          variant={isOpen ? "secondary" : "ghost"}
          onClick={handleOpen}
          className="gap-1.5"
        >
          {category.label}
          <ChevronDown
            className={cn("h-4 w-4 transition-all text-muted-foreground", {
              "-rotate-180": isOpen,
            })}
          />
        </Button>
      </div>
      {isOpen ? (
        <div
          className={cn(
            "absolute inset-x-0 top-full text-sm text-muted-foreground bg-background",
            { "animate-in fade-in-10 slide-in-from-top-5 ": !isAnyOpen }
          )}
        >
          <div
            className="absolute inset-x-0 top-1/2 shadow "
            aria-hidden="true"
          />

          <div className="relative">
            <div className="mx-auto max-w-7xl px-8">
              <div className="grid grid-cols-4 gap-x-8 gap-y-10 py-16">
                <div className="col-span-4 col-start-1 grid grid-cols-3 gap-x-8">
                  {category.featured.map((item) => (
                    <Link
                      href={item.href}
                      key={item.name}
                      className="group relative text-base sm:text-sm"
                    >
                      <div className="relative aspect-video overflow-hidden rounded-lg bg-gray-100 group-hover:opacity-75">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover object-center "
                        />
                      </div>
                      <h6 className="mt-6 block font-medium text-foreground">
                        {item.name}
                      </h6>
                      <p className="mt-1" aria-hidden="true">
                        Shop Now
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default NavItem;
