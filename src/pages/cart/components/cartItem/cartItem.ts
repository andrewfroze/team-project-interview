import { createElement } from "../../../../utils/elementFactory.ts";
import {
  calculateDiscountPrice,
  formatPrice,
} from "../../../../utils/formatPrice.ts";
import {
  calculateUnitTotal,
  calculateUnitTotalOriginal,
} from "../../../../cart/calculatePrice.ts";
import type { CartItem } from "../../../../models/cart.ts";
import "./cartItem.css";

export function renderCartItem(
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

  const subtotal = createElement("div", { className: "cart-item__subtotal" }, [
    createElement("strong", {
      className: "cart-item__subtotal-current",
      textContent: formatPrice(calculateUnitTotal(item)),
    }),
    ...(item.discountPercentage > 0
      ? [
          createElement("s", {
            className: "cart-item__subtotal-original",
            textContent: formatPrice(calculateUnitTotalOriginal(item)),
          }),
        ]
      : []),
  ]);

  const details = createElement("div", { className: "cart-item__details" }, [
    productLink,
    quantityControls,
    price,
  ]);

  return createElement("article", { className: "cart-item" }, [
    image,
    details,
    subtotal,
  ]);
}
