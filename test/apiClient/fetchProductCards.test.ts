import { beforeEach, afterEach, describe, expect, it, vi } from "vitest";
import { fetchProductCards } from "../../src/api/apiClient";
import { HttpError } from "../../src/api/errors/httpError";
import type { ProductCards } from "../../src/models/product";
import { NetworkError } from "../../src/api/errors/networkError";

describe("fetchProductCards", () => {
  const mockProducts: ProductCards = {
    products: [
      {
        id: 1,
        title: "Test Product",
        category: "beauty",
        price: 10,
        discountPercentage: 5,
        rating: 4.5,
        stock: 100,
        tags: ["test"],
        brand: "Test Brand",
        images: ["https://example.com/image.jpg"],
      },
    ],
    total: 1,
    skip: 0,
    limit: 20,
  };

  const mockFetch = vi.fn();

  beforeEach(() => {
    vi.stubGlobal("fetch", mockFetch);
    mockFetch.mockReset();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("should fetch product cards with default parameters", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue(mockProducts),
    });

    const result = await fetchProductCards();

    expect(mockFetch).toHaveBeenCalledOnce();

    const [url, options] = mockFetch.mock.calls[0];

    expect(url).toContain("https://dummyjson.com/products?");
    expect(options.signal).toBeInstanceOf(AbortSignal);

    const params = new URL(url).searchParams;

    expect(params.get("skip")).toBe("0");
    expect(params.get("limit")).toBe("20");
    expect(params.get("select")).toBe(
      "id,title,category,price,discountPercentage,rating,stock,tags,brand,images",
    );

    expect(result).toEqual(mockProducts);
  });

  it("should fetch product cards with custom parameters", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue(mockProducts),
    });

    await fetchProductCards(10, 5, ["id", "title", "price"]);

    const [url] = mockFetch.mock.calls[0];
    const params = new URL(url).searchParams;

    expect(params.get("skip")).toBe("10");
    expect(params.get("limit")).toBe("5");
    expect(params.get("select")).toBe("id,title,price");
  });

  it("should throw HttpError when response is not ok", async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      status: 404,
      statusText: "Not Found",
    });

    await expect(fetchProductCards()).rejects.toThrow(HttpError);
    await expect(fetchProductCards()).rejects.toThrow("Http error: 404");
  });

  it("should return parsed JSON response", async () => {
    const json = vi.fn().mockResolvedValue(mockProducts);

    mockFetch.mockResolvedValue({
      ok: true,
      json,
    });

    const result = await fetchProductCards();

    expect(json).toHaveBeenCalledOnce();
    expect(result).toEqual(mockProducts);
  });

  it("should pass custom timeout signal to fetch", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue(mockProducts),
    });

    await fetchProductCards(0, 20, ["id"], 5000);

    const [, options] = mockFetch.mock.calls[0];

    expect(options.signal).toBeInstanceOf(AbortSignal);
  });

  it("should wrap network errors into NetworkError", async () => {
    const error = new TypeError("Network error");

    mockFetch.mockRejectedValue(error);

    await expect(fetchProductCards()).rejects.toBeInstanceOf(NetworkError);
  });
});
