import { getPayloadClient } from "../get-payload";
import { privateProcedure, publicProcedure, router } from "./trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

export const listRouter = router({
  createList: privateProcedure
    .input(z.object({ productIds: z.array(z.string()).default([]) }))
    .mutation(async ({ ctx, input }) => {
      const { user } = ctx;
      const { productIds } = input;

      if (!productIds.length) {
        throw new TRPCError({ code: "BAD_REQUEST" });
      }

      const payload = await getPayloadClient();

      const list = await payload.create({
        collection: "list",
        data: {
          products: productIds,
          user: user.id,
        },
      });

      return { listId: list.id, success: true, message: "List Created" };
    }),

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

      const list = await payload.findByID({
        collection: "list",
        id,
      });

      if (list.user !== user.id) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      await payload.update({
        collection: "list",
        id,
        data: {
          products: Array.from(new Set(productIds)),
        },
      });

      return { success: true, message: "List Updated" };
    }),

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

      if (list.user !== user.id) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      await payload.delete({
        collection: "list",
        id,
      });

      return { success: true, message: "List Deleted" };
    }),
});
