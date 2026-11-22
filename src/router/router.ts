const BASE_PATH = import.meta.env.BASE_URL.replace(/\/$/, "");

export function getRoute(): string {
  const pathname = window.location.pathname;

  return pathname.startsWith(BASE_PATH)
    ? pathname.slice(BASE_PATH.length) || "/"
    : pathname;
}
