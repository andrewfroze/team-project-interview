import { showToast } from "../components/toast/toast";

let isInitialized = false;

function getUserMessage(error: unknown): string {
  if (!(error instanceof Error)) {
    return "Произошла непредвиденная ошибка.";
  }

  if (error.name === "AbortError") {
    return "";
  }

  switch (error.name) {
    case "TimeoutError":
      return "Сервер долго не отвечает. Попробуйте ещё раз.";

    case "NetworkError":
    case "TypeError":
      return "Не удалось подключиться к серверу. Проверьте интернет-соединение.";

    case "HttpError":
      return "Сервер вернул ошибку. Попробуйте повторить действие.";

    case "ApiError":
      return "Не удалось обработать ответ сервера.";

    default:
      return "Произошла непредвиденная ошибка. Попробуйте ещё раз.";
  }
}

export function reportError(error: unknown): void {
  if (error instanceof Error && error.name === "AbortError") {
    return;
  }

  console.error("[Application Error]", error);

  const message = getUserMessage(error);

  if (message && typeof document !== "undefined") {
    showToast(message, "error");
  }
}

export function initGlobalErrorHandler(): void {
  if (isInitialized) {
    return;
  }

  isInitialized = true;

  window.addEventListener("error", (event: ErrorEvent) => {
    reportError(event.error ?? event.message);
  });

  window.addEventListener(
    "unhandledrejection",
    (event: PromiseRejectionEvent) => {
      reportError(event.reason);
    },
  );
}
