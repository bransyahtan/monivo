import { z } from "zod";

export const categorySchema = z.object({
  name: z
    .string()
    .min(1, "Category name is required")
    .max(255, "Category name is too long (maximum 255 characters)")
    .trim(),
  slug: z
    .string()
    .min(1, "Slug is required")
    .max(255, "Slug is too long (maximum 255 characters)")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug must contain only lowercase letters, numbers, and dashes (no consecutive dashes, no leading/trailing dashes)",
    )
    .trim(),
});

export type CategoryInput = z.infer<typeof categorySchema>;
