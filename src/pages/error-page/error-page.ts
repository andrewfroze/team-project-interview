import { createElement } from "../../utils/elementFactory";

export function renderErrorPage(error: Error): HTMLElement {
  // this is just placeholder. It will be implemented in other task
  return createElement("h1", {
    textContent: `Error happened: ${error.message}`,
  });
}
