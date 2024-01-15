import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { getPayloadClient } from "../get-payload";
import { privateProcedure, router } from "./trpc";

export const cartRouter = router({
  /************************************************************************************************
   * getCart - Gets the user's cart
   * @returns - cart: Cart - The user's cart
   * **********************************************************************************************/

  getCart: privateProcedure.mutation(async ({ ctx }) => {
    const { user } = ctx;

    const payload = await getPayloadClient();

    // Check if user has a cart
    let cart = await payload
      .find({
        collection: "cart",
        limit: 1,
        where: {
          user: {
            equals: user.id,
          },
        },
      })
      .then((res) => res.docs.at(0));

    if (!cart) {
      cart = await payload.create({
        collection: "cart",
        data: {
          products: [],
          user: user.id,
        },
      });

      await payload.update({
        collection: "users",
        where: {
          id: {
            equals: user.id,
          },
        },
        data: {
          cart: cart.id,
        },
      });
      return { cart, success: true, message: "Cart Created" };
    }

    return { cart, success: true, message: "Cart Updated" };
  }),

  /************************************************************************************************
   * addItemToCart - Adds a product to the user's cart and creates a cart if one doesn't exist
   * @param - productId: string - The ID of the product to add to the cart
   * @returns - success: boolean - Whether or not the operation was successful
   * @returns - message: string - A message describing the outcome of the operation
   * **********************************************************************************************/
  addItemToCart: privateProcedure
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

      // Check if user has a cart
      if (!user.cart) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Cart not found",
        });
      }

      const cart = await payload.findByID({
        collection: "cart",
        id: typeof user.cart === "string" ? user.cart : user.cart.id,
      });

      let allProductIds =
        cart?.products?.map((product) =>
          typeof product === "string" ? product : product.id
        ) || [];

      // If user has a cart, add the product to the cart
      await payload.update({
        collection: "cart",
        where: {
          user: {
            equals: user.id,
          },
        },
        data: {
          products: Array.from(new Set([...allProductIds, product.id])),
        },
      });
      return { success: true, message: "Cart Updated" };
    }),

  /************************************************************************************************
   * removeItemFromCart - Removes a product from the user's cart
   * @param - productId: string - The ID of the product to remove from the cart
   * @returns - success: boolean - Whether or not the operation was successful
   * **********************************************************************************************/

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
