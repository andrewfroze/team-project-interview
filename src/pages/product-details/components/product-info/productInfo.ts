import type { Product } from "../../../../models/product";
import {
  createContainer,
  createElement,
  createHeading,
  createParagraph,
} from "../../../../utils/elementFactory";
import { renderBadge } from "../../../../components/badge/badge";
import { renderPurchasePanel } from "../purchase-panel/purchasePanel";
import "./productInfo.css";

export function renderProductInfo(product: Product): HTMLElement {
  const brand = product.brand
    ? createParagraph(product.brand, "product-info__brand")
    : null;

  const rating = createContainer("product-info__rating", [
    createElement("span", {
      textContent: "★",
      className: "product-info__rating-star",
    }),
    createElement("span", {
      className: "product-info__rating-value",
      textContent: product.rating.toFixed(1),
    }),
    createElement("span", {
      textContent: `(${product.reviews.length} reviews)`,
      className: "product-info__review-count",
    }),
  ]);

  const tags = createContainer(
    "product-info__tags",
    product.tags.map((tag) => renderBadge(tag)),
  );

  return createContainer("product-info", [
    ...(brand ? [brand] : []),
    createHeading(product.title, 1, "product-info__title"),
    rating,
    createParagraph(product.description, "product-info__description"),
    tags,
    renderPurchasePanel(product),
  ]);
}
