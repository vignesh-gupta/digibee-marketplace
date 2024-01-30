import { useCart } from "@/hooks/use-cart";
import { S3_URL } from "@/lib/constants";
import { formatPrice, getLabel } from "@/lib/utils";
import { Product } from "@/payload-types";
import { trpc } from "@/trpc/client";
import { ImageIcon, X } from "lucide-react";
import Image from "next/image";

type CartItemProps = {
  product: Product;
};

const CartItem = ({ product }: CartItemProps) => {
  const { removeItem } = useCart();
  const { mutate: removeCartItem } = trpc.cart.removeItemFromCart.useMutation({
    onError: (error) => {
      console.error("[ERROR]",error);
    },
  });

  const { image } = product.images[0];

  const label = getLabel(product.category);

  const handleRemoveItem = () => {
    removeItem(product.id);
    removeCartItem({ productId: product.id });
  };

  return (
    <div className="py-2 space-y-3 group">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="relative w-16 h-16 overflow-hidden rounded aspect-square">
            {typeof image !== "string" && image.url ? (
              <Image
                src={`${S3_URL}/media/${image.filename}`}
                fill
                alt={product.name}
                className="absolute object-cover transition-transform duration-300 ease-in-out group-hover:scale-110"
              />
            ) : (
              <div className="flex items-center justify-center h-full bg-secondary">
                <ImageIcon
                  className="text-muted-foreground"
                  aria-hidden="true"
                  size={4}
                />
              </div>
            )}
          </div>

          <div className="flex flex-col self-start">
            <span className="mb-1 text-sm font-medium line-clamp-1">
              {product.name}
            </span>

            <span className="text-xs capitalize line-clamp-1 text-muted-foreground">
              {label}
            </span>

            <div className="mt-4 text-xs text-muted-foreground">
              <button
                className="flex items-center gap-0.5 "
                onClick={handleRemoveItem}
              >
                <X className="w-3 h-3" /> Remove
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col space-y-1 font-medium">
          <span className="ml-auto text-sm line-clamp-1">
            {formatPrice(product.price)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
