import type { ProductCategory } from "../../models/category";

export function isProductCategory(value: unknown): value is ProductCategory {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  return (
    "slug" in value &&
    typeof value.slug === "string" &&
    "name" in value &&
    typeof value.name === "string" &&
    "url" in value &&
    typeof value.url === "string"
  );
}
