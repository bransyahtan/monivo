import { describe, expect, it } from "vitest";
import { categorySchema } from "@/lib/validations/category";

describe("categorySchema", () => {
  const validCategory = {
    name: "Food & Beverage",
    slug: "food-beverage",
  };

  it("should pass validation with valid data", () => {
    const result = categorySchema.safeParse(validCategory);
    expect(result.success).toBe(true);
  });

  it("should fail if the name is empty", () => {
    const result = categorySchema.safeParse({
      ...validCategory,
      name: "",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      expect(fieldErrors.name).toContain("Category name is required");
    }
  });

  it("should fail if the slug is uppercase", () => {
    const result = categorySchema.safeParse({
      ...validCategory,
      slug: "FOOD-BEVERAGE",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      expect(fieldErrors.slug?.[0]).toContain(
        "Slug must contain only lowercase letters",
      );
    }
  });

  it("should fail if the slug contains spaces", () => {
    const result = categorySchema.safeParse({
      ...validCategory,
      slug: "food beverage",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      expect(fieldErrors.slug?.[0]).toContain(
        "Slug must contain only lowercase letters",
      );
    }
  });

  it("should fail if the slug contains consecutive dashes", () => {
    const result = categorySchema.safeParse({
      ...validCategory,
      slug: "food--beverage",
    });
    expect(result.success).toBe(false);
  });
});
