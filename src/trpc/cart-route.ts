import { z } from "zod";
import { privateProcedure, router } from "./trpc";
import { getPayloadClient } from "../get-payload";
import { TRPCError } from "@trpc/server";
import { Product } from "../payload-types";

export const cartRouter = router({
  /************************************************************************************************
  addItemToCart - Adds a product to the user's cart and creates a cart if one doesn't exist
    @param - productId: string - The ID of the product to add to the cart
    @returns - success: boolean - Whether or not the operation was successful
    @returns - message: string - A message describing the outcome of the operation
  ************************************************************************************************/
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
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      // Check if user has a cart
      const { docs: cart } = await payload.find({
        collection: "cart",
        where: {
          user: {
            equals: user.id,
          },
        },
      });

      let allProductIds =
        cart[0]?.products?.map((product) =>
          typeof product === "string" ? product : product.id
        ) || [];

      if (cart[0]) {
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
      } else {
        // If user doesn't have a cart, `create a cart` and `add the product` to the cart and `add the cart to the user`
        const newCart = await payload.create({
          collection: "cart",
          data: {
            products: [product.id],
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
            cart: newCart.id,
          },
        });
        return { success: true, message: "Cart created" };
      }
    }),
});
