import { fetchProductDetails } from "./api/apiClient";
import { renderMainLayout } from "./layouts/mainLayout";
import { renderErrorPage } from "./pages/error-page/error-page";
import { renderHomePage } from "./pages/home/homePage";
import { renderCartPage } from "./pages/cart/cartPage.ts";
import { renderProductDetails } from "./pages/product-details";
import { renderCatalog } from "./pages/catalog/catalog";
import { createElement } from "./utils/elementFactory";
import { renderAboutUs } from "./pages/about-us/aboutUs";
import type { Product } from "./models/product.ts";
import { addToCart } from "./cart/cartStore.ts";
import { renderNightMode } from "./components/nightMode/nightMode";

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

  const cartMatch = relativePath.match(/^\/cart\/?$/);
  if (cartMatch) {
    return renderCartPage();
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
    const searchParams = new URLSearchParams(window.location.search);
    const category = searchParams.get("category") ?? undefined;
    return renderCatalog(category);
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

  try {
    const loading = createElement("p", {
      className: "app__loading",
      textContent: "Загрузка...",
    });

    const layout = await renderMainLayout(loading);
    root.replaceChildren(layout);

    const main = layout.querySelector<HTMLElement>(".app-layout__content");

    if (!main) {
      throw new Error("Main content container not found");
    }

    const page = await resolvePage();

    main.replaceChildren(page);

    requestAnimationFrame(scrollToHash);
  } catch (error) {
    console.error("Failed to render application:", error);

    const errorPage = renderErrorPage(
      error instanceof Error ? error : new Error("Unknown error"),
    );

    root.replaceChildren(errorPage);
  }
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

document.addEventListener("cart:add", (event) => {
  const { product, quantity } = (
    event as CustomEvent<{
      product: Product;
      quantity: number;
    }>
  ).detail;

  addToCart(product, quantity);

  document.dispatchEvent(new Event("cart:updated"));
});

renderNightMode();
