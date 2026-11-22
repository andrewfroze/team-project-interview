import type { Product } from "../../../../models/product";
import {
  createContainer,
  createElement,
  createParagraph,
} from "../../../../utils/elementFactory";
import { renderButton } from "../../../../components/button/button";
import { renderBadge } from "../../../../components/badge/badge";
import {
  calculateDiscountPrice,
  formatPrice,
} from "../../../../utils/formatPrice";
import "./purchasePanel.css";

export function renderPurchasePanel(product: Product): HTMLElement {
  const quantityInput = createElement("input", {
    type: "number",
    min: String(product.minimumOrderQuantity),
    max: String(product.stock),
    value: String(product.minimumOrderQuantity),
    className: "purchase-panel__quantity-input",
    ariaLabel: "Quantity",
  });

  const quantity = createContainer("purchase-panel__quantity", [
    createElement("label", {
      className: "purchase-panel__quantity-label",
      htmlFor: "purchase-quantity",
      textContent: "Quantity",
    }),
    Object.assign(quantityInput, { id: "purchase-quantity" }),
  ]);

  const addToCart = (): void => {
    const value = quantityInput.valueAsNumber;

    if (
      !Number.isInteger(value) ||
      value < product.minimumOrderQuantity ||
      value > product.stock
    ) {
      quantityInput.setCustomValidity(
        `Quantity must be between ${product.minimumOrderQuantity} and ${product.stock}`,
      );
      quantityInput.reportValidity();
      return;
    }

    quantityInput.setCustomValidity("");

    document.dispatchEvent(
      new CustomEvent("cart:add", {
        detail: { product, quantity: value },
      }),
    );
  };

  const discountPrice = calculateDiscountPrice(
    product.price,
    product.discountPercentage,
  );

  const price = createContainer("purchase-panel__price", [
    createElement("span", {
      className: "purchase-panel__current-price",
      textContent: formatPrice(discountPrice),
    }),
    createElement("span", {
      className: "purchase-panel__old-price",
      textContent: formatPrice(product.price),
    }),
    renderBadge(`-${Math.round(product.discountPercentage)}%`, "discount"),
  ]);

  return createContainer("purchase-panel", [
    price,
    createParagraph(product.availabilityStatus, "purchase-panel__availability"),
    createContainer("purchase-panel__actions", [
      quantity,
      renderButton({
        text: "Добавить в корзину",
        onClick: addToCart,
      }),
    ]),
    createParagraph(product.shippingInformation, "purchase-panel__shipping"),
    createParagraph(product.returnPolicy, "purchase-panel__returns"),
  ]);
}
