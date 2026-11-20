import { createElement } from "../../utils/elementFactory";
import { fetchProductCards } from "../../api/apiClient";
import type { ProductCard } from "../../models/product";

function createProductCard(product: ProductCard): HTMLElement {
  const image = createElement("img", {
    src: product.images[0],
    alt: product.title,
  });

  const title = createElement("h2", {
    textContent: product.title,
  });

  const price = createElement("p", {
    textContent: `$${product.price}`,
  });

  return createElement("article", { className: "product-card" }, [
    image,
    title,
    price,
  ]);
}

export async function renderCatalog(): Promise<HTMLElement> {
  const catalog = createElement("main");

  const data = await fetchProductCards();

  const cards = data.products.map(createProductCard);

  catalog.append(...cards);

  return catalog;
}
