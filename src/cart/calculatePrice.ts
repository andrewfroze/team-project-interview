import type { CartItem } from "../models/cart.ts";
import { calculateDiscountPrice } from "../utils/formatPrice.ts";

export function calculateUnitTotalOriginal(cartItem: CartItem): number {
  return cartItem.price * cartItem.quantity;
}

export function calculateUnitTotal(cartItem: CartItem): number {
  return calculateDiscountPrice(
    calculateUnitTotalOriginal(cartItem),
    cartItem.discountPercentage,
  );
}
