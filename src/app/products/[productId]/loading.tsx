import { Check, Shield } from "lucide-react";
import Link from "next/link";

import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

const BREADCRUMBS = [
  { id: 1, name: "Home", href: "/" },
  { id: 2, name: "Products", href: "/products" },
];

const Loading = () => {
  return (
    <MaxWidthWrapper>
      <div className="bg-background">
        <div className="max-w-2xl px-4 py-16 mx-auto sm:px-6 sm:py-24 lg:grid lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8">
          {/* Product Detail*/}
          <div className="lg:max-w-lg lg:self-end">
            <ol className="flex items-center space-x-2">
              {BREADCRUMBS.map((breadcrumb, i) => (
                <li key={breadcrumb.href}>
                  <div className="flex items-center text-sm">
                    <Link
                      href={breadcrumb.href}
                      className="text-sm font-medium text-muted-foreground hover:text-foreground/80"
                    >
                      {breadcrumb.name}
                    </Link>
                    {i !== BREADCRUMBS.length - 1 ? (
                      <svg
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                        className="flex-shrink-0 w-5 h-5 ml-2 text-gray-300"
                      >
                        <path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z" />
                      </svg>
                    ) : null}
                  </div>
                </li>
              ))}
            </ol>

            <div className="mt-4">
              <Skeleton className="w-2/3 h-8" />
            </div>

            <section className="mt-4">
              <Skeleton className="w-1/4 h-6" />

              <Skeleton className="mt-4 space-y-6 h-4" />
              <Skeleton className="mt-4 space-y-6 h-4" />
              <Skeleton className="mt-4 space-y-6 h-4" />
              <Skeleton className="mt-4 space-y-6 h-4" />

             
             <Skeleton className="mt-6 w-1/2 h-6" />
            </section>
          </div>
          {/* Product Image */}
          <div className="mt-10 lg:col-start-2 lg:row-span-2 lg:mt-0 lg:self-center">
            <Skeleton className="rounded-lg aspect-square" />
          </div>

          {/* Add to Cart */}
          <div className="mt-10 lg:col-start-1 lg:row-start-2 lg:max-w-lg lg:self-start">
            <div>
              <div className="mt-10">
                <Button disabled className="w-full">
                  Add to cart
                </Button>
              </div>

              <div className="mt-6 text-center">
                <div className="inline-flex text-sm font-medium group">
                  <Shield
                    aria-hidden="true"
                    className="flex-shrink-0 w-5 h-5 mr-2 text-muted-foreground group-hover:text-muted-foreground/80"
                  />
                  <span className="text-muted-foreground group-hover:text-muted-foreground/80">
                    30 Day Return Guarantee
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MaxWidthWrapper>
  );
};

export default Loading;
