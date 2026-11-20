import { createButton } from "../../utils/elementFactory";

import "./button.css";

interface ButtonOptions {
  text: string;
  onClick?: () => void;
  variant?: "primary" | "secondary";
  className?: string;
}

export function renderButton({
  text,
  onClick,
  variant = "primary",
  className = "",
}: ButtonOptions): HTMLButtonElement {
  return createButton(
    text,
    onClick,
    `button button--${variant} ${className}`.trim(),
  );
}
