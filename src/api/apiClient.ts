import type { Product, ProductCards } from "../types/product";
import { HttpError } from "./errors/httpError";

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
  const timeoutSignal = AbortSignal.timeout(timeout);

  const params = new URLSearchParams({
    skip: String(skip),
    limit: String(limit),
    select: select.join(","),
  });

  const response = await fetch(`${API_URL}products?${params}`, {
    signal: timeoutSignal,
  });

  if (!response.ok) {
    throw new HttpError(response.status, `Http error: ${response.statusText}`);
  }

  return response.json() as Promise<ProductCards>;
}

export async function fetchProductDetails(
  id: number,
  timeout: number = DEFAULT_TIMEOUT,
): Promise<Product> {
  const timeoutSignal = AbortSignal.timeout(timeout);

  const response = await fetch(`${API_URL}products/${id}`, {
    signal: timeoutSignal,
  });

  if (!response.ok) {
    throw new HttpError(response.status, `Http error: ${response.statusText}`);
  }

  return response.json() as Promise<Product>;
}
