import type { Product, ProductCards } from "../types/product";
import { request } from "./request";

const API_URL = "https://dummyjson.com/";
const DEFAULT_TIMEOUT = 10_000;

export async function fetchProductCards(
  skip: number = 0,
  limit: number = 20,
  select: string[] = [
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
  ],
  timeout: number = DEFAULT_TIMEOUT,
): Promise<ProductCards> {
  const params = new URLSearchParams({
    skip: String(skip),
    limit: String(limit),
    select: select.join(","),
  });

  return request<ProductCards>(`${API_URL}products?${params}`, timeout);
}

export async function fetchProductDetails(
  id: number,
  timeout: number = DEFAULT_TIMEOUT,
): Promise<Product> {
  return request<Product>(`${API_URL}products/${id}`, timeout);
}
