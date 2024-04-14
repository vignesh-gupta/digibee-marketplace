"use client";

import CartItemLG from "@/components/cart/CartItemLG";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import { TRANSACTION_FEE } from "@/lib/constants";
import { cn, formatPrice } from "@/lib/utils";
import { trpc } from "@/trpc/client";
import { Loader2 } from "lucide-react";
import Image from "next/image";
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
                items.map(({ product }) => (
                  <CartItemLG
                    onClick={removeItem}
                    isEditable
                    key={product.id}
                    product={product}
                  />
                ))}
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
