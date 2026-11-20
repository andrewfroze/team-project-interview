import type { Product } from "../../models/product";
import {
  createContainer,
  createElement,
  createHeading,
} from "../../utils/elementFactory";

import { renderProductGallery } from "./components/product-gallery/productGallery";
import { renderProductInfo } from "./components/product-info/productInfo";
import { renderSpecifications } from "./components/specifications/specifications";
import { renderReviews } from "./components/reviews/reviews";

import "./productDetails.css";

export function renderProductDetails(product: Product): HTMLElement {
  const overview = createElement(
    "section",
    {
      className: "product-details__overview",
    },
    [renderProductGallery(product), renderProductInfo(product)],
  );

  return createElement(
    "main",
    {
      className: "product-details",
    },
    [
      overview,
      createContainer("overview", [
        createHeading("Overview", 2, "product-details__section-title"),
        renderSpecifications(product),
      ]),
      createContainer("reviews", [
        createHeading("Reviews", 2, "product-details__section-title"),
        renderReviews(product),
      ]),
    ],
  );
}
