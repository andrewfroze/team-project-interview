import "./nightMode.css";

import { createButton, createElement } from "../../utils/elementFactory";

const STORAGE_KEY = "night-mode-enabled";
const OVERLAY_ID = "night-mode-overlay";
const BUTTON_ID = "night-mode-toggle";
const POSITION_KEY = "night-mode-position";

interface FlashlightPosition {
  x: number;
  y: number;
}

interface NightModeOptions {
  smoothing?: number;
}

const DEFAULT_OPTIONS: Required<NightModeOptions> = {
  smoothing: 0.12,
};

let isEnabled = false;
let animationFrame = 0;
let cleanup: (() => void) | null = null;

export function renderNightMode(): void {
  if (document.getElementById(BUTTON_ID)) return;

  const icon = createElement("span", {
    className: "night-mode__icon",
  });

  const button = createButton("", toggleNightMode, "night-mode__toggle");

  button.id = BUTTON_ID;
  button.append(icon);

  button.setAttribute("aria-label", "Включить ночной режим");
  button.setAttribute("aria-pressed", "false");

  document.body.append(button);

  if (localStorage.getItem(STORAGE_KEY) === "true") {
    isEnabled = true;
    enableNightMode();

    button.classList.add("night-mode__toggle--active");
    button.setAttribute("aria-pressed", "true");
    button.setAttribute("aria-label", "Выключить ночной режим");
  }
}

function toggleNightMode(): void {
  if (isEnabled) {
    disableNightMode();
  } else {
    enableNightMode();
  }

  isEnabled = !isEnabled;

  localStorage.setItem(STORAGE_KEY, String(isEnabled));

  const button = document.getElementById(BUTTON_ID);

  button?.classList.toggle("night-mode__toggle--active", isEnabled);

  button?.setAttribute("aria-pressed", String(isEnabled));

  button?.setAttribute(
    "aria-label",
    isEnabled ? "Выключить ночной режим" : "Включить ночной режим",
  );
}

function enableNightMode(options: NightModeOptions = {}): void {
  const settings = {
    ...DEFAULT_OPTIONS,
    ...options,
  };

  const existingOverlay = document.getElementById(OVERLAY_ID);
  if (existingOverlay) {
    existingOverlay.remove();
  }

  const overlay = createElement("div", {
    id: OVERLAY_ID,
    className: "night-mode--active",
  });

  document.body.append(overlay);

  const savedPosition = sessionStorage.getItem(POSITION_KEY);

  const initialPosition: FlashlightPosition = savedPosition
    ? (JSON.parse(savedPosition) as FlashlightPosition)
    : {
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
      };

  let targetX = initialPosition.x;
  let targetY = initialPosition.y;

  let currentX = targetX;
  let currentY = targetY;

  const handleResize = (): void => {
    targetX = Math.min(targetX, window.innerWidth);
    targetY = Math.min(targetY, window.innerHeight);

    currentX = targetX;
    currentY = targetY;
  };

  const updateTarget = (event: PointerEvent): void => {
    targetX = event.clientX;
    targetY = event.clientY;

    sessionStorage.setItem(
      POSITION_KEY,
      JSON.stringify({
        x: targetX,
        y: targetY,
      }),
    );
  };

  document.addEventListener("pointermove", updateTarget);
  window.addEventListener("resize", handleResize);

  const animate = (): void => {
    currentX += (targetX - currentX) * settings.smoothing;
    currentY += (targetY - currentY) * settings.smoothing;

    overlay.style.setProperty("--flashlight-x", `${currentX}px`);
    overlay.style.setProperty("--flashlight-y", `${currentY}px`);

    animationFrame = requestAnimationFrame(animate);
  };

  animate();

  cleanup = () => {
    document.removeEventListener("pointermove", updateTarget);
    window.removeEventListener("resize", handleResize);

    cancelAnimationFrame(animationFrame);
    cleanup = null;
  };
}

function disableNightMode(): void {
  cleanup?.();

  document.getElementById(OVERLAY_ID)?.remove();
}
