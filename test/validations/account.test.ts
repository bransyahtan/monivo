import { accountSchema } from "@/lib/validations/account";
import { describe, expect, it } from "vitest";

describe("accountSchema", () => {
  const validAccount = {
    bank_id: "1",
    account_name: "Savings Account",
    balance: "1000000",
  };

  it("should pass validation with valid data", () => {
    const result = accountSchema.safeParse(validAccount);
    expect(result.success).toBe(true);
  });

  it("should fail if account_name is empty", () => {
    const result = accountSchema.safeParse({
      ...validAccount,
      account_name: "",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.account_name).toBeDefined();
    }
  });

  it("should fail if bank_id is not selected (zero or negative)", () => {
    const result = accountSchema.safeParse({
      ...validAccount,
      bank_id: "0",
    });
    expect(result.success).toBe(false);
  });

  it("should fail if balance is negative", () => {
    const result = accountSchema.safeParse({
      ...validAccount,
      balance: "-500",
    });
    expect(result.success).toBe(false);
  });

  it("should coerce string values to numbers", () => {
    const result = accountSchema.safeParse(validAccount);
    if (result.success) {
      expect(typeof result.data.bank_id).toBe("number");
      expect(typeof result.data.balance).toBe("number");
      expect(result.data.balance).toBe(1000000);
    }
  });
});
