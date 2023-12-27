"use client";

import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { useCart } from "@/hooks/use-cart";
import { Product } from "@/payload-types";

const AddToCartButton = ({ product }: { product: Product }) => {
  const { addItem, checkIfItemExists } = useCart();

  const [isAdded, setIsAdded] = useState(false);

  useEffect(() => {
    if (checkIfItemExists(product.id)) {
      setIsAdded(true);
    }
  }, [checkIfItemExists, product.id]);

  return (
    <Button
      onClick={() => {
        addItem(product);
        setIsAdded(true);
      }}
      disabled={isAdded}
      size="lg"
      className={cn("w-full transition", {
        "bg-green-600 hover:bg-green-700": isAdded,
      })}
    >
      {isAdded ? "Added!" : "Add to Cart"}
    </Button>
  );
};

export default AddToCartButton;
