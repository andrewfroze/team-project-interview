import type { Product } from "../models/product";

const STORAGE_KEY = "shop-cart";

export interface CartItem {
  id: number;
  title: string;
  image: string;
  price: number;
  discountPercentage: number;
  quantity: number;
}

function isCartItem(value: unknown): value is CartItem {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return false;
  }

  const item = value as Record<string, unknown>;

  return (
    typeof item.id === "number" &&
    Number.isSafeInteger(item.id) &&
    item.id > 0 &&
    typeof item.title === "string" &&
    item.title.trim().length > 0 &&
    typeof item.image === "string" &&
    typeof item.price === "number" &&
    Number.isFinite(item.price) &&
    item.price >= 0 &&
    typeof item.discountPercentage === "number" &&
    Number.isFinite(item.discountPercentage) &&
    item.discountPercentage >= 0 &&
    item.discountPercentage <= 100 &&
    typeof item.quantity === "number" &&
    Number.isSafeInteger(item.quantity) &&
    item.quantity > 0
  );
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
