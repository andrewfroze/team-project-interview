import type { Product } from "../../../../models/product";
import { createElement } from "../../../../utils/elementFactory";
import "./specifications.css";

interface Specification {
  label: string;
  value: string | number;
}

export function renderSpecifications(product: Product): HTMLElement {
  const { dimensions } = product;

  const specifications: Specification[] = [
    { label: "Brand", value: product.brand || "Not specified" },
    { label: "SKU", value: product.sku },
    { label: "Weight", value: `${product.weight} kg` },
    {
      label: "Dimensions",
      value: `${dimensions.width} × ${dimensions.height} × ${dimensions.depth} cm`,
    },
    { label: "Warranty", value: product.warrantyInformation },
    { label: "Return policy", value: product.returnPolicy },
    { label: "Shipping", value: product.shippingInformation },
    { label: "Minimum order", value: product.minimumOrderQuantity },
  ];

  const items = specifications.map(({ label, value }) =>
    createElement("div", { className: "product-specifications__item" }, [
      createElement("span", { className: "product-specifications__label" }, [
        label,
      ]),
      createElement("span", { className: "product-specifications__value" }, [
        String(value),
      ]),
    ]),
  );

  return createElement("div", { className: "product-specifications" }, items);
}
