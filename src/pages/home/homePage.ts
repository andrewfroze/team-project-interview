import { fetchProductCards } from "../../api/apiClient";
import { createElement, createLink } from "../../utils/elementFactory";

import { renderFeaturedProducts } from "./components/featuredProducts";

import "./homePage.css";

function renderHero(): HTMLElement {
  const content = createElement("div", { className: "home-hero__content" }, [
    createElement("span", { className: "home-hero__eyebrow" }, [
      "Покупки с заботой о деталях",
    ]),
    createElement("h1", { className: "home-hero__title" }, [
      "Вещи, которые хочется сохранить.",
    ]),
    createElement("p", { className: "home-hero__description" }, [
      "Всё необходимое на каждый день, продуманные детали и немного приятных неожиданностей.",
    ]),
    createLink(
      "Перейти в каталог",
      `${import.meta.env.BASE_URL}catalog`,
      "home-hero__button",
    ),
  ]);

  return createElement("section", { className: "home-hero" }, [content]);
}

export async function renderHomePage(): Promise<HTMLElement> {
  const page = createElement("div", {
    className: "home-page",
  });

  const products = await fetchProductCards(Math.random() * 150, 10)
    .then((result) => result.products)
    .catch(() => []);

  page.append(renderHero(), renderFeaturedProducts(products));

  return page;
}
