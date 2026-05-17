import { describe, expect, it } from "vitest";
import { loginSchema, registerSchema } from "./auth";

describe("registerSchema", () => {
  const validData = {
    name: "John Doe",
    username: "johndoe",
    email: "john@example.com",
    password: "StrongP@ss123",
    confirmPassword: "StrongP@ss123",
    phone_number: "08123456789",
  };

  it("should pass validation with valid data", () => {
    const result = registerSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it("should fail if passwords do not match", () => {
    const result = registerSchema.safeParse({
      ...validData,
      confirmPassword: "DifferentPassword1!",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      expect(fieldErrors.confirmPassword).toContain("Passwords do not match");
    }
  });

  it("should fail if email is invalid", () => {
    const result = registerSchema.safeParse({
      ...validData,
      email: "not-an-email",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      expect(fieldErrors.email).toContain("Invalid email format");
    }
  });

  it("should fail if username contains special characters", () => {
    const result = registerSchema.safeParse({
      ...validData,
      username: "john@doe",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      expect(fieldErrors.username).toContain(
        "Username can only contain letters, numbers, and underscores",
      );
    }
  });

  it("should fail if the password is too weak (fails strength requirements)", () => {
    const result = registerSchema.safeParse({
      ...validData,
      password: "weakpassword",
      confirmPassword: "weakpassword",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      expect(fieldErrors.password?.[0]).toContain(
        "Password must contain at least one uppercase letter",
      );
    }
  });
});

describe("loginSchema", () => {
  it("should pass with valid credentials", () => {
    const result = loginSchema.safeParse({
      identifier: "johndoe",
      password: "password123",
    });
    expect(result.success).toBe(true);
  });

  it("should fail if identifier is too short", () => {
    const result = loginSchema.safeParse({
      identifier: "jo",
      password: "password123",
    });
    expect(result.success).toBe(false);
  });
});
