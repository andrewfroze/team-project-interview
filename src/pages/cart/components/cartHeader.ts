import { createElement, createImage } from "../../../utils/elementFactory.ts";
import { getCartCount } from "../../../cart/cartStore.ts";
import "./cartHeader.css";

export function renderCartHeaderIcon(): HTMLElement {
  const cartCounter = createElement("span", {
    className: "cart-icon__counter",
  });

  const cartLink = createElement(
    "a",
    {
      href: `${import.meta.env.BASE_URL}cart`,
      className: "cart-header__link",
    },
    [
      createImage(
        "https://cdn-icons-png.flaticon.com/512/1374/1374128.png",
        "cart",
        "cart-icon",
      ),
      cartCounter,
    ],
  );

  const updateCounter = (): void => {
    const count = getCartCount();
    cartCounter.textContent = String(count);
    cartCounter.style = `display: ${count > 0 ? "flex" : "none"}`;
  };

  updateCounter();

  document.addEventListener("cart:updated", updateCounter);

  return cartLink;
}
