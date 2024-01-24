"use client";

import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import { S3_URL, TRANSACTION_FEE } from "@/lib/constants";
import { cn, formatPrice, getLabel } from "@/lib/utils";
import { trpc } from "@/trpc/client";
import { Check, Loader2, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const CartPage = () => {
  const [isMounted, setIsMounted] = useState(false);

  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const { items, removeItem } = useCart();
  const { mutate: createCheckoutSession, isLoading } =
    trpc.payment.createSession.useMutation({
      onSuccess: ({ url }) => {
        if (url) router.push(url);
      },
    });

  const { mutate: createCartList, isLoading: IsListCreating } =
    trpc.list.createList.useMutation({
      onSuccess: ({ listId }) => {
        router.push(`/list/${listId}`);
      },
    });

  const createList = async () =>
    createCartList({ productIds: items.map(({ product }) => product.id) });

  let cartTotal = items.reduce(
    (total, { product }) => total + product.price,
    0
  );

  const productIds = items.map(({ product }) => product.id);

  return (
    <div className="bg-background">
      <div className="mx-auto max-w-2xl px-4 pb-24 pt-16 sm:px-6 lg:max-w-7xl lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight text-foreground/90 sm:text-4xl">
          Shopping Cart
        </h1>

        <p>
          Want to share the same products with everyone?
          <Button
            variant="link"
            size="sm"
            onClick={createList}
            disabled={IsListCreating}
          >
            Create a cart list
          </Button>
        </p>

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
                    src="/empty-cart.png"
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
                "divide-y divide-foreground/20 text-foreground/20 border-b border-t border-foreground/20":
                  isMounted && items.length > 0,
              })}
            >
              {isMounted &&
                items.map(({ product }) => {
                  const label = getLabel(product.category);

                  const { image } = product.images[0];

                  return (
                    <li
                      key={`cart-product-${product.id}`}
                      className="flex py-6 sm:py-10"
                    >
                      <div className="flex-shrink-0">
                        <div className="relative h-24 w-24">
                          {typeof image !== "string" && image.filename ? (
                            <Image
                              src={`${S3_URL}/media/${image.filename}`}
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
                                  className="text-foreground/70 hover:text-foreground/90 font-medium"
                                >
                                  {product.name}
                                </Link>
                              </h3>
                            </div>

                            <div className="mt-1 flex text-sm">
                              <p className="text-muted-foreground">
                                Category {label}
                              </p>
                            </div>

                            <p className="mt-1 font-medium text-foreground/90 text-sm">
                              {formatPrice(product.price)}
                            </p>
                          </div>

                          <div className="mt-4 sm:mt-0 sm:pr-9 w-20">
                            <div className="absolute right-0 top-0">
                              <Button
                                size="icon"
                                aria-label="remove item"
                                onClick={() => removeItem(product.id)}
                                variant="ghost"
                              >
                                <X className="h-5 w-5 " aria-hidden="true" />
                              </Button>
                            </div>
                          </div>
                        </div>

                        <p className="space-x-2 mt-4 text-sm text-foreground/70 flex">
                          <Check className="h-5 w-5 flex-shrink-0 text-green-500" />
                          <span>Eligible for instant delivery</span>
                        </p>
                      </div>
                    </li>
                  );
                })}
            </ul>
          </div>

          <section className="mt-16 rounded-lg bg-foreground/5 px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8">
            <h2 className="font-medium text-foreground/90 text-lg">
              Order Summary
            </h2>

            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-foreground/60">Subtotal</p>
                <p className="font-medium text-foreground/90 text-sm">
                  {isMounted ? (
                    formatPrice(cartTotal)
                  ) : (
                    <Loader2 className="h-5 w-5 text-muted-foreground animate-spin" />
                  )}
                </p>
              </div>

              <div className="flex items-center justify-between border-t border-foreground/20 text-foreground/20 pt-4">
                <div className="flex items-center text-sm text-muted-foreground">
                  <span>Flat Transaction fees</span>
                </div>
                <div className="text-sm font-medium text-foreground/90">
                  {isMounted ? (
                    formatPrice(Number(TRANSACTION_FEE))
                  ) : (
                    <Loader2 className="h-5 w-5 text-muted-foreground animate-spin" />
                  )}
                </div>
              </div>
              <div className="flex items-center justify-between border-t border-muted text-foreground/20 pt-4">
                <div className="flex items-center text-base font-medium text-muted-foreground">
                  Order Total
                </div>
                <div className=" text-base font-medium text-foreground/90">
                  {isMounted ? (
                    formatPrice(cartTotal + Number(TRANSACTION_FEE))
                  ) : (
                    <Loader2 className="h-5 w-5 text-muted-foreground animate-spin" />
                  )}
                </div>
              </div>
            </div>

            <div className="mt-6">
              {isMounted && (
                <Button
                  disabled={items.length === 0 || isLoading}
                  onClick={() => createCheckoutSession({ productIds })}
                  className="w-full"
                  size="lg"
                >
                  {isLoading && (
                    <Loader2 className="h-5 w-5 animate-spin mr-1.5" />
                  )}
                  Checkout
                </Button>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
