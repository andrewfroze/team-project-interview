export function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
}

export function calculateDiscountPrice(
  price: number,
  discountPercentage: number,
): number {
  return price * (1 - discountPercentage / 100);
}
