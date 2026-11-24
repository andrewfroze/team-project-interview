import { createElement } from "../../utils/elementFactory";
import { formatPrice } from "../../utils/formatPrice";
import {
  changeCartQuantity,
  getCartItems,
  removeCartItem,
} from "../../cart/cartStore";
import {
  calculateUnitTotal,
  calculateUnitTotalOriginal,
} from "../../cart/calculatePrice";
import { renderCartItem } from "./components/cartItem/cartItem";

import "./cart.css";
import { showToast } from "../../components/toast/toast.ts";

export function renderCartPage(): HTMLElement {
  const page = createElement("main", {
    className: "cart-page",
  });

  const title = createElement("h1", {
    className: "cart-page__title",
    textContent: "Корзина",
    tabIndex: -1,
  });

  const list = createElement("div", {
    className: "cart-page__list",
  });

  const totalOriginalValue = createElement("s");
  const totalDiscountedValue = createElement("strong");
  const savingsValue = createElement("span");

  const totalElement = createElement("div", { className: "cart-page__total" }, [
    createElement("div", { className: "cart-page__total-original" }, [
      createElement("span", {
        textContent: "Полная стоимость:",
      }),
      totalOriginalValue,
    ]),
    createElement("div", { className: "cart-page__total-discounted" }, [
      createElement("span", {
        textContent: "Итого со скидкой:",
      }),
      totalDiscountedValue,
    ]),
    createElement("p", { className: "cart-page__savings" }, [
      "Ваша экономия: ",
      savingsValue,
    ]),
  ]);

  page.append(title, list, totalElement);

  const updateCartSummary = (): void => {
    const items = getCartItems();

    const totalOriginal = items.reduce(
      (sum, item) => sum + calculateUnitTotalOriginal(item),
      0,
    );

    const totalDiscounted = items.reduce(
      (sum, item) => sum + calculateUnitTotal(item),
      0,
    );

    totalOriginalValue.textContent = formatPrice(totalOriginal);
    totalDiscountedValue.textContent = formatPrice(totalDiscounted);
    savingsValue.textContent = formatPrice(totalOriginal - totalDiscounted);
  };

  const updateEmptyState = (): void => {
    if (getCartItems().length === 0) {
      list.replaceChildren(
        createElement("p", {
          className: "cart-page__empty",
          textContent: "Корзина пуста. Добавьте товары.",
        }),
      );
    }
  };

  const handleQuantityChange = (productId: number, delta: 1 | -1): void => {
    const changed = changeCartQuantity(productId, delta);

    if (!changed) {
      return;
    }

    page.replaceWith(renderCartPage());

    document.dispatchEvent(new Event("cart:updated"));
  };

  const handleRemove = (productId: number): void => {
    const itemElement = list.querySelector<HTMLElement>(
      `[data-product-id="${productId}"]`,
    );

    if (!removeCartItem(productId)) {
      return;
    }

    const shouldRestoreFocus =
      itemElement && document.activeElement
        ? itemElement.contains(document.activeElement)
        : false;

    const itemElements = Array.from(
      list.querySelectorAll<HTMLElement>(".cart-item-wrapper"),
    );

    const removedIndex = itemElements.indexOf(itemElement!);

    const nextItem =
      itemElements[removedIndex + 1] ?? itemElements[removedIndex - 1];

    itemElement?.remove();

    updateEmptyState();
    updateCartSummary();

    if (shouldRestoreFocus) {
      const nextToggle =
        nextItem?.querySelector<HTMLButtonElement>(".cart-item__toggle");

      if (nextToggle) {
        nextToggle.focus();
      } else {
        title.focus();
      }
    }

    showToast("Товар удален!", "success");
    document.dispatchEvent(new Event("cart:updated"));
  };

  const items = getCartItems();

  if (items.length === 0) {
    updateEmptyState();
  } else {
    list.replaceChildren();

    for (const item of items) {
      list.append(renderCartItem(item, handleQuantityChange, handleRemove));
    }
  }

  updateCartSummary();

  return page;
}
