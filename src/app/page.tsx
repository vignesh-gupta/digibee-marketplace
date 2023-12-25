"use client";

import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import ProductReel from "@/components/product/ProductReel";
import { Button, buttonVariants } from "@/components/ui/button";
import { Leaf, ScanEye, ShieldCheck } from "lucide-react";
import Link from "next/link";

const perks = [
  {
    name: "High-quality assets",
    Icon: ShieldCheck,
    description:
      "Every asset on our platform is carefully reviewed by our team to ensure best quality.",
  },
  {
    name: "Carefully reviewed",
    Icon: ScanEye,
    description:
      "Every asset on our platform is carefully reviewed by our team to ensure best quality.",
  },
  {
    name: "For the Planet",
    Icon: Leaf,
    description:
      "We've pledge to donate 1% of our revenue to preservation and restoration of out planet.",
  },
];

export default function Home() {
  return (
    <>
      <MaxWidthWrapper>
        <div className="flex flex-col items-center max-w-3xl py-20 mx-auto text-center">
          <h1 className="text-4xl font-bold tracking-tight text-foreground/80 sm:text-6xl [text-wrap:balance]">
            Your marketplace for high-quality{" "}
            <span className="text-primary">digital asset</span>.
          </h1>

          <p className="mt-4 [text-wrap:balance]">
            Welcome to DigiBee. Every asset on our platform is carefully
            reviewed by our team to ensure best quality.
          </p>

          <div className="flex flex-col gap-4 mt-6 md:flex-row">
            <Link href="/products" className={buttonVariants()}>
              Browse Trending
            </Link>
            <Button variant="outline">Our quality promise &rarr; </Button>
          </div>
        </div>

        <ProductReel
          query={{
            limit: 4,
            sort: "DESC",
          }}
          title="Brand new"
          href="/products"
        />
      </MaxWidthWrapper>
      <section className="">
        <MaxWidthWrapper className="py-20">
          <div className="grid grid-cols-1 gap-y-12 sm:grid-cols-2 sm:gap-x-6 lg:gap-x-8 lg:gap-y-0 lg:grid-cols-3">
            {perks.map((perk) => (
              <div
                key={perk.name}
                className="text-center md:items-center md:flex md:text-left lg:block lg:text-center"
              >
                <div className="flex justify-center md:flex-shrink-0">
                  <div className="flex items-center justify-center w-16 h-16 rounded-full text-primary bg-primary/10">
                    <perk.Icon className="w-1/3 h-1/3" />
                  </div>
                </div>

                <div className="mt-6 md:ml-4 md:mt-0 lg:ml-0 lg:mt-6">
                  <h3 className="text-base font-medium text-foreground">
                    {perk.name}
                  </h3>
                  <p className="mt-3 text-sm text-muted-foreground">
                    {perk.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </MaxWidthWrapper>
      </section>
    </>
  );
}
