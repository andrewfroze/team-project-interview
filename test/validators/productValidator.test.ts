import { describe, expect, it } from "vitest";

import { isProductCard } from "../../src/api/validators/productValidator";

describe("isProductCard", () => {
  const validProduct = {
    id: 1,
    title: "Apple",
    category: "groceries",
    price: 1.99,
    discountPercentage: 12.62,
    rating: 4.19,
    stock: 8,
    tags: ["fruits"],
    images: ["https://example.com/apple.webp"],
  };

  it("should accept product with string brand", () => {
    expect(isProductCard({ ...validProduct, brand: "Apple" })).toBe(true);
  });

  it("should accept product with null brand", () => {
    expect(isProductCard({ ...validProduct, brand: null })).toBe(true);
  });

  it("should accept product without brand", () => {
    expect(isProductCard(validProduct)).toBe(true);
  });

  it("should reject product with invalid brand type", () => {
    expect(isProductCard({ ...validProduct, brand: 123 })).toBe(false);
  });
});
