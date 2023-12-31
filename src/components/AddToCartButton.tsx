"use client";

import { useCart } from "@/hooks/use-cart";
import { cn } from "@/lib/utils";
import { Product } from "@/payload-types";
import { trpc } from "@/trpc/client";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";

const AddToCartButton = ({ product }: { product: Product }) => {
  const { addItem, checkIfItemExists } = useCart();

  const [isAdded, setIsAdded] = useState(false);

  const { mutate } = trpc.cart.addItemToCart.useMutation();

  useEffect(() => {
    if (checkIfItemExists(product.id)) {
      setIsAdded(true);
    }
  }, [checkIfItemExists, product.id]);

  const handleAddToCart = async () => {
    addItem(product);
    setIsAdded(true);
    mutate({ productId: product.id });
  };

  return (
    <Button
      onClick={handleAddToCart}
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
