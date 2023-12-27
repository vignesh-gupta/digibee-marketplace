// Functionality:
// 1. Add item to cart
// 2. Remove item from cart
// 4. Clear cart
// 5. track cart state
import { Product } from "@/payload-types";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type CartType = {
  product: Product;
};

export type CartState = {
  items: CartType[];
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
  checkIfItemExists: (id: string) => boolean;
};

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      items: [],
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
