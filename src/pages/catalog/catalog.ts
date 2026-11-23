import { createElement } from "../../utils/elementFactory";
import { fetchProductCards } from "../../api/apiClient";
import "./catalog.css";
import { createProductCard } from "../../components/productCard/productCard";

export function renderCatalog(): HTMLElement {
  const catalog = createElement("section", {
    className: "catalog",
  });

  const title = createElement("h1", {
    className: "catalog__title",
    textContent: "Каталог товаров",
  });

  const content = createElement("div", {
    className: "catalog__content",
  });

  const loading = createElement("p", {
    className: "catalog__loading",
    textContent: "Загрузка товаров...",
  });

  content.append(loading);
  catalog.append(title, content);

  fetchProductCards()
    .then((data) => {
      const cards = data.products.map(createProductCard);

      const grid = createElement("div", { className: "catalog__grid" }, cards);

      content.replaceChildren(grid);
    })
    .catch(() => {
      const error = createElement("p", {
        className: "catalog__error",
        textContent: "Не удалось загрузить товары. Попробуйте позже.",
      });

      content.replaceChildren(error);
    });

  return catalog;
}
