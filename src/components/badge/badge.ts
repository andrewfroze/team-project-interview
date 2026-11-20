import { createBadge } from "../../utils/elementFactory";

import "./badge.css";

export function renderBadge(
  text: string,
  variant: "discount" | "tag" = "tag",
): HTMLSpanElement {
  return createBadge(text, `badge--${variant}`);
}
