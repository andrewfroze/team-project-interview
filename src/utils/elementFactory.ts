export function createElement<K extends keyof HTMLElementTagNameMap>(
  tagName: K,
  attributes: Partial<HTMLElementTagNameMap[K]> = {},
  children: (Node | string)[] = [],
): HTMLElementTagNameMap[K] {
  const element = document.createElement(tagName);

  Object.assign(element, attributes);
  element.append(...children);

  return element;
}

export function createButton(
  text: string,
  onClick?: () => void,
  className = "",
): HTMLButtonElement {
  return createElement("button", {
    type: "button",
    className,
    textContent: text,
    onclick: onClick ?? null,
  });
}

export function createBadge(text: string, className = ""): HTMLSpanElement {
  return createElement("span", {
    className: `badge ${className}`.trim(),
    textContent: text,
  });
}

export function createImage(
  src: string,
  alt: string,
  className = "",
): HTMLImageElement {
  return createElement("img", {
    src,
    alt,
    className,
    loading: "lazy",
  });
}

export function createLink(
  text: string,
  href: string,
  className = "",
): HTMLAnchorElement {
  return createElement("a", {
    href,
    className,
    textContent: text,
  });
}

export function createHeading(
  text: string,
  level: 1 | 2 | 3 | 4 | 5 | 6 = 2,
  className = "",
): HTMLHeadingElement {
  const tags = {
    1: "h1",
    2: "h2",
    3: "h3",
    4: "h4",
    5: "h5",
    6: "h6",
  } as const;

  return createElement(tags[level], {
    textContent: text,
    className,
  });
}

export function createParagraph(
  text: string,
  className = "",
): HTMLParagraphElement {
  return createElement("p", {
    textContent: text,
    className,
  });
}

export function createContainer(
  className: string,
  children: (Node | string)[] = [],
): HTMLDivElement {
  return createElement("div", { className }, children);
}
