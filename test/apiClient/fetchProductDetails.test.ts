import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { fetchProductDetails } from "../../src/api/apiClient";
import { HttpError } from "../../src/api/errors/httpError";
import type { Product } from "../../src/models/product";
import { ApiError } from "../../src/api/errors/apiError";
import { NetworkError } from "../../src/api/errors/networkError";
import { TimeoutError } from "../../src/api/errors/timeoutError";

describe("fetchProductDetails", () => {
  const mockProduct: Product = {
    id: 1,
    title: "Test Product",
    description: "Test description",
    category: "beauty",
    price: 10,
    discountPercentage: 5,
    rating: 4.5,
    stock: 100,
    tags: ["test"],
    brand: "Test Brand",
    sku: "TEST-001",
    weight: 1,
    dimensions: {
      width: 10,
      height: 20,
      depth: 5,
    },
    warrantyInformation: "1 year warranty",
    shippingInformation: "Ships in 2 days",
    availabilityStatus: "In Stock",
    reviews: [
      {
        rating: 5,
        comment: "Great product",
        date: "2024-05-23T08:56:21.618Z",
        reviewerName: "John Doe",
        reviewerEmail: "john@example.com",
      },
    ],
    returnPolicy: "30 days return policy",
    minimumOrderQuantity: 1,
    meta: {
      createdAt: "2024-05-23T08:56:21.618Z",
      updatedAt: "2024-05-23T08:56:21.618Z",
      barcode: "9164035109868",
      qrCode: "https://example.com/qr",
    },
    thumbnail: "https://example.com/thumbnail.jpg",
    images: ["https://example.com/image.jpg"],
  };

  const mockFetch = vi.fn();

  beforeEach(() => {
    vi.stubGlobal("fetch", mockFetch);
    mockFetch.mockReset();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("should fetch product details by id", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue(mockProduct),
    });

    const result = await fetchProductDetails(1);

    expect(mockFetch).toHaveBeenCalledOnce();
    expect(mockFetch).toHaveBeenCalledWith(
      "https://dummyjson.com/products/1",
      expect.objectContaining({
        signal: expect.any(AbortSignal),
      }),
    );

    expect(result).toEqual(mockProduct);
  });

  it("should throw HttpError when response is not ok", async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      status: 404,
      statusText: "Not Found",
    });

    await expect(fetchProductDetails(999)).rejects.toThrow(HttpError);
    await expect(fetchProductDetails(999)).rejects.toThrow("Http error: 404");
  });

  it("should return parsed JSON response", async () => {
    const json = vi.fn().mockResolvedValue(mockProduct);

    mockFetch.mockResolvedValue({
      ok: true,
      json,
    });

    const result = await fetchProductDetails(1);

    expect(json).toHaveBeenCalledOnce();
    expect(result).toEqual(mockProduct);
  });

  it("should pass custom timeout signal to fetch", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue(mockProduct),
    });

    await fetchProductDetails(1, 5000);

    const [, options] = mockFetch.mock.calls[0];

    expect(options.signal).toBeInstanceOf(AbortSignal);
  });

  it("should throw ApiError when response contains invalid JSON", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      json: vi.fn().mockRejectedValue(new SyntaxError("Unexpected token")),
    } as unknown as Response);

    await expect(fetchProductDetails(1)).rejects.toBeInstanceOf(ApiError);
  });

  it("should wrap network errors into NetworkError", async () => {
    const error = new TypeError("Network error");

    mockFetch.mockRejectedValue(error);

    await expect(fetchProductDetails(1)).rejects.toBeInstanceOf(NetworkError);
  });

  it("should throw TimeoutError when request times out", async () => {
    const error = new DOMException("The operation was aborted", "AbortError");

    mockFetch.mockRejectedValue(error);

    await expect(fetchProductDetails(1)).rejects.toBeInstanceOf(TimeoutError);
  });
});
