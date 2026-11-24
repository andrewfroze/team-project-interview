import { createElement } from "../../utils/elementFactory";
import { fetchProductCards, searchProducts } from "../../api/apiClient";
import type { ProductCards } from "../../models/product";
import { createProductCard } from "../../components/productCard/productCard";
import { debounce } from "../../utils/debounce";
import { createSearchController } from "../../utils/searchController";

import "./catalog.css";

const PRODUCTS_PER_PAGE = 12;
const DEBOUNCE_DELAY = 500;

export function renderCatalog(category?: string): HTMLElement {
  let currentPage = 1;
  let totalPages = 1;
  let activeQuery = "";
  let requestId = 0;

  const title = createElement("h1", {
    className: "catalog__title",
    textContent: category ? category : "Каталог",
  });

  const searchInput = createElement("input", {
    className: "catalog__search-input",
    type: "search",
    placeholder: "Поиск товаров...",
    ariaLabel: "Поиск товаров",
  });

  const content = createElement("div", {
    className: "catalog__content",
  });

  const pagination = createElement("div", {
    className: "catalog__pagination",
  });

  const container = createElement("section", {
    className: "catalog",
  });

  container.append(title, searchInput, content, pagination);

  function showLoading(): void {
    content.replaceChildren(
      createElement("p", {
        className: "catalog__message",
        textContent: "Загрузка товаров...",
      }),
    );

    pagination.replaceChildren();
  }

  function showError(): void {
    content.replaceChildren(
      createElement("p", {
        className: "catalog__message catalog__message--error",
        textContent: "Не удалось загрузить товары. Попробуйте позже.",
      }),
    );

    pagination.replaceChildren();
  }

  function renderProducts(data: ProductCards): void {
    totalPages = Math.ceil(data.total / PRODUCTS_PER_PAGE);

    if (data.products.length === 0) {
      content.replaceChildren(
        createElement("h2", {
          className: "catalog__empty",
          textContent: activeQuery
            ? "По вашему запросу ничего не найдено"
            : "Доступных товаров не найдено",
        }),
      );

      pagination.replaceChildren();
      return;
    }

    const grid = createElement("div", {
      className: "catalog__grid",
    });

    grid.append(...data.products.map(createProductCard));

    const start = (currentPage - 1) * PRODUCTS_PER_PAGE + 1;
    const end = Math.min(currentPage * PRODUCTS_PER_PAGE, data.total);

    const range = createElement("p", {
      className: "catalog__range",
      textContent: `Показано ${start}–${end} из ${data.total} товаров`,
    });

    content.replaceChildren(range, grid);

    renderPagination();
  }

  function createPageButton(
    text: string,
    page: number,
    className = "",
    disabled = false,
  ): HTMLButtonElement {
    const button = createElement("button", {
      type: "button",
      className: `catalog__page-button ${className}`.trim(),
      textContent: text,
      disabled,
    });

    button.addEventListener("click", () => {
      if (disabled || page === currentPage) {
        return;
      }

      void loadPage(page);
    });

    return button;
  }

  function renderPagination(): void {
    pagination.replaceChildren();

    if (totalPages <= 1) {
      return;
    }

    const previousButton = createPageButton(
      "‹",
      currentPage - 1,
      "catalog__page-button--arrow",
      currentPage === 1,
    );

    pagination.append(previousButton);

    const visiblePages = getVisiblePages(currentPage, totalPages);

    visiblePages.forEach((page) => {
      if (page === "...") {
        pagination.append(
          createElement("span", {
            className: "catalog__ellipsis",
            textContent: "...",
          }),
        );

        return;
      }

      const button = createPageButton(
        String(page),
        page,
        page === currentPage ? "catalog__page-button--active" : "",
      );

      pagination.append(button);
    });

    const nextButton = createPageButton(
      "›",
      currentPage + 1,
      "catalog__page-button--arrow",
      currentPage === totalPages,
    );

    pagination.append(nextButton);
  }

  function getVisiblePages(current: number, total: number): (number | "...")[] {
    if (total <= 7) {
      return Array.from({ length: total }, (_, index) => index + 1);
    }

    if (current <= 4) {
      return [1, 2, 3, 4, 5, "...", total];
    }

    if (current >= total - 3) {
      return [1, "...", total - 4, total - 3, total - 2, total - 1, total];
    }

    return [1, "...", current - 1, current, current + 1, "...", total];
  }

  const searchController = createSearchController({
    search: searchProducts,

    onLoading: showLoading,

    onSuccess: renderProducts,

    onError: showError,
  });

  async function loadPage(page: number): Promise<void> {
    currentPage = page;

    const skip = (page - 1) * PRODUCTS_PER_PAGE;

    if (activeQuery) {
      requestId += 1;

      await searchController.run(activeQuery, skip, PRODUCTS_PER_PAGE);

      return;
    }

    searchController.cancel();

    const currentRequestId = ++requestId;

    showLoading();

    try {
      const data = await fetchProductCards(category, skip, PRODUCTS_PER_PAGE);

      if (currentRequestId !== requestId) {
        return;
      }

      renderProducts(data);
    } catch {
      if (currentRequestId !== requestId) {
        return;
      }

      showError();
    }
  }

  const debouncedSearch = debounce((query: string) => {
    activeQuery = query;
    currentPage = 1;

    void loadPage(1);
  }, DEBOUNCE_DELAY);

  searchInput.addEventListener("input", () => {
    // Отменяем текущий запрос и ожидающий debounce.
    searchController.cancel();
    debouncedSearch.cancel();

    // Инвалидируем возможный запрос загрузки каталога.
    requestId += 1;

    activeQuery = searchInput.value.trim();
    currentPage = 1;

    if (!activeQuery) {
      void loadPage(1);
      return;
    }

    content.replaceChildren(
      createElement("p", {
        className: "catalog__message",
        textContent: "Ожидание ввода...",
      }),
    );

    pagination.replaceChildren();

    debouncedSearch(activeQuery);
  });

  void loadPage(1);

  return container;
}
