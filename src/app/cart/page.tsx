"use client";

import { Button } from "@/components/ui/button";
import { PRODUCT_CATEGORIES } from "@/config";
import { useCart } from "@/hooks/use-cart";
import { cn, formatPrice } from "@/lib/utils";
import { trpc } from "@/trpc/client";
import { Check, Loader2, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const CartPage = () => {
  const { items, removeItem } = useCart();

  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const { mutate: createCheckoutSession, isLoading } =
    trpc.payment.createSession.useMutation({
      onSuccess: ({ url }) => {
        if (url) router.push(url);
      },
    });

  const [isMounted, setIsMounted] = useState(false);

  let fee = 1,
    cartTotal = items.reduce((total, { product }) => total + product.price, 0);

  const productIds = items.map(({ product }) => product.id);

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 pb-24 pt-16 sm:px-6 lg:max-w-7xl lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Shopping Cart
        </h1>

        <div className="mt-12 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16">
          <div
            className={cn("lg:col-span-7", {
              "rounded-lg border-2 border-dashed border-zinc-200 p-12":
                isMounted && items.length === 0,
            })}
          >
            <h2 className="sr-only">Items in your shopping cart</h2>

            {isMounted && items.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center space-y-1">
                <div
                  aria-hidden="true"
                  className="relative mb-4 h-40 w-40 text-muted-foreground"
                >
                  <Image
                    src="/hippo-empty-cart.png"
                    layout="fill"
                    alt="Empty Cart"
                    loading="eager"
                  />
                </div>
                <h3 className="font-semibold text-2xl">Your cart is empty</h3>
                <p className="text-muted-foreground text-center ">
                  Woops! Looks like you haven&apos;t added anything to your cart
                  yet.
                </p>
              </div>
            ) : null}

            <ul
              className={cn({
                "divide-y divide-gray-200 border-b border-t border-gray-200":
                  isMounted && items.length > 0,
              })}
            >
              {isMounted &&
                items.map(({ product }) => {
                  const label = PRODUCT_CATEGORIES.find(
                    (c) => c.value === product.category
                  )?.label;

                  const { image } = product.images[0];

                  return (
                    <li
                      key={`cart-product-${product.id}`}
                      className="flex py-6 sm:py-10"
                    >
                      <div className="flex-shrink-0">
                        <div className="relative h-24 w-24">
                          {typeof image !== "string" && image.url ? (
                            <Image
                              src={image.url}
                              fill
                              alt={product.name}
                              className="h-full w-full rounded-md object-center object-cover sm:h-48 sm:w-48"
                            />
                          ) : null}
                        </div>
                      </div>

                      <div className="ml-4 flex-1 flex flex-col justify-between sm:ml-6">
                        <div className="relative sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
                          <div>
                            <div className="flex justify-between">
                              <h3 className="text-sm">
                                <Link
                                  href={`/products/${product.id}`}
                                  className="text-gray-700 hover:text-gray-900 font-medium"
                                >
                                  {product.name}
                                </Link>
                              </h3>
                            </div>

                            <div className="mt-1 flex text-sm">
                              <p className="text-muted-foreground">
                                Category ${label}
                              </p>
                            </div>

                            <p className="mt-1 font-medium text-gray-900 text-sm">
                              {formatPrice(product.price)}
                            </p>
                          </div>

                          <div className="mt-4 sm:mt-0 sm:pr-9 w-20">
                            <div className="absolute right-0 top-0">
                              <Button
                                aria-label="remove item"
                                onClick={() => removeItem(product.id)}
                                variant="ghost"
                              >
                                <X className="h-5 w-5 " aria-hidden="true" />
                              </Button>
                            </div>
                          </div>
                        </div>

                        <p className="space-x-2 mt-4 text-sm text-gray-700">
                          <Check className="h-5 w-5 flex-shrink-0 text-green-500" />
                          <span>Eligible for instant delivery</span>
                        </p>
                      </div>
                    </li>
                  );
                })}
            </ul>
          </div>

          <section className="mt-16 rounded-lg bg-gray-50 px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8">
            <h2 className="font-medium text-gray-900 text-lg">Order Summary</h2>

            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">Subtotal</p>
                <p className="font-medium text-gray-900 text-sm">
                  {isMounted ? (
                    formatPrice(cartTotal)
                  ) : (
                    <Loader2 className="h-5 w-5 text-muted-foreground animate-spin" />
                  )}
                </p>
              </div>

              <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                <div className="flex items-center text-sm text-muted-foreground">
                  <span>Flat Transaction fees</span>
                </div>
                <div className="text-sm font-medium text-gray-900">
                  {isMounted ? (
                    formatPrice(fee)
                  ) : (
                    <Loader2 className="h-5 w-5 text-muted-foreground animate-spin" />
                  )}
                </div>
              </div>
              <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                <div className="flex items-center text-base font-medium text-gray-900 text-muted-foreground">
                  Order Total
                </div>
                <div className=" text-base font-medium text-gray-900">
                  {isMounted ? (
                    formatPrice(cartTotal + fee)
                  ) : (
                    <Loader2 className="h-5 w-5 text-muted-foreground animate-spin" />
                  )}
                </div>
              </div>
            </div>

            <div className="mt-6">
              <Button
                disabled={items.length === 0 || isLoading}
                onClick={() => createCheckoutSession({ productIds })}
                className="w-full"
                size="lg"
              >
                {isLoading && <Loader2 className="h-5 w-5 animate-spin mr-1.5" />}
                Checkout
              </Button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
