import { S3_URL } from "@/lib/constants";
import { formatPrice, getLabel } from "@/lib/utils";
import { Product } from "@/payload-types";
import { Check, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Button } from "../ui/button";
import { useCart } from "@/hooks/use-cart";

type CartItemLGProps = {
  product: Product;
  isEditable?: boolean;
  onClick?: (id: string) => void;
};

const CartItemLG = ({ product, isEditable, onClick }: CartItemLGProps) => {
  const { image } = product.images[0];
  const label = getLabel(product.category);

  return (
    <li key={`cart-product-${product.id}`} className="flex py-6 sm:py-10">
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
              <p className="text-muted-foreground">Category {label}</p>
            </div>

            <p className="mt-1 font-medium text-foreground/90 text-sm">
              {formatPrice(product.price)}
            </p>
          </div>

          {isEditable && onClick && (
            <div className="mt-4 sm:mt-0 sm:pr-9 w-20">
              <div className="absolute right-0 top-0">
                <Button
                  size="icon"
                  aria-label="remove item"
                  onClick={() => onClick(product.id)}
                  variant="ghost"
                >
                  <X className="h-5 w-5 " aria-hidden="true" />
                </Button>
              </div>
            </div>
          )}
        </div>

        <p className="space-x-2 mt-4 text-sm text-foreground/70 flex">
          <Check className="h-5 w-5 flex-shrink-0 text-green-500" />
          <span>Eligible for instant delivery</span>
        </p>
      </div>
    </li>
  );
};

export default CartItemLG;
