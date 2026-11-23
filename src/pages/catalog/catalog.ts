import { createElement } from "../../utils/elementFactory";
import { fetchProductCards } from "../../api/apiClient";
import "./catalog.css";
import { createProductCard } from "../../components/productCard/productCard";

export async function renderCatalog(): Promise<HTMLElement> {
  const catalog = createElement("section", {
    className: "catalog",
  });

  const loading = createElement("p", {
    textContent: "Загрузка товаров...",
  });

  const title = createElement("h1", {
    className: "catalog__title",
    textContent: "Каталог товаров",
  });

  catalog.append(loading);

  const data = await fetchProductCards();

  const cards = data.products.map(createProductCard);

  const grid = createElement("div", { className: "catalog__grid" }, cards);

  catalog.replaceChildren(title, grid);

  return catalog;
}
