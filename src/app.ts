import { fetchProductDetails } from "./api/apiClient";
import { renderErrorPage } from "./pages/error-page/error-page";
import { renderProductDetails } from "./pages/product-details";
import { renderCatalog } from "./pages/catalog/catalog";
import { createElement } from "./utils/elementFactory";

const BASE_PATH = import.meta.env.BASE_URL.replace(/\/$/, "");

export async function start(path: string): Promise<void> {
  const normalizedPath = path.startsWith(BASE_PATH)
    ? path.slice(BASE_PATH.length) || "/"
    : path;

  const productMatch = normalizedPath.match(/^\/product\/(\d+)\/?$/);

  if (!productMatch) {
    const loading = createElement("p", {
      textContent: "Загрузка товаров...",
    });

    document.body.replaceChildren(loading);

    const catalog = await renderCatalog().catch(renderErrorPage);

    document.body.replaceChildren(catalog);
    return;
  }

  const productId = Number(productMatch[1]);

  if (!Number.isSafeInteger(productId) || productId <= 0) {
    document.body.replaceChildren(
      renderErrorPage(new Error("Product not found")),
    );
    return;
  }

  document.body.replaceChildren(
    await fetchProductDetails(productId)
      .then(renderProductDetails)
      .catch(renderErrorPage),
  );
}
