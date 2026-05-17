import { validatePasswordStrength } from "@/lib/utils/password";
import { z } from "zod";

export const registerSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    username: z
      .string()
      .min(3, "Username must be at least 3 characters")
      .regex(
        /^[a-zA-Z0-9_]+$/,
        "Username can only contain letters, numbers, and underscores",
      ),
    phone_number: z.string().optional(),
    email: z.string().email("Invalid email format"),
    password: z.string().superRefine((val, ctx) => {
      const check = validatePasswordStrength(val);
      if (!check.isValid) {
        check.feedback.forEach((err) => {
          ctx.addIssue({
            code: "custom",
            message: err,
          });
        });
      }
    }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const loginSchema = z.object({
  identifier: z
    .string()
    .min(3, "Username or Email must be at least 3 characters"),
  password: z.string().min(1, "Password is required"),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
