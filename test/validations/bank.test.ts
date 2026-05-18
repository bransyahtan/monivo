import { describe, expect, it } from "vitest";
import { bankSchema } from "@/lib/validations/bank";

describe("bankSchema", () => {
  const validBank = {
    name: "Bank Central Asia",
    type: "bank",
  };

  const validEWallet = {
    name: "GoPay",
    type: "e-wallet",
  };

  const validCash = {
    name: "Physical Cash Wallet",
    type: "cash",
  };

  it("should pass validation with valid bank data", () => {
    const result = bankSchema.safeParse(validBank);
    expect(result.success).toBe(true);
  });

  it("should pass validation with valid e-wallet data", () => {
    const result = bankSchema.safeParse(validEWallet);
    expect(result.success).toBe(true);
  });

  it("should pass validation with valid cash data", () => {
    const result = bankSchema.safeParse(validCash);
    expect(result.success).toBe(true);
  });

  it("should fail validation if the bank name is empty", () => {
    const result = bankSchema.safeParse({
      ...validBank,
      name: "",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      expect(fieldErrors.name).toContain("Bank name is required");
    }
  });

  it("should fail validation if the bank name is only whitespace", () => {
    const result = bankSchema.safeParse({
      ...validBank,
      name: "     ",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      expect(fieldErrors.name).toContain("Bank name is required");
    }
  });

  it("should fail validation if the bank name is too long (over 255 characters)", () => {
    const extremelyLongName = "A".repeat(256);
    const result = bankSchema.safeParse({
      ...validBank,
      name: extremelyLongName,
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      expect(fieldErrors.name).toContain(
        "Bank name is too long (maximum 255 characters)",
      );
    }
  });

  it("should fail validation if the type is invalid", () => {
    const result = bankSchema.safeParse({
      ...validBank,
      type: "credit-card",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      expect(fieldErrors.type).toContain(
        "Bank type must be either bank, e-wallet, or cash",
      );
    }
  });
});
