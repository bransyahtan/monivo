import { transactionSchema } from "@/lib/validations/transaction";
import { describe, expect, it } from "vitest";

describe("transactionSchema", () => {
  const validTransaction = {
    type: "expense",
    amount: "50000",
    category_id: "1",
    description: "Lunch at Office",
    transaction_date: "2026-05-24T18:00:00Z",
  };

  it("should pass validation with valid data", () => {
    const result = transactionSchema.safeParse(validTransaction);
    expect(result.success).toBe(true);
  });

  it("should fail if type is invalid", () => {
    const result = transactionSchema.safeParse({
      ...validTransaction,
      type: "invalid_type",
    });
    expect(result.success).toBe(false);
  });

  it("should fail if amount is zero or negative", () => {
    const resultZero = transactionSchema.safeParse({
      ...validTransaction,
      amount: "0",
    });
    expect(resultZero.success).toBe(false);

    const resultNegative = transactionSchema.safeParse({
      ...validTransaction,
      amount: "-100",
    });
    expect(resultNegative.success).toBe(false);
  });

  it("should coerce string amount to number", () => {
    const result = transactionSchema.safeParse(validTransaction);
    if (result.success) {
      expect(typeof result.data.amount).toBe("number");
      expect(result.data.amount).toBe(50000);
    }
  });

  it("should accept optional category_id as null or undefined", () => {
    const noCategory = { ...validTransaction };
    delete (noCategory as Partial<typeof validTransaction>).category_id;
    const result1 = transactionSchema.safeParse(noCategory);
    expect(result1.success).toBe(true);

    const nullCategory = { ...validTransaction, category_id: null };
    const result2 = transactionSchema.safeParse(nullCategory);
    expect(result2.success).toBe(true);
  });

  it("should provide default transaction_date if missing", () => {
    const noDate = {
      type: "income",
      amount: 1000,
    };
    const result = transactionSchema.safeParse(noDate);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.transaction_date).toBeDefined();
    }
  });
});
