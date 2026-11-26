import "./nightMode.css";

import { createButton, createElement } from "../../utils/elementFactory";
import jumpscareImage from "../../assets/jumpscare.png";

const STORAGE_KEY = "night-mode-enabled";
const OVERLAY_ID = "night-mode-overlay";
const BUTTON_ID = "night-mode-toggle";
const POSITION_KEY = "night-mode-position";
const EASTER_EGG_ID = "night-mode-easter-egg";

interface FlashlightPosition {
  x: number;
  y: number;
}

interface NightModeOptions {
  smoothing?: number;
}

type EasterEggStage = "idle" | "warning" | "jumpscare";

const DEFAULT_OPTIONS: Required<NightModeOptions> = {
  smoothing: 0.12,
};

const whisperAudio = new Audio(
  new URL("../../assets/whisper.mp3", import.meta.url).href,
);
const screamAudio = new Audio(
  new URL("../../assets/scream.mp3", import.meta.url).href,
);

whisperAudio.volume = 0.4;
screamAudio.volume = 1;

let isEnabled = false;
let animationFrame = 0;
let cleanup: (() => void) | null = null;

let easterEggStage: EasterEggStage = "idle";

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

export function handleNightModeLogoClick(event: MouseEvent): void {
  if (!isEnabled) return;

  event.preventDefault();
  event.stopPropagation();

  if (easterEggStage !== "idle") return;

  easterEggStage = "warning";

  showEasterEggMessage();
}

export function isEasterEggWarningActive(): boolean {
  return isEnabled && easterEggStage === "warning";
}

export function triggerEasterEggJumpscare(): void {
  if (!isEasterEggWarningActive()) return;

  easterEggStage = "jumpscare";

  showJumpscare();
}

function handleNavigationDuringEasterEgg(event: MouseEvent): void {
  if (!isEnabled || easterEggStage !== "warning") return;

  const target = event.target;

  if (!(target instanceof Element)) return;

  const link = target.closest<HTMLAnchorElement>("a[href]");

  if (!link) return;

  if (
    link.origin !== window.location.origin ||
    link.target === "_blank" ||
    link.hasAttribute("download")
  ) {
    return;
  }

  if (
    link.pathname === window.location.pathname &&
    link.search === window.location.search &&
    link.hash
  ) {
    return;
  }

  event.preventDefault();
  event.stopImmediatePropagation();

  easterEggStage = "jumpscare";

  showJumpscare();
}

function showEasterEggMessage(): void {
  const message = createElement("div", {
    id: EASTER_EGG_ID,
    className: "night-mode__easter-egg night-mode__easter-egg--message",
    textContent: "DON'T LEAVE",
  });

  document.body.append(message);

  whisperAudio.currentTime = 0;

  whisperAudio.play().catch((error: unknown) => {
    console.warn("Не удалось воспроизвести шёпот:", error);
  });

  whisperAudio.addEventListener(
    "ended",
    () => {
      message.remove();
      resetEasterEgg();
    },
    {
      once: true,
    },
  );
}

function showJumpscare(): void {
  document.getElementById(EASTER_EGG_ID)?.remove();

  const image = createElement("img", {
    src: jumpscareImage,
    alt: "Скример",
    className: "night-mode__jumpscare",
  });

  const container = createElement("div", {
    id: EASTER_EGG_ID,
    className: "night-mode__easter-egg night-mode__easter-egg--jumpscare",
  });

  container.append(image);
  document.body.append(container);

  whisperAudio.pause();
  whisperAudio.currentTime = 0;

  screamAudio.currentTime = 0;

  screamAudio.addEventListener("ended", finishJumpscare, {
    once: true,
  });

  void screamAudio.play().catch((error: unknown) => {
    console.warn("Не удалось воспроизвести звук скримера:", error);
    finishJumpscare();
  });
}

function finishJumpscare(): void {
  if (!isEnabled) return;

  disableNightMode();

  isEnabled = false;

  localStorage.setItem(STORAGE_KEY, "false");

  const button = document.getElementById(BUTTON_ID);

  button?.classList.remove("night-mode__toggle--active");
  button?.setAttribute("aria-pressed", "false");
  button?.setAttribute("aria-label", "Включить ночной режим");
}

function resetEasterEgg(): void {
  whisperAudio.pause();
  whisperAudio.currentTime = 0;
  document.getElementById(EASTER_EGG_ID)?.remove();

  screamAudio.removeEventListener("ended", finishJumpscare);
  screamAudio.pause();
  screamAudio.currentTime = 0;

  easterEggStage = "idle";
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
    currentX = Math.min(targetX, window.innerWidth);
    currentY = Math.min(targetY, window.innerHeight);
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

  document.addEventListener("click", handleNavigationDuringEasterEgg, true);

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

    document.removeEventListener(
      "click",
      handleNavigationDuringEasterEgg,
      true,
    );

    cleanup = null;
  };
}

function disableNightMode(): void {
  cleanup?.();

  resetEasterEgg();

  document.getElementById(OVERLAY_ID)?.remove();
}
