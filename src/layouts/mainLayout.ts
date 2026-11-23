import { createElement } from "../utils/elementFactory";
import { renderHeader } from "../components/header/header";

import "./mainLayout.css";

export async function renderMainLayout(
  content: HTMLElement,
): Promise<HTMLElement> {
  const header = await renderHeader();

  const main = createElement(
    "main",
    {
      className: "app-layout__content",
    },
    [content],
  );

  return createElement(
    "div",
    {
      className: "app-layout",
    },
    [header, main],
  );
}
