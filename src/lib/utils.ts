import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getDevice(): string {
  const ua = navigator.userAgent;
  if (/mobile/i.test(ua)) return "Mobile";
  if (/tablet/i.test(ua) || /ipad/i.test(ua)) return "Tablet";
  return "Desktop";
}

export function getOS(): string {
  const ua = navigator.userAgent;
  if (/windows/i.test(ua)) return "Windows";
  if (/mac/i.test(ua)) return "macOS";
  if (/linux/i.test(ua)) return "Linux";
  if (/android/i.test(ua)) return "Android";
  if (/ios|iphone|ipad/i.test(ua)) return "iOS";
  return "Unknown";
}

export function getBrowser(): string {
  const ua = navigator.userAgent;
  if (/chrome/i.test(ua) && !/edge/i.test(ua)) return "Chrome";
  if (/safari/i.test(ua) && !/chrome/i.test(ua)) return "Safari";
  if (/firefox/i.test(ua)) return "Firefox";
  if (/edge/i.test(ua)) return "Edge";
  return "Unknown";
}