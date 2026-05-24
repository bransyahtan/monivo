import { z } from "zod";

export const transactionSchema = z.object({
  type: z.enum(["income", "expense", "transfer"]),
  amount: z.coerce.number().positive("Amount must be greater than 0"),
  category_id: z.coerce.number().nullable().optional(),
  from_account_id: z.coerce.number().nullable().optional(),
  description: z.string().optional(),
  transaction_date: z
    .string()
    .optional()
    .default(() => new Date().toISOString()),
});
