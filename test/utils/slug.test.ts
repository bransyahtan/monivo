import { slugify } from "@/lib/utils/slug";
import { describe, expect, it } from "vitest";

describe("slugify", () => {
  it("should convert text to lowercase", () => {
    expect(slugify("HELLO WORLD")).toBe("hello-world");
  });

  it("should replace spaces with dashes", () => {
    expect(slugify("hello world")).toBe("hello-world");
  });

  it("should remove non-alphanumeric characters", () => {
    expect(slugify("hello@world!")).toBe("helloworld");
  });

  it("should trim leading and trailing dashes", () => {
    expect(slugify("---hello world---")).toBe("hello-world");
  });

  it("should collapse multiple dashes", () => {
    expect(slugify("hello   world")).toBe("hello-world");
  });
});
