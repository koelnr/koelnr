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

export function getFirebaseError(code: string): string {
  switch (code) {
    case "auth/invalid-credential":
      return "Invalid email or password.";
    case "auth/user-not-found":
      return "No account found with this email.";
    case "auth/wrong-password":
      return "Incorrect password.";
    case "auth/too-many-requests":
      return "Too many attempts. Please try again later.";
    case "auth/user-disabled":
      return "This account has been disabled.";
    case "auth/email-already-in-use":
      return "An account with this email already exists.";
    case "auth/invalid-email":
      return "Please enter a valid email address.";
    case "auth/weak-password":
      return "Password should be at least 6 characters.";
    case "auth/operation-not-allowed":
      return "Email/password sign up is not enabled.";
    case "auth/popup-closed-by-user":
      return "Sign-in popup was closed.";
    default:
      return "Something went wrong. Please try again.";
  }
}
