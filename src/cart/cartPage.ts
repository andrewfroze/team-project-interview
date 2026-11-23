import { createElement } from "../utils/elementFactory";
import { getCartItems } from "./cartStore";
import type { CartItem } from "../models/cart";
import { calculateDiscountPrice, formatPrice } from "../utils/formatPrice";

function renderCartItem(item: CartItem): HTMLElement {
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

  const details = createElement("div", { className: "cart-item__details" }, [
    productLink,
    createElement("p", {
      className: "cart-item__quantity",
      textContent: `Количество: ${item.quantity}`,
    }),

    createElement("p", { className: "cart-item__price" }, [
      createElement("span", {
        textContent: "Цена за штуку:",
      }),
      createElement("strong", {
        textContent: formatPrice(unitPrice),
      }),
      createElement("s", {
        textContent: formatPrice(item.price),
      }),
    ]),
  ]);

  return createElement("article", { className: "cart-item" }, [image, details]);
}

export function renderCartPage(): HTMLElement {
  const page = createElement("main", {
    className: "cart-page",
  });

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
    list.append(renderCartItem(item));
  }

  const total = items.reduce(
    (sum, item) =>
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
