import { getCatalogUrl } from "../../router/router";
import { createElement, createLink } from "../../utils/elementFactory";
import { renderCategoriesMenu } from "../categoriesDropdown/categoriesDropdown";

import "./header.css";

export async function renderHeader(): Promise<HTMLElement> {
  const header = createElement("header", {
    className: "header",
  });

  const brand = createLink("A&M", import.meta.env.BASE_URL, "header__brand");

  const catalogLink = createLink("Каталог", getCatalogUrl(), "header__catalog");

  const aboutLink = createElement("a", {
    className: "header__nav-link",
    href: `${import.meta.env.BASE_URL}about-us`,
    textContent: "О нас",
  });

  const topBar = createElement("div", { className: "header__top" }, [
    createElement(
      "div",
      {
        className: "header__left",
      },
      [brand, aboutLink],
    ),
    catalogLink,
  ]);

  header.append(topBar);

  brand.after(await renderCategoriesMenu());

  return header;
}
