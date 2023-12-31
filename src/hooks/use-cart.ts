// Functionality:
// 1. Load the cart from db to state
// 2. Add item to cart
// 3. Remove item from cart
// 4. Clear cart
// 5. track cart state
// 6. Check if item exists in cart

import { Product } from "@/payload-types";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type CartType = {
  product: Product;
};

export type CartState = {
  items: CartType[];
  loadItems: (products: Product[] | null) => void;
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
  checkIfItemExists: (id: string) => boolean;
};

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      loadItems: (products) => {
        set({ items: products?.map((product) => ({ product })) ?? [] });
      },
      addItem: (product) =>
        set((state) => ({ items: [...state.items, { product }] })),
      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((item) => item.product.id !== id),
        })),
      clearCart: () => set({ items: [] }),
      checkIfItemExists: (id: string) => {
        let item = null;
        set((state) => {
          item = state.items.find((item) => item.product.id === id);
          return state;
        });
        return !!item;
      },
    }),
    {
      name: "cart-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
