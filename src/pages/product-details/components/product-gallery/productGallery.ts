import type { Product } from "../../../../models/product";
import {
  createButton,
  createContainer,
  createImage,
} from "../../../../utils/elementFactory";
import "./productGallery.css";

export function renderProductGallery(product: Product): HTMLElement {
  const mainImage = createImage(
    product.thumbnail,
    product.title,
    "product-gallery__main-image",
  );

  const thumbnails = product.images.map((src, index) => {
    const thumbnail = createButton(
      "",
      () => {
        mainImage.src = src;

        thumbnails.forEach((item, itemIndex) => {
          item.classList.toggle(
            "product-gallery__thumbnail--active",
            itemIndex === index,
          );
        });
      },
      `product-gallery__thumbnail ${
        index === 0 ? "product-gallery__thumbnail--active" : ""
      }`,
    );

    thumbnail.append(
      createImage(
        src,
        `${product.title} - image ${index + 1}`,
        "product-gallery__thumbnail-image",
      ),
    );

    return thumbnail;
  });

  return createContainer("product-gallery", [
    createContainer("product-gallery__main", [mainImage]),
    createContainer("product-gallery__thumbnails", thumbnails),
  ]);
}
