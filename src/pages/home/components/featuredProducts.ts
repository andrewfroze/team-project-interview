import { createProductCard } from "../../../components/productCard/productCard";
import type { ProductCard } from "../../../models/product";
import { createElement, createLink } from "../../../utils/elementFactory";

import "./featuredProducts.css";

function renderCarousel(products: ProductCard[]): HTMLElement {
  const track = createElement(
    "div",
    { className: "featured-products__track" },
    products.map(createProductCard),
  );

  const previousButton = createElement("button", {
    type: "button",
    className: "featured-products__arrow",
    textContent: "←",
    ariaLabel: "Previous products",
  });

  const nextButton = createElement("button", {
    type: "button",
    className: "featured-products__arrow",
    textContent: "→",
    ariaLabel: "Next products",
  });

  previousButton.addEventListener("click", () => {
    track.scrollBy({
      left: -track.clientWidth * 0.8,
      behavior: "smooth",
    });
  });

  nextButton.addEventListener("click", () => {
    track.scrollBy({
      left: track.clientWidth * 0.8,
      behavior: "smooth",
    });
  });

  const controls = createElement(
    "div",
    { className: "featured-products__controls" },
    [previousButton, nextButton],
  );

  return createElement("div", { className: "featured-products__carousel" }, [
    track,
    controls,
  ]);
}

export function renderFeaturedProducts(products: ProductCard[]): HTMLElement {
  const section = createElement("section", {
    className: "featured-products",
  });

  const headingContent = createElement("div", {}, [
    createElement("span", {
      className: "featured-products__eyebrow",
      textContent: "Поиск вдохновения",
    }),
    createElement("h2", {
      className: "featured-products__title-heading",
      textContent: "Специально для вас",
    }),
  ]);

  const viewAll = createLink(
    "Посмотреть все товары ↗",
    `${import.meta.env.BASE_URL}catalog`,
    "featured-products__view-all",
  );

  const heading = createElement(
    "div",
    { className: "featured-products__heading" },
    [headingContent, viewAll],
  );

  section.append(heading);

  if (products.length === 0) {
    section.append(
      createElement("p", { className: "featured-products__empty" }, [
        "Пока нет доступных товаров.",
      ]),
    );

    return section;
  }

  section.append(renderCarousel(products));

  return section;
}
