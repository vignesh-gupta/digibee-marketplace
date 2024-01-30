import { getPayloadClient } from "../get-payload";
import { privateProcedure, publicProcedure, router } from "./trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

export const listRouter = router({
  /**
   * Create a list, it is used to create a list from cart and also to copy a list from another user
   * @access private
   * @param productIds - The product ids to add to the list
   * @returns The list id
   */
  createList: privateProcedure
    .input(z.object({ productIds: z.array(z.string()).default([]) }))
    .mutation(async ({ ctx, input }) => {
      const { user } = ctx;
      const { productIds } = input;

      // Check if productIds are passed
      if (!productIds.length) {
        throw new TRPCError({ code: "BAD_REQUEST" });
      }

      // Check if user is logged in
      if (!user) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      const payload = await getPayloadClient();

      const list = await payload.create({
        collection: "list",
        data: {
          products: productIds,
          user: user.id,
        },
      });

      return { listId: list.id, message: "List Created" };
    }),

  /**
   * Get a list by id. It will return the list with the products populated
   * @access public
   * @param id - The list id
   * @returns The list
   */
  getList: publicProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ input }) => {
      const { id } = input;

      const payload = await getPayloadClient();

      const list = await payload.findByID({
        collection: "list",
        id,
      });

      return list;
    }),

  /**
   * Update a list, it is used to add or remove products from a list. Only the owner of the list can update it
   * @access private
   * @param id - The list id
   * @param productIds - The product ids to add to the list
   * @returns a message
   */
  updateList: privateProcedure
    .input(
      z.object({
        id: z.string(),
        productIds: z.array(z.string()).default([]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { user } = ctx;
      const { id, productIds } = input;

      const payload = await getPayloadClient();

      if (!productIds.length) {
        payload.delete({
          collection: "list",
          where: {
            id: {
              equals: id,
            },
          },
        });
        return { message: "List deleted due to no products" };
      }

      const list = await payload.findByID({
        collection: "list",
        id,
      });

      if (!list) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      // Check if user is the owner of the list
      const userId = typeof user.id === "string" ? user.id : user.id;
      if (userId !== user.id) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      await payload.update({
        collection: "list",
        id,
        data: {
          products: Array.from(new Set(productIds)),
        },
      });

      return { message: "List Updated" };
    }),

  /**
   * Delete a list by id. Only the owner of the list can delete it
   * @access private
   * @param id - The list id
   * @returns a message
   */
  deleteList: privateProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { user } = ctx;
      const { id } = input;

      const payload = await getPayloadClient();

      const list = await payload.findByID({
        collection: "list",
        id,
      });

      // Check if user is the owner of the list
      const userId = typeof user.id === "string" ? user.id : user.id;
      if (userId !== user.id) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      await payload.delete({
        collection: "list",
        id,
      });

      return { message: "List Deleted" };
    }),
});
