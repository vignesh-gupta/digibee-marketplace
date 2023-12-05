import { z } from "zod";

const QueryValidator = z.object({
  category: z.string().optional(),
  sort: z.enum(["ASC", "DESC"]).optional(),
  limit: z.number().min(1).max(100).optional(),
});

export type TQueryValidator = z.infer<typeof QueryValidator>;

export default QueryValidator;
