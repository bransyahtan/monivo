import { z } from "zod";

export const transactionSchema = z
  .object({
    type: z.enum(["income", "expense", "transfer"]),
    amount: z.coerce.number().positive("Amount must be greater than 0"),
    category_id: z.coerce.number().optional().nullable(),
    from_account_id: z.coerce.number({ message: "Account is required" }),
    to_account_id: z.coerce.number().optional().nullable(),
    description: z.string().min(1, "Description is required"),
    transaction_date: z
      .string()
      .min(1, "Date is required")
      .default(() => new Date().toISOString()),
  })
  .superRefine((data, ctx) => {
    if (data.type !== "transfer" && !data.category_id) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Category is required",
        path: ["category_id"],
      });
    }
    if (data.type === "transfer" && !data.to_account_id) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Destination account is required",
        path: ["to_account_id"],
      });
    }
  });
