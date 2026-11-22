import { createElement } from "../../utils/elementFactory";
import { fetchProductCards } from "../../api/apiClient";
import type { ProductCard } from "../../models/product";
import { calculateDiscountPrice, formatPrice } from "../../utils/formatPrice";
import "./catalog.css";

function createProductCard(product: ProductCard): HTMLElement {
  const fallbackImage = `${import.meta.env.BASE_URL}placeholder.svg`;

  const image = createElement("img", {
    src: product.images[0] || fallbackImage,
    alt: product.title,
  });

  image.onerror = () => {
    image.onerror = null;
    image.src = fallbackImage;
  };

  const brand = createElement("p", {
    className: "product-card__brand",
    textContent: product.brand || "Без бренда",
  });

  const title = createElement("h2", {
    textContent: product.title,
  });

  const rating = createElement("p", {
    className: "product-card__rating",
    textContent: `★ ${product.rating.toFixed(1)} / 5`,
  });

  const discountedPrice = calculateDiscountPrice(
    product.price,
    product.discountPercentage,
  );

  const price = createElement("p", { className: "product-card__price" }, [
    createElement("strong", {
      textContent: formatPrice(discountedPrice),
    }),
    createElement("s", {
      textContent: formatPrice(product.price),
    }),
  ]);

  const discount = createElement("span", {
    className: "product-card__discount",
    textContent: `−${Math.round(product.discountPercentage)}%`,
  });

  return createElement(
    "a",
    {
      className: "product-card",
      href: `${import.meta.env.BASE_URL}product/${product.id}`,
    },
    [image, discount, brand, title, rating, price],
  );
}

export async function renderCatalog(): Promise<HTMLElement> {
  const catalog = createElement("main", {
    className: "catalog",
  });

  const title = createElement("h1", {
    className: "catalog__title",
    textContent: "Каталог товаров",
  });

  const data = await fetchProductCards();

  const cards = data.products.map(createProductCard);

  const grid = createElement("div", { className: "catalog__grid" }, cards);

  catalog.append(title, grid);

  return catalog;
}
