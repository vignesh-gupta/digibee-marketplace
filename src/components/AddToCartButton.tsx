"use client";

import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { useCart } from "@/hooks/use-cart";
import { Product } from "@/payload-types";

const AddToCartButton = ({ product }: { product: Product }) => {
  const { addItem } = useCart();

  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsSuccess(false);
    }, 1000);

    return () => {
      clearTimeout(timeout);
    };
  }, [isSuccess]);

  return (
    <Button
      onClick={() => {
        addItem(product);
        setIsSuccess(true);
      }}
      size="lg"
      className={cn("w-full transition", {
        "bg-green-600 hover:bg-green-700": isSuccess,
      })}
    >
      {isSuccess ? "Added!" : "Add to Cart"}
    </Button>
  );
};

export default AddToCartButton;
