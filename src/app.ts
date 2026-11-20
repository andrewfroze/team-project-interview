import { fetchProductDetails } from "./api/apiClient";
import { renderProductDetails } from "./pages/product-details";

export async function start(path: string): Promise<void> {
  if (path.includes("/product/")) {
    const match = path.match(/\/product\/(\d+)/);
    const productId = match ? Number(match[1]) : null;

    if (productId) {
      document.body.replaceChildren(
        await fetchProductDetails(productId).then(renderProductDetails),
      );
    }
  } else {
    document.body.textContent = "Project initialized";
  }
}
