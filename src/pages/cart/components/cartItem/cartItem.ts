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

const REMOVE_ACTION_WIDTH = 100;
const SWIPE_THRESHOLD = REMOVE_ACTION_WIDTH / 2;

export function renderCartItem(
  item: CartItem,
  onQuantityChange: (productId: number, delta: 1 | -1) => void,
  onRemove: (productId: number) => void,
): HTMLElement {
  let isOpen = false;
  let isDragging = false;
  let suppressClick = false;

  let pointerStartX = 0;
  let pointerStartY = 0;
  let dragStartOffset = 0;
  let currentOffset = 0;

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

  const removeButton = createElement(
    "button",
    {
      type: "button",
      className: "cart-item__remove",
      ariaLabel: `Удалить товар ${item.title} из корзины`,
      onclick: () => onRemove(item.id),
    },
    [
      createElement("span", {
        className: "cart-item__remove-text",
        textContent: "Удалить",
      }),
    ],
  );

  const action = createElement("div", { className: "cart-item__action" }, [
    removeButton,
  ]);

  const toggleButton = createElement("button", {
    type: "button",
    className: "cart-item__toggle",
    ariaLabel: `Открыть удаление товара ${item.title}`,
  });

  const trashIcon = createElement("img", {
    className: "cart-item__toggle-icon",
    src: "https://cdn-icons-png.flaticon.com/512/4387/4387398.png",
    alt: "",
  });

  const arrowIcon = createElement("span", {
    className: "cart-item__arrow-icon",
    textContent: "›",
  });

  toggleButton.append(trashIcon);

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

  const card = createElement("article", { className: "cart-item" }, [
    image,
    details,
    subtotal,
    toggleButton,
  ]);

  const updateOpenState = (open: boolean): void => {
    isOpen = open;
    currentOffset = open ? -REMOVE_ACTION_WIDTH : 0;

    card.classList.toggle("cart-item--open", open);
    card.style.transform = "";

    toggleButton.replaceChildren(open ? arrowIcon : trashIcon);

    toggleButton.setAttribute(
      "aria-label",
      open
        ? `Закрыть удаление товара ${item.title}`
        : `Открыть удаление товара ${item.title}`,
    );
  };

  toggleButton.addEventListener("click", () => {
    updateOpenState(!isOpen);
  });

  card.addEventListener("pointerdown", (event: PointerEvent) => {
    if (
      event.button !== 0 ||
      (event.target as HTMLElement).closest("button, a")
    ) {
      return;
    }

    pointerStartX = event.clientX;
    pointerStartY = event.clientY;
    dragStartOffset = currentOffset;
    isDragging = false;

    card.setPointerCapture(event.pointerId);
  });

  card.addEventListener("pointermove", (event: PointerEvent) => {
    if (!card.hasPointerCapture(event.pointerId)) {
      return;
    }

    const deltaX = event.clientX - pointerStartX;
    const deltaY = event.clientY - pointerStartY;

    if (!isDragging) {
      if (Math.abs(deltaX) < 5 || Math.abs(deltaX) < Math.abs(deltaY)) {
        return;
      }

      isDragging = true;
      card.style.transition = "none";
    }

    const nextOffset = Math.max(
      -REMOVE_ACTION_WIDTH,
      Math.min(0, dragStartOffset + deltaX),
    );

    currentOffset = nextOffset;
    card.style.transform = `translateX(${nextOffset}px)`;
  });

  const finishSwipe = (event: PointerEvent): void => {
    if (!card.hasPointerCapture(event.pointerId)) {
      return;
    }

    card.releasePointerCapture(event.pointerId);

    if (!isDragging) {
      return;
    }

    isDragging = false;
    suppressClick = true;

    card.style.transition = "";

    updateOpenState(currentOffset <= -SWIPE_THRESHOLD);

    requestAnimationFrame(() => {
      suppressClick = false;
    });
  };

  card.addEventListener("pointerup", finishSwipe);
  card.addEventListener("pointercancel", finishSwipe);

  card.addEventListener(
    "click",
    (event: MouseEvent) => {
      if (suppressClick) {
        event.preventDefault();
        event.stopPropagation();
        suppressClick = false;
      }
    },
    true,
  );

  const wrapper = createElement("div", { className: "cart-item-wrapper" }, [
    action,
    card,
  ]);

  wrapper.setAttribute("data-product-id", String(item.id));

  wrapper.style.setProperty(
    "--cart-item-action-width",
    `${REMOVE_ACTION_WIDTH}px`,
  );

  return wrapper;
}
