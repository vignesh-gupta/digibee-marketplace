"use client";

import { Product } from "@/payload-types";
import { useEffect, useState } from "react";
import { Skeleton } from "../ui/skeleton";
import Link from "next/link";
import { cn, formatPrice } from "@/lib/utils";
import { PRODUCT_CATEGORIES } from "@/lib/config";
import ProductImageSlider from "./ProductImageSlider";

type ProductListingProps = {
  product: Product | null;
  index: number;
};

const ProductListing = ({ index, product }: ProductListingProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsVisible(true);
    }, index * 50);

    return () => {
      clearTimeout(timeout);
    };
  }, [index]);

  if (!product || !isVisible) return <ProductPlaceholder />;

  const label = PRODUCT_CATEGORIES.find(
    ({ value }) => value === product.category
  )?.label;

  const validURLs = product.images
    .map(({ image }) =>
      typeof image === "string"
        ? image
        : `https://digibee-mediafiles.s3.ap-south-1.amazonaws.com/media/${image.filename}`
    )
    .filter(Boolean) as string[];

  if (product && isVisible) {
    return (
      <Link
        href={`/products/${product.id}`}
        className={cn("invisible h-full w-full cursor-pointer group-[main]", {
          "visible animate-in fade-in-5": isVisible,
        })}
      >
        <div className="flex flex-col w-full">
          <ProductImageSlider urls={validURLs} />

          <h3 className="mt-4 text-sm font-medium text-foreground/80">
            {product.name}
          </h3>
          <p className="mt-1 text-sm text-foreground/50">{label}</p>
          <p className="mt-1 text-sm font-medium text-foreground/90">
            {formatPrice(product.price)}
          </p>
        </div>
      </Link>
    );
  }

  return <div>ProductListing</div>;
};

const ProductPlaceholder = () => {
  return (
    <div className="flex flex-col w-full">
      <div className="relative w-full overflow-hidden bg-zinc-100 aspect-square rounded-xl">
        <Skeleton className="w-full h-full" />
      </div>

      <Skeleton className="w-2/3 h-4 mt-4 rounded-lg" />
      <Skeleton className="w-16 h-4 mt-4 rounded-lg" />
      <Skeleton className="w-12 h-4 mt-4 rounded-lg" />
    </div>
  );
};

export default ProductListing;
