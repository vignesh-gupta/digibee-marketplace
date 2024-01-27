"use client";

import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ShoppingCart } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { formatPrice } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/hooks/use-cart";
import CartItem from "./CartItem";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect, useState } from "react";
import { TRANSACTION_FEE } from "@/lib/constants";

const Cart = () => {
  const { items } = useCart();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  const itemCount = items.length ?? 0,
    cartTotal = items.reduce(
      (total, { product }) => total + product.price,
      TRANSACTION_FEE
    );

  return (
    <Sheet>
      <SheetTrigger className="flex items-center p-2 -m-2 group">
        <ShoppingCart
          aria-hidden="true"
          className="flex-shrink-0 w-6 h-6 text-muted-foreground/70 group-hover:text-muted-foreground"
        />
        <span className="ml-2 text-sm font-medium text-muted-foreground/70 group-hover:text-muted-foreground">
          {itemCount}
        </span>
      </SheetTrigger>

      <SheetContent className="flex flex-col w-full pr-0 sm:max-w-lg overflow-y-auto">
        <SheetHeader className="space-y-2.5 pr-6">
          <SheetTitle>Cart {itemCount}</SheetTitle>
        </SheetHeader>
        {itemCount > 0 ? (
          <>
            <div className="flex flex-col w-full pr-6">
              {/* Cart Logic */}
              <ScrollArea>
                {items.map(({ product }) => (
                  <CartItem key={product.id} product={product} />
                ))}
              </ScrollArea>
            </div>
            <div className="pr-6 space-y-4">
              <Separator />
              <div className="space-y-1.5 text-sm">
                <div className="flex">
                  <span className="flex-1">Shipping</span>
                  <span>Free</span>
                </div>
                <div className="flex">
                  <span className="flex-1">Transaction Fee</span>
                  <span>{formatPrice(TRANSACTION_FEE)}</span>
                </div>
                <div className="flex">
                  <span className="flex-1">Total</span>
                  <span>{formatPrice(cartTotal)}</span>
                </div>
              </div>
              <SheetFooter>
                <SheetTrigger asChild>
                  <Link
                    href="/cart"
                    className={buttonVariants({ className: "w-full" })}
                  >
                    Continue to Checkout
                  </Link>
                </SheetTrigger>
              </SheetFooter>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full space-y-1">
            <div className="relative mb-4 w-60 h-60 text-muted-foreground">
              <Image
                src="/empty-cart.png"
                fill
                alt="Empty Shopping Cart"
                aria-hidden="true"
              />
            </div>

            <div className="text-xl font-semibold">Your Cart looks empty</div>
            <SheetTrigger asChild>
              <Link
                href="/products"
                className={buttonVariants({
                  variant: "link",
                  size: "sm",
                  className: "text-sm text-muted-foreground",
                })}
              >
                Add Items to your cart to checkout
              </Link>
            </SheetTrigger>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default Cart;
