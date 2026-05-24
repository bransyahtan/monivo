import { z } from "zod";

export const accountSchema = z.object({
  bank_id: z.coerce.number().positive("Please select a bank"),
  account_name: z.string().min(1, "Account name is required"),
  balance: z.coerce.number().min(0, "Initial balance cannot be negative"),
});
