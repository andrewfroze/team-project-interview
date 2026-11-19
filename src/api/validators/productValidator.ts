import type { Product, ProductCard, ProductCards } from "../../types/product";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isStringArray(value: unknown): value is string[] {
  return (
    Array.isArray(value) && value.every((item) => typeof item === "string")
  );
}

function isOptionalString(value: unknown): boolean {
  return value === undefined || typeof value === "string";
}

export function isProductCard(value: unknown): value is ProductCard {
  return (
    isRecord(value) &&
    typeof value.id === "number" &&
    typeof value.title === "string" &&
    typeof value.category === "string" &&
    typeof value.price === "number" &&
    typeof value.discountPercentage === "number" &&
    typeof value.rating === "number" &&
    typeof value.stock === "number" &&
    isStringArray(value.tags) &&
    isOptionalString(value.brand) &&
    isStringArray(value.images)
  );
}

export function isProductCards(value: unknown): value is ProductCards {
  return (
    isRecord(value) &&
    Array.isArray(value.products) &&
    value.products.every(isProductCard) &&
    typeof value.total === "number" &&
    typeof value.skip === "number" &&
    typeof value.limit === "number"
  );
}

export function isProduct(value: unknown): value is Product {
  return (
    isRecord(value) &&
    typeof value.id === "number" &&
    typeof value.title === "string" &&
    typeof value.description === "string" &&
    typeof value.category === "string" &&
    typeof value.price === "number" &&
    typeof value.discountPercentage === "number" &&
    typeof value.rating === "number" &&
    typeof value.stock === "number" &&
    isStringArray(value.tags) &&
    isOptionalString(value.brand) &&
    typeof value.sku === "string" &&
    typeof value.weight === "number" &&
    isRecord(value.dimensions) &&
    typeof value.dimensions.width === "number" &&
    typeof value.dimensions.height === "number" &&
    typeof value.dimensions.depth === "number" &&
    typeof value.warrantyInformation === "string" &&
    typeof value.shippingInformation === "string" &&
    typeof value.availabilityStatus === "string" &&
    Array.isArray(value.reviews) &&
    value.reviews.every(isReview) &&
    typeof value.returnPolicy === "string" &&
    typeof value.minimumOrderQuantity === "number" &&
    isMeta(value.meta) &&
    typeof value.thumbnail === "string" &&
    isStringArray(value.images)
  );
}

function isReview(value: unknown): boolean {
  return (
    isRecord(value) &&
    typeof value.rating === "number" &&
    typeof value.comment === "string" &&
    typeof value.date === "string" &&
    typeof value.reviewerName === "string" &&
    typeof value.reviewerEmail === "string"
  );
}

function isMeta(value: unknown): boolean {
  return (
    isRecord(value) &&
    typeof value.createdAt === "string" &&
    typeof value.updatedAt === "string" &&
    typeof value.barcode === "string" &&
    typeof value.qrCode === "string"
  );
}
