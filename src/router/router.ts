const BASE_PATH = import.meta.env.BASE_URL.replace(/\/$/, "");

export function getRoute(): string {
  const pathname = window.location.pathname;

  return pathname.startsWith(BASE_PATH)
    ? pathname.slice(BASE_PATH.length) || "/"
    : pathname;
}

export function getCatalogUrl(category?: string): string {
  const catalogUrl = `${import.meta.env.BASE_URL}catalog`;

  return category
    ? `${catalogUrl}?category=${encodeURIComponent(category)}`
    : catalogUrl;
}
