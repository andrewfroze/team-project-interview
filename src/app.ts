import { fetchProductDetails } from "./api/apiClient";
import { renderErrorPage } from "./pages/error-page/error-page";
import { renderProductDetails } from "./pages/product-details";
import { renderCatalog } from "./pages/catalog/catalog";
import { createElement } from "./utils/elementFactory";

export async function start(path: string): Promise<void> {
  if (path.includes("/product/")) {
    const match = path.match(/\/product\/(\d+)/);
    const productId = match ? Number(match[1]) : null;

    if (productId) {
      document.body.replaceChildren(
        await fetchProductDetails(productId)
          .then(renderProductDetails)
          .catch(renderErrorPage),
      );
    } else {
      document.body.replaceChildren(
        renderErrorPage(new Error("Product not found")),
      );
    }
  } else {
    const loading = createElement("p", {
      textContent: "Загрузка товаров...",
    });

    document.body.replaceChildren(loading);

    const catalog = await renderCatalog().catch(renderErrorPage);

    document.body.replaceChildren(catalog);
  }
}
