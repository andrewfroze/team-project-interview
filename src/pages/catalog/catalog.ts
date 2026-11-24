import {
  createButton,
  createElement,
  createHeading,
} from "../../utils/elementFactory";
import { fetchProductCards } from "../../api/apiClient";
import { createProductCard } from "../../components/productCard/productCard";

import "./catalog.css";

const PRODUCTS_PER_PAGE = 12;

export function renderCatalog(category?: string): HTMLElement {
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

  const pagination = createElement("div", {
    className: "catalog__pagination",
  });

  catalog.append(title, content, pagination);

  let currentPage = 1;
  let totalPages = 1;
  let requestId = 0;

  async function loadPage(page: number): Promise<void> {
    const currentRequestId = ++requestId;

    currentPage = page;

    content.replaceChildren(
      createElement("p", {
        className: "catalog__loading",
        textContent: "Загрузка товаров...",
      }),
    );

    pagination.replaceChildren();

    try {
      const skip = (page - 1) * PRODUCTS_PER_PAGE;

      const data = await fetchProductCards(category, skip, PRODUCTS_PER_PAGE);

      if (currentRequestId !== requestId) return;

      totalPages = Math.ceil(data.total / PRODUCTS_PER_PAGE);

      const cards = data.products.map(createProductCard);

      const grid = createElement("div", { className: "catalog__grid" }, cards);

      if (data.products.length > 0) {
        const range = createElement("p", {
          className: "catalog__range",
          textContent: `Показано ${
            data.products.length ? skip + 1 : 0
          }–${skip + data.products.length} из ${data.total} товаров`,
        });

        content.replaceChildren(range, grid);
      } else {
        content.replaceChildren(
          createHeading("Доступных товаров не найдено. Попробуйте позже.", 2),
        );
      }

      renderPagination();
    } catch {
      if (currentRequestId !== requestId) return;

      content.replaceChildren(
        createElement("p", {
          className: "catalog__error",
          textContent: "Не удалось загрузить товары. Попробуйте позже.",
        }),
      );
    }
  }

  function renderPagination(): void {
    pagination.replaceChildren();

    if (totalPages <= 1) return;

    const previousButton = createButton(
      "←",
      () => loadPage(currentPage - 1),
      "catalog__page-button catalog__page-button--arrow",
    );

    previousButton.disabled = currentPage === 1;
    previousButton.setAttribute("aria-label", "Предыдущая страница");

    pagination.append(previousButton);

    const pages = getVisiblePages(currentPage, totalPages);

    pages.forEach((page) => {
      if (page === null) {
        pagination.append(
          createElement("span", {
            className: "catalog__ellipsis",
            textContent: "...",
          }),
        );

        return;
      }

      const button = createButton(
        String(page),
        () => loadPage(page),
        "catalog__page-button",
      );

      const isActive = page === currentPage;

      button.classList.toggle("catalog__page-button--active", isActive);
      button.disabled = isActive;

      if (isActive) {
        button.setAttribute("aria-current", "page");
      }

      pagination.append(button);
    });

    const nextButton = createButton(
      "→",
      () => loadPage(currentPage + 1),
      "catalog__page-button catalog__page-button--arrow",
    );

    nextButton.disabled = currentPage === totalPages;
    nextButton.setAttribute("aria-label", "Следующая страница");

    pagination.append(nextButton);
  }

  loadPage(currentPage);

  return catalog;
}

function getVisiblePages(
  currentPage: number,
  totalPages: number,
): (number | null)[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  if (currentPage <= 2) {
    return [1, 2, 3, null, totalPages];
  }

  if (currentPage >= totalPages - 2) {
    return [
      1,
      null,
      totalPages - 3,
      totalPages - 2,
      totalPages - 1,
      totalPages,
    ];
  }

  return [
    1,
    null,
    currentPage - 1,
    currentPage,
    currentPage + 1,
    null,
    totalPages,
  ];
}
