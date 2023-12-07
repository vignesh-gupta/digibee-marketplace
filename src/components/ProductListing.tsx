"use client";

import { Product } from "@/payload-types";
import { useEffect, useState } from "react";
import { Skeleton } from "./ui/skeleton";
import Link from "next/link";
import { cn, formatPrice } from "@/lib/utils";
import { PRODUCT_CATEGORIES } from "@/config";
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
    .map(({ image }) => (typeof image === "string" ? image : image.url))
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

          <h3 className="mt-4 font-medium text-sm text-gray-700">
            {product.name}
          </h3>
          <p className="mt-1 text-sm text-gray-500">{label}</p>
          <p className="mt-1 font-medium text-sm text-gray-900">
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
      <div className="relative bg-zinc-100 aspect-square overflow-hidden rounded-xl w-full">
        <Skeleton className="h-full w-full" />
      </div>

      <Skeleton className="mt-4 w-2/3 h-4 rounded-lg" />
      <Skeleton className="mt-4 w-16 h-4 rounded-lg" />
      <Skeleton className="mt-4 w-12 h-4 rounded-lg" />
    </div>
  );
};

export default ProductListing;
