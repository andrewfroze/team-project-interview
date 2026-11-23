import type { CartItem } from "../../models/cart.ts";
import { createElement } from "../../utils/elementFactory.ts";
import {
  calculateDiscountPrice,
  formatPrice,
} from "../../utils/formatPrice.ts";
import { changeCartQuantity, getCartItems } from "../../cart/cartStore.ts";

import "./cart.css";

function renderCartItem(
  item: CartItem,
  onQuantityChange: (productId: number, delta: 1 | -1) => void,
): HTMLElement {
  const image = item.image
    ? createElement("img", {
        className: "cart-item__image",
        src: item.image,
        alt: item.title,
        loading: "lazy",
      })
    : createElement("div", {
        className: "cart-item__placeholder",
        textContent: "Нет фото",
      });

  image.onerror = () => {
    image.replaceWith(
      createElement("div", {
        className: "cart-item__placeholder",
        textContent: "Нет фото",
      }),
    );
  };

  const productLink = createElement("a", {
    className: "cart-item__title",
    href: `${import.meta.env.BASE_URL}product/${item.id}`,
    textContent: item.title,
  });

  const unitPrice = calculateDiscountPrice(item.price, item.discountPercentage);

  const quantityControls = createElement(
    "div",
    { className: "cart-item__quantity-controls" },
    [
      createElement("span", {
        textContent: "Количество:",
      }),
      createElement("button", {
        type: "button",
        className: "cart-item__quantity-button",
        textContent: "−",
        ariaLabel: `Уменьшить количество товара ${item.title}`,
        disabled: item.quantity === 1,
        onclick: () => onQuantityChange(item.id, -1),
      }),
      createElement("span", {
        className: "cart-item__quantity-value",
        textContent: String(item.quantity),
      }),
      createElement("button", {
        type: "button",
        className: "cart-item__quantity-button",
        textContent: "+",
        ariaLabel: `Увеличить количество товара ${item.title}`,
        onclick: () => onQuantityChange(item.id, 1),
      }),
    ],
  );

  const price = createElement("p", { className: "cart-item__price" }, [
    createElement("span", {
      textContent: "Цена за штуку:",
    }),
    createElement("strong", {
      textContent: formatPrice(unitPrice),
    }),
    createElement("s", {
      textContent: formatPrice(item.price),
    }),
  ]);

  const details = createElement("div", { className: "cart-item__details" }, [
    productLink,
    quantityControls,
    price,
  ]);

  return createElement("article", { className: "cart-item" }, [image, details]);
}

export function renderCartPage(): HTMLElement {
  const page = createElement("main", {
    className: "cart-page",
  });

  const handleQuantityChange = (productId: number, delta: 1 | -1): void => {
    const changed = changeCartQuantity(productId, delta);

    if (!changed) {
      return;
    }

    page.replaceWith(renderCartPage());
    document.dispatchEvent(new Event("cart:updated"));
  };

  const title = createElement("h1", {
    className: "cart-page__title",
    textContent: "Корзина",
  });

  page.append(title);

  const items = getCartItems();

  if (items.length === 0) {
    page.append(
      createElement("p", {
        className: "cart-page__empty",
        textContent: "Корзина пуста. Добавьте товары.",
      }),
    );

    return page;
  }

  const list = createElement("div", {
    className: "cart-page__list",
  });

  for (const item of items) {
    list.append(renderCartItem(item, handleQuantityChange));
  }

  const total = items.reduce(
    (sum: number, item: CartItem) =>
      sum +
      calculateDiscountPrice(item.price, item.discountPercentage) *
        item.quantity,
    0,
  );

  const totalElement = createElement("p", {
    className: "cart-page__total",
    textContent: `Итого: ${formatPrice(total)}`,
  });

  page.append(list, totalElement);

  return page;
}
