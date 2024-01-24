import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { getPayloadClient } from "../get-payload";
import { privateProcedure, router } from "./trpc";

export const cartRouter = router({
  /**
   * getCart - Gets the user's cart
   * @returns - cart: Cart - The user's cart
   */

  getCart: privateProcedure.mutation(async ({ ctx }) => {
    const { user } = ctx;

    const payload = await getPayloadClient();

    // Check if user has a cart
    let cart = await payload.findByID({
      collection: "cart",
      id: (typeof user.cart === "string" ? user.cart : user?.cart?.id) || "",
    });

    return { cart, success: true, message: "Cart Updated" };
  }),

  /**
   * addItemsToCart - Adds products to the user's cart if they exist
   * @param - productId: string - The ID of the product to add to the cart
   * @returns - success: boolean - Whether or not the operation was successful
   * @returns - message: string - A message describing the outcome of the operation
   */
  addItemsToCart: privateProcedure
    .input(z.object({ productIds: z.array(z.string()) }))
    .mutation(async ({ input, ctx }) => {
      const { user } = ctx;
      const { productIds } = input;

      const payload = await getPayloadClient();

      const { docs: products } = await payload.find({
        collection: "products",
        where: {
          id: {
            in: productIds,
          },
        },
      });

      if (!products || products.length !== productIds.length) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Some Product(s) were not found",
        });
      }

      // Check if user has a cart
      if (!user.cart) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Cart not found",
        });
      }

      const cart = await payload.findByID({
        collection: "cart",
        id: typeof user.cart === "string" ? user.cart : user?.cart.id,
      });

      let allProductIds =
        cart?.products?.map((product) =>
          typeof product === "string" ? product : product.id
        ) || [];

      // If user has a cart, add the product to the cart
      const { docs } = await payload.update({
        collection: "cart",
        where: {
          user: {
            equals: user.id,
          },
        },
        data: {
          products: Array.from(new Set([...allProductIds, ...productIds])),
        },
      });

      return { success: true, message: "Cart Updated", updatedCart: docs[0] };
    }),
  /**
   * removeItemFromCart - Removes a product from the user's cart
   * @param - productId: string - The ID of the product to remove from the cart
   * @returns - success: boolean - Whether or not the operation was successful
   */

  removeItemFromCart: privateProcedure
    .input(z.object({ productId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const { user } = ctx;
      const { productId } = input;

      const payload = await getPayloadClient();

      // Check if product exists
      const product = await payload.findByID({
        collection: "products",
        id: productId,
      });

      if (!product) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Product not found",
        });
      }

      if (!user.cart) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Cart not found" });
      }

      const cart = await payload.findByID({
        collection: "cart",
        id: typeof user.cart === "string" ? user.cart : user.cart.id,
      });

      // If user has a cart, remove the product from the cart
      const updatedCart = await payload.update({
        collection: "cart",
        id: cart.id,
        data: {
          products: cart.products?.filter(
            (product) =>
              (typeof product === "string" ? product : product.id) !== productId
          ),
        },
      });

      return { success: true, message: "Cart Updated", updatedCart };
    }),
});
