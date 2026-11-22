import { createElement } from "../utils/elementFactory";
import { changeCartQuantity, getCartItems } from "./cartStore";

function formatCartPrice(price: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
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

    const unitPrice = item.price * (1 - item.discountPercentage / 100);

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
          onclick: () => handleQuantityChange(item.id, -1),
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
          onclick: () => handleQuantityChange(item.id, 1),
        }),
      ],
    );

    const details = createElement("div", { className: "cart-item__details" }, [
      productLink,
      quantityControls,
      createElement("p", {
        className: "cart-item__price",
        textContent: `Цена за штуку: ${formatCartPrice(unitPrice)}`,
      }),
    ]);

    list.append(
      createElement("article", { className: "cart-item" }, [image, details]),
    );
  }

  const total = items.reduce(
    (sum, item) =>
      sum + item.price * (1 - item.discountPercentage / 100) * item.quantity,
    0,
  );

  const totalElement = createElement("p", {
    className: "cart-page__total",
    textContent: `Итого: ${formatCartPrice(total)}`,
  });

  page.append(list, totalElement);

  return page;
}
