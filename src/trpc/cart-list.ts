import { getPayloadClient } from "../get-payload";
import { privateProcedure, publicProcedure, router } from "./trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

export const listRouter = router({
  createList: privateProcedure
    .input(z.object({ productIds: z.array(z.string()) }))
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
});
