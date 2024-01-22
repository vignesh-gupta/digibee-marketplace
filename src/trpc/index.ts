import QueryValidator from "../lib/validators/query-validator";
import { authRouter } from "./auth-router";
import { publicProcedure, router } from "./trpc";
import { z } from "zod";
import { getPayloadClient } from "../get-payload";
import { paymentRouter } from "./payment-router";
import { cartRouter } from "./cart-route";
import { listRouter } from "./list-route";

export const appRouter = router({
  auth: authRouter,
  payment: paymentRouter,
  cart: cartRouter,
  list: listRouter,
  products: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100),
        cursor: z.number().nullish(),
        query: QueryValidator,
      })
    )
    .query(async ({ input }) => {
      const { query, cursor } = input;
      const { sort, limit, ...queryOpts } = query;

      const payload = await getPayloadClient();

      const parseQueryOpts: Record<string, { equals: string }> = {};

      Object.entries(queryOpts).forEach(([key, value]) => {
        parseQueryOpts[key] = {
          equals: value,
        };
      });

      const page = cursor || 1;

      const {
        docs: products,
        hasNextPage,
        nextPage,
      } = await payload.find({
        collection: "products",
        where: {
          approvedForSale: {
            equals: "approved",
          },
          ...parseQueryOpts,
        },
        sort,
        depth: 1,
        limit,
        page,
      });

      return {
        items: products,
        nextPage: hasNextPage ? nextPage : null,
      };
    }),
});

export type AppRouter = typeof appRouter;
