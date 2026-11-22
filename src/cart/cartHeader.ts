import { createElement } from "../utils/elementFactory";
import { getCartCount } from "./cartStore";

export function renderCartHeader(): HTMLElement {
  const homeLink = createElement("a", {
    href: import.meta.env.BASE_URL,
    className: "cart-header__home",
    textContent: "Главная",
  });

  const cartLink = createElement("a", {
    href: `${import.meta.env.BASE_URL}cart`,
    className: "cart-header__link",
  });

  const updateCounter = (): void => {
    cartLink.textContent = `Корзина (${getCartCount()})`;
  };

  updateCounter();

  document.addEventListener("cart:updated", updateCounter);

  return createElement("header", { className: "cart-header" }, [
    homeLink,
    cartLink,
  ]);
}
