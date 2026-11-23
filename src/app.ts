import { fetchProductDetails } from "./api/apiClient";
import { renderMainLayout } from "./layouts/mainLayout";
import { renderErrorPage } from "./pages/error-page/error-page";
import { renderHomePage } from "./pages/home/homePage";
import { renderProductDetails } from "./pages/product-details";
import { renderCatalog } from "./pages/catalog/catalog";
import { createElement } from "./utils/elementFactory";
import { renderAboutUs } from "./pages/about-us/aboutUs";

function getAppBasePath(): string {
  const basePath = import.meta.env.BASE_URL;

  return basePath.endsWith("/") ? basePath.slice(0, -1) : basePath;
}

function createNotFoundPage(): HTMLElement {
  return createElement("section", { className: "not-found-page" }, [
    createElement("h1", {}, ["Page not found"]),
    createElement("p", {}, ["The requested page does not exist."]),
  ]);
}

async function resolvePage(): Promise<HTMLElement> {
  const basePath = getAppBasePath();
  const pathname = window.location.pathname;

  const relativePath = pathname.startsWith(basePath)
    ? pathname.slice(basePath.length)
    : pathname;

  if (relativePath === "" || relativePath === "/") {
    return renderHomePage();
  }

  const productMatch = relativePath.match(/^\/product\/(\d+)\/?$/);

  if (productMatch) {
    const productId = Number(productMatch[1]);

    if (!Number.isSafeInteger(productId) || productId <= 0) {
      return renderErrorPage(new Error("Product not found"));
    }

    return await fetchProductDetails(productId)
      .then(renderProductDetails)
      .catch(renderErrorPage);
  }

  const catalogMatch = relativePath.match(/^\/catalog\/?$/);
  if (catalogMatch) {
    return await renderCatalog().catch(renderErrorPage);
  }

  const aboutUsMatch = relativePath.match(/^\/about-us\/?$/);
  if (aboutUsMatch) {
    return renderAboutUs();
  }

  return createNotFoundPage();
}

async function renderApp(): Promise<void> {
  const root = createElement("div", { id: "app" });

  document.body.replaceChildren(root);

  const page = await resolvePage();
  const layout = await renderMainLayout(page);

  root.replaceChildren(layout);

  requestAnimationFrame(() => {
    scrollToHash();
  });
}

function scrollToHash(): void {
  const hash = window.location.hash;

  if (!hash) {
    window.scrollTo(0, 0);
    return;
  }

  const target = document.querySelector<HTMLElement>(hash);

  target?.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
}

renderApp().catch((error: unknown) => {
  console.error("Failed to render application:", error);
});
