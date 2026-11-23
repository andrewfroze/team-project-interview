import type { ProductCard } from "../../models/product";
import { createElement } from "../../utils/elementFactory";
import { calculateDiscountPrice, formatPrice } from "../../utils/formatPrice";

import "./productCard.css";

export function createProductCard(product: ProductCard): HTMLElement {
  const card = createElement("a", {
    className: "product-card",
    href: `${import.meta.env.BASE_URL}product/${product.id}`,
  });

  const fallbackImage = `${import.meta.env.BASE_URL}placeholder.svg`;

  const image = createElement("img", {
    src: product.images[0] || fallbackImage,
    alt: product.title,
  });

  image.onerror = () => {
    image.onerror = null;
    image.src = fallbackImage;
  };
  card.append(image);

  card.append(
    createElement("h2", {
      textContent: product.title,
    }),
  );

  if (product.brand) {
    card.append(
      createElement("p", {
        className: "product-card__brand",
        textContent: product.brand,
      }),
    );
  }

  card.append(
    createElement("p", {
      className: "product-card__rating",
      textContent: `★ ${product.rating.toFixed(1)}`,
    }),
  );

  const discountedPrice = calculateDiscountPrice(
    product.price,
    product.discountPercentage,
  );

  card.append(
    createElement("p", { className: "product-card__price" }, [
      createElement("strong", {
        textContent: formatPrice(discountedPrice),
      }),
      createElement("s", {
        textContent: formatPrice(product.price),
      }),
    ]),
  );

  card.append(
    createElement("span", {
      className: "product-card__discount",
      textContent: `−${Math.round(product.discountPercentage)}%`,
    }),
  );

  return card;
}
