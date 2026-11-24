import { createElement } from "../../utils/elementFactory";
import { fetchProductCards, searchProducts } from "../../api/apiClient";
import type { ProductCards } from "../../models/product";
import { createProductCard } from "../../components/productCard/productCard";
import { debounce } from "../../utils/debounce";
import { createSearchController } from "../../utils/searchController";
import type { ProductSortField, SortOrder } from "../../api/apiClient";

import "./catalog.css";
import { reportError } from "../../utils/errorHandler";

const PRODUCTS_PER_PAGE = 12;
const DEBOUNCE_DELAY = 500;

export function renderCatalog(category?: string): HTMLElement {
  let currentPage = 1;
  let totalPages = 1;
  let activeQuery = "";
  let requestId = 0;
  let sortBy: ProductSortField | undefined;
  let sortOrder: SortOrder = "asc";

  const title = createElement("h1", {
    className: "catalog__title",
    textContent: category ? category.replace("-", " ") : "Каталог",
  });

  const searchInput = createElement("input", {
    className: "catalog__search-input",
    type: "search",
    placeholder: "Поиск товаров...",
    ariaLabel: "Поиск товаров",
  });

  const sortSelect = createElement(
    "select",
    {
      className: "catalog__sort-select",
      ariaLabel: "Сортировка товаров",
    },
    [
      createElement("option", {
        value: "",
        textContent: "Без сортировки",
      }),
      createElement("option", {
        value: "title:asc",
        textContent: "По названию: А–Я",
      }),
      createElement("option", {
        value: "price:asc",
        textContent: "Сначала дешевле",
      }),
      createElement("option", {
        value: "price:desc",
        textContent: "Сначала дороже",
      }),
      createElement("option", {
        value: "rating:desc",
        textContent: "По рейтингу",
      }),
      createElement("option", {
        value: "discountPercentage:desc",
        textContent: "По размеру скидки",
      }),
    ],
  );

  sortSelect.addEventListener("change", () => {
    const [field, order] = sortSelect.value.split(":");

    sortBy = field ? (field as ProductSortField) : undefined;

    sortOrder = order === "desc" ? "desc" : "asc";

    searchController.cancel();
    debouncedSearch.cancel();

    requestId += 1;
    currentPage = 1;

    void loadPage(1);
  });

  const controls = createElement(
    "div",
    {
      className: "catalog__controls",
    },
    [searchInput, sortSelect],
  );

  const content = createElement("div", {
    className: "catalog__content",
  });

  const pagination = createElement("div", {
    className: "catalog__pagination",
  });

  const container = createElement("section", {
    className: "catalog",
  });

  container.append(title, controls, content, pagination);

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
    ariaLabel?: string,
    isActive = false,
  ): HTMLButtonElement {
    const button = createElement("button", {
      type: "button",
      className: `catalog__page-button ${className}`.trim(),
      textContent: text,
      disabled: disabled || isActive,
    });

    if (ariaLabel) {
      button.setAttribute("aria-label", ariaLabel);
    }

    if (isActive) {
      button.setAttribute("aria-current", "page");
    }

    button.addEventListener("click", () => {
      if (button.disabled || page === currentPage) {
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
      "Предыдущая страница",
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

      const isActive = page === currentPage;

      const button = createPageButton(
        String(page),
        page,
        isActive ? "catalog__page-button--active" : "",
        false,
        `Страница ${page}`,
        isActive,
      );

      pagination.append(button);
    });

    const nextButton = createPageButton(
      "›",
      currentPage + 1,
      "catalog__page-button--arrow",
      currentPage === totalPages,
      "Следующая страница",
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
    search: (query, skip, limit, signal, field, order) =>
      searchProducts(
        query,
        skip,
        limit,
        signal,
        undefined,
        undefined,
        field,
        order,
      ),

    onLoading: showLoading,
    onSuccess: renderProducts,
    onError: showError,
  });

  async function loadPage(page: number): Promise<void> {
    currentPage = page;

    const skip = (page - 1) * PRODUCTS_PER_PAGE;

    if (activeQuery) {
      requestId += 1;

      await searchController.run(
        activeQuery,
        skip,
        PRODUCTS_PER_PAGE,
        sortBy,
        sortOrder,
      );

      return;
    }

    searchController.cancel();

    const currentRequestId = ++requestId;

    showLoading();

    try {
      const data = await fetchProductCards(
        category,
        skip,
        PRODUCTS_PER_PAGE,
        undefined,
        undefined,
        sortBy,
        sortOrder,
      );

      if (currentRequestId !== requestId) {
        return;
      }

      renderProducts(data);
    } catch (error) {
      if (currentRequestId !== requestId) {
        return;
      }

      showError();
      reportError(error);
    }
  }

  const debouncedSearch = debounce(() => {
    currentPage = 1;

    void loadPage(1);
  }, DEBOUNCE_DELAY);

  searchInput.addEventListener("input", () => {
    searchController.cancel();
    debouncedSearch.cancel();

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

    debouncedSearch();
  });

  void loadPage(1);

  return container;
}
