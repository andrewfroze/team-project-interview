import { fetchCategories } from "../../api/apiClient";
import type { ProductCategory } from "../../models/category";
import { getCatalogUrl } from "../../router/router";
import { createElement, createLink } from "../../utils/elementFactory";

import "./categoriesDropdown.css";

export function renderCategoriesMenu(): Promise<HTMLElement> {
  return fetchCategories().then((categories) =>
    createElement(
      "nav",
      {
        className: "header__navigation",
        ariaLabel: "Main navigation",
      },
      [renderCategoryDropdown(categories)],
    ),
  );
}

function renderCategoryDropdown(categories: ProductCategory[]): HTMLElement {
  const trigger = createElement("button", {
    type: "button",
    className: "header__categories-trigger",
    ariaExpanded: "false",
    ariaHasPopup: "true",
    textContent: "Категории",
  });

  const categoryLinks = categories.map((category) =>
    createLink(
      category.name,
      getCatalogUrl(category.slug),
      "header__dropdown-link",
    ),
  );

  const dropdown = createElement(
    "div",
    {
      className: "header__dropdown",
    },
    [
      createLink(
        "Все товары",
        getCatalogUrl(),
        "header__dropdown-link header__dropdown-link--all",
      ),
      ...categoryLinks,
    ],
  );

  const container = createElement(
    "div",
    {
      className: "header__categories",
    },
    [trigger, dropdown],
  );

  trigger.addEventListener("click", () => {
    const isOpen = container.classList.toggle("header__categories--open");

    trigger.setAttribute("aria-expanded", String(isOpen));
  });

  document.addEventListener("click", (event: MouseEvent) => {
    if (!container.contains(event.target as Node)) {
      container.classList.remove("header__categories--open");
      trigger.setAttribute("aria-expanded", "false");
    }
  });

  trigger.addEventListener("keydown", (event: KeyboardEvent) => {
    if (event.key === "Escape") {
      container.classList.remove("header__categories--open");
      trigger.setAttribute("aria-expanded", "false");
      trigger.focus();
    }
  });

  return container;
}
