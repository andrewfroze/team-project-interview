import type { ProductCategory } from "../models/category";
import type { Product, ProductCards } from "../models/product";
import { request } from "./request";
import { isProductCategory } from "./validators/categoryValidator";
import { isProduct, isProductCards } from "./validators/productValidator";

const API_URL = "https://dummyjson.com/";
const DEFAULT_TIMEOUT = 10_000;

const DEFAULT_SELECT_FIELDS: readonly string[] = Object.freeze([
  "id",
  "title",
  "category",
  "price",
  "discountPercentage",
  "rating",
  "stock",
  "tags",
  "brand",
  "images",
]);

export async function fetchProductCards(
  category?: string,
  skip: number = 0,
  limit: number = 20,
  select: readonly string[] = DEFAULT_SELECT_FIELDS,
  timeout: number = DEFAULT_TIMEOUT,
): Promise<ProductCards> {
  const params = new URLSearchParams({
    skip: String(skip),
    limit: String(limit),
    select: select.join(","),
  });

  const path = "products" + (category ? `/category/${category}` : "");

  return request<ProductCards>(
    `${API_URL}${path}?${params}`,
    timeout,
    isProductCards,
  );
}

export async function fetchProductDetails(
  id: number,
  timeout: number = DEFAULT_TIMEOUT,
): Promise<Product> {
  return request<Product>(`${API_URL}products/${id}`, timeout, isProduct);
}

export async function fetchCategories(): Promise<ProductCategory[]> {
  const response = await fetch(`${API_URL}/products/categories`);

  if (!response.ok) {
    throw new Error("Failed to fetch product categories");
  }

  const data: unknown = await response.json();

  if (!Array.isArray(data) || !data.every(isProductCategory)) {
    throw new Error("Invalid categories response");
  }

  return data;
}

export async function searchProducts(
  query: string,
  skip: number = 0,
  limit: number = 20,
  signal?: AbortSignal,
  select: readonly string[] = DEFAULT_SELECT_FIELDS,
  timeout: number = DEFAULT_TIMEOUT,
): Promise<ProductCards> {
  const params = new URLSearchParams({
    q: query,
    skip: String(skip),
    limit: String(limit),
    select: select.join(","),
  });

  const timeoutSignal = AbortSignal.timeout(timeout);
  const combinedSignal = signal
    ? AbortSignal.any([signal, timeoutSignal])
    : timeoutSignal;

  return request<ProductCards>(
    `${API_URL}products/search?${params}`,
    timeout,
    isProductCards,
    combinedSignal,
  );
}
