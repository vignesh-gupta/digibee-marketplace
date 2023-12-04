import { z } from "zod";

export const AuthCredentialValidator = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(8, { message: "Password must be of at least 8 character long" }),
});

export type TAuthCredentialValidator = z.infer<typeof AuthCredentialValidator>;
