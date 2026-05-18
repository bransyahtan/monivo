import { z } from "zod";

export const bankSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Bank name is required")
    .max(255, "Bank name is too long (maximum 255 characters)"),
  type: z.enum(["bank", "e-wallet", "cash"], {
    message: "Bank type must be either bank, e-wallet, or cash",
  }),
});

export type BankInput = z.infer<typeof bankSchema>;
