import { PRODUCT_CATEGORIES } from "@/config";
import { useCart } from "@/hooks/use-cart";
import { formatPrice } from "@/lib/utils";
import { Product } from "@/payload-types";
import { ImageIcon, X } from "lucide-react";
import Image from "next/image";

type CartItemProps = {
  product: Product;
};

const CartItem = ({ product }: CartItemProps) => {
  const { removeItem } = useCart();
  


  const { image } = product.images[0];

  const label = PRODUCT_CATEGORIES.find(
    ({ value }) => value === product.category
  )?.label;

  return (
    <div className="space-y-3 py-2 group">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="relative aspect-square h-16 w-16 rounded overflow-hidden">
            {typeof image !== "string" && image.url ? (
              <Image
                src={image.url}
                fill
                alt={product.name}
                className="absolute object-cover group-hover:scale-110 transition-transform duration-300 ease-in-out"
              />
            ) : (
              <div className="flex justify-center items-center bg-secondary h-full">
                <ImageIcon
                  className="text-muted-foreground"
                  aria-hidden="true"
                  size={4}
                />
              </div>
            )}
          </div>

          <div className="flex flex-col self-start">
            <span className="line-clamp-1 text-sm mb-1 font-medium">
              {product.name}
            </span>

            <span className="line-clamp-1 capitalize text-xs text-muted-foreground">
              {label}
            </span>

            <div className="mt-4 text-xs text-muted-foreground">
              <button
                className="flex items-center gap-0.5 "
                onClick={() => removeItem(product.id)}
              >
                <X className="w-3 h-3" /> Remove
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col space-y-1 font-medium">
          <span className="ml-auto line-clamp-1 text-sm">
            {formatPrice(product.price)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
