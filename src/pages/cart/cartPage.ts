import { createElement } from "../../utils/elementFactory";
import { formatPrice } from "../../utils/formatPrice";
import {
  changeCartQuantity,
  getCartItems,
  removeCartItem,
} from "../../cart/cartStore";

import "./cart.css";
import {
  calculateUnitTotal,
  calculateUnitTotalOriginal,
} from "../../cart/calculatePrice";
import { renderCartItem } from "./components/cartItem/cartItem";

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

  const handleRemove = (productId: number): void => {
    const removed = removeCartItem(productId);

    if (!removed) {
      return;
    }

    const itemElement = list.querySelector<HTMLElement>(
      `[data-product-id="${productId}"]`,
    );

    itemElement?.remove();

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
    list.append(renderCartItem(item, handleQuantityChange, handleRemove));
  }

  const totalOriginal = items.reduce(
    (sum, item) => sum + calculateUnitTotalOriginal(item),
    0,
  );

  const totalDiscounted = items.reduce(
    (sum, item) => sum + calculateUnitTotal(item),
    0,
  );

  const totalElement = createElement("div", { className: "cart-page__total" }, [
    createElement(
      "div",
      {
        className: "cart-page__total-original",
      },
      [
        createElement("span", {
          textContent: "Полная стоимость:",
        }),
        createElement("s", {
          textContent: formatPrice(totalOriginal),
        }),
      ],
    ),
    createElement(
      "div",
      {
        className: "cart-page__total-discounted",
      },
      [
        createElement("span", {
          textContent: "Итого со скидкой:",
        }),
        createElement("strong", {
          textContent: formatPrice(totalDiscounted),
        }),
      ],
    ),
    createElement("p", {
      className: "cart-page__savings",
      textContent: `Ваша экономия: ${formatPrice(totalOriginal - totalDiscounted)}`,
    }),
  ]);

  page.append(list, totalElement);

  return page;
}
