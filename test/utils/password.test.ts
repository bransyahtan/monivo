import { validatePasswordStrength } from "@/lib/utils/password";
import { describe, expect, it } from "vitest";

describe("validatePasswordStrength", () => {
  it("should return valid for strong passwords", () => {
    const result = validatePasswordStrength("StrongPass123!");
    expect(result.isValid).toBe(true);
    expect(result.feedback).toHaveLength(0);
  });

  it("should fail if too short", () => {
    const result = validatePasswordStrength("Ab1!");
    expect(result.isValid).toBe(false);
    expect(result.feedback).toContain(
      "Password must be at least 8 characters long",
    );
  });

  it("should fail if no uppercase", () => {
    const result = validatePasswordStrength("weakpass123!");
    expect(result.isValid).toBe(false);
    expect(result.feedback).toContain(
      "Password must contain at least one uppercase letter",
    );
  });

  it("should fail if no number", () => {
    const result = validatePasswordStrength("NoNumbersHere!");
    expect(result.isValid).toBe(false);
    expect(result.feedback).toContain(
      "Password must contain at least one number",
    );
  });

  it("should fail if no special character", () => {
    const result = validatePasswordStrength("SimplePass123");
    expect(result.isValid).toBe(false);
    expect(result.feedback).toContain(
      "Password must contain at least one special character",
    );
  });
});
