import type { Product } from "../models/product";
import type { CartItem } from "../models/cart";
import { isCartItem } from "../validators/cartValidator";

const STORAGE_KEY = "shop-cart";

export interface CartItem {
  id: number;
  title: string;
  image: string;
  price: number;
  discountPercentage: number;
  quantity: number;
}

function loadCart(): CartItem[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (!saved) {
      return [];
    }

    const data: unknown = JSON.parse(saved);

    if (!Array.isArray(data)) {
      return [];
    }

    return data.filter(isCartItem);
  } catch {
    return [];
  }
}

const cartItems: CartItem[] = loadCart();

function saveCart(): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cartItems));
  } catch {
    // Если сохранение недоступно, корзина работает в памяти.
  }
}

export function addToCart(product: Product, quantity: number): void {
  if (!Number.isSafeInteger(quantity) || quantity <= 0) {
    return;
  }

  const existingItem = cartItems.find((item) => item.id === product.id);

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cartItems.push({
      id: product.id,
      title: product.title,
      image: product.thumbnail || product.images[0] || "",
      price: product.price,
      discountPercentage: product.discountPercentage,
      quantity,
    });
  }

  saveCart();
}

export function getCartItems(): CartItem[] {
  return cartItems.map((item) => ({ ...item }));
}

export function getCartCount(): number {
  return cartItems.reduce((total, item) => total + item.quantity, 0);
}
