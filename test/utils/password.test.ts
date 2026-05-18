import { describe, expect, it } from "vitest";
import { validatePasswordStrength } from "@/lib/utils/password";

describe("validatePasswordStrength", () => {
  it("should return invalid for passwords shorter than 8 characters", () => {
    const result = validatePasswordStrength("Short1!");
    expect(result.isValid).toBe(false);
    expect(result.feedback).toContain(
      "Password must be at least 8 characters long",
    );
  });

  it("should return invalid if it lacks an uppercase letter", () => {
    const result = validatePasswordStrength("nouppercase1!");
    expect(result.isValid).toBe(false);
    expect(result.feedback).toContain(
      "Password must contain at least one uppercase letter",
    );
  });

  it("should return invalid if it lacks a lowercase letter", () => {
    const result = validatePasswordStrength("NOLOWERCASE1!");
    expect(result.isValid).toBe(false);
    expect(result.feedback).toContain(
      "Password must contain at least one lowercase letter",
    );
  });

  it("should return invalid if it lacks a number", () => {
    const result = validatePasswordStrength("NoNumbers!");
    expect(result.isValid).toBe(false);
    expect(result.feedback).toContain(
      "Password must contain at least one number",
    );
  });

  it("should return invalid if it lacks a special character", () => {
    const result = validatePasswordStrength("NoSpecialChar1");
    expect(result.isValid).toBe(false);
    expect(result.feedback).toContain(
      "Password must contain at least one special character",
    );
  });

  it("should return valid for a strong password", () => {
    const result = validatePasswordStrength("StrongP@ss123");
    expect(result.isValid).toBe(true);
    expect(result.feedback).toHaveLength(0);
  });
});
