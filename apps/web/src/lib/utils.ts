import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const PLACEHOLDER_BASE = "https://placehold.harshsandhu.com/api/img";

export function createPlaceholderImg(
  w: number,
  h: number,
  bg = "0a0a0a",
  fg = "fafafa",
) {
  return `${PLACEHOLDER_BASE}?w=${w}&h=${h}&bg=${bg}&fg=${fg}`;
}
