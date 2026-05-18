import { describe, expect, it } from "vitest";
import { slugify } from "@/lib/utils/slug";

describe("slugify", () => {
  it("should convert uppercase string to lowercase", () => {
    expect(slugify("BANK CENTRAL ASIA")).toBe("bank-central-asia");
  });

  it("should replace spaces with dashes", () => {
    expect(slugify("Bank Central Asia")).toBe("bank-central-asia");
  });

  it("should strip out special characters", () => {
    expect(slugify("Mandiri!!! @123")).toBe("mandiri-123");
  });

  it("should collapse multiple consecutive dashes", () => {
    expect(slugify("Cash -- Wallet")).toBe("cash-wallet");
  });

  it("should trim dashes from the start and end", () => {
    expect(slugify("-BCA-")).toBe("bca");
  });

  it("should handle empty or whitespace inputs gracefully", () => {
    expect(slugify("   ")).toBe("");
  });
});
