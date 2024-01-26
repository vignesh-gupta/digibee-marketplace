import { z } from "zod";

export const AuthCredentialValidator = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(8, { message: "Password must be of at least 8 character long" }),
});

export type TAuthCredentialValidator = z.infer<typeof AuthCredentialValidator>;

export const AuthEmailValidator = z.object({
  email: z.string().email(),
});

export type TAuthEmailValidator = z.infer<typeof AuthEmailValidator>;

export const AuthPasswordValidator = z.object({
  password: z
    .string()
    .min(8, { message: "Password must be of at least 8 character long" }),
});

export type TAuthPasswordValidator = z.infer<typeof AuthPasswordValidator>;
