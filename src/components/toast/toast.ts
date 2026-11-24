import { createElement } from "../../utils/elementFactory";

import "./toast.css";

export type ToastType = "success" | "error" | "info";

const TOAST_DURATION = 2000;

let toastContainer: HTMLElement | null = null;

function getToastContainer(): HTMLElement {
  if (toastContainer?.isConnected) {
    return toastContainer;
  }

  toastContainer = createElement("div", {
    className: "toast-container",
  });

  toastContainer.setAttribute("aria-label", "Уведомления");
  toastContainer.setAttribute("aria-live", "polite");
  toastContainer.setAttribute("aria-relevant", "additions");

  document.body.append(toastContainer);

  return toastContainer;
}

export function showToast(
  message: string,
  type: ToastType = "info",
  duration: number = TOAST_DURATION,
): void {
  const container = getToastContainer();

  const toast = createElement("div", {
    className: `toast toast--${type}`,
    role: type === "error" ? "alert" : "status",
  });

  const text = createElement("p", {
    className: "toast__message",
    textContent: message,
  });

  const closeButton = createElement("button", {
    className: "toast__close",
    type: "button",
    textContent: "×",
    ariaLabel: "Закрыть уведомление",
  });

  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  function removeToast(): void {
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
      timeoutId = null;
      toast.classList.add("toast--closing");

      toast.addEventListener("animationend", () => toast.remove(), {
        once: true,
      });
    }
  }

  closeButton.addEventListener("click", removeToast);

  toast.append(text, closeButton);
  container.append(toast);

  timeoutId = setTimeout(removeToast, duration);
}
