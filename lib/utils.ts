import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { base, sepolia } from "viem/chains";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function shorten(str: string, length = 4) {
  return str.length > length
    ? str.slice(0, 2 + length) + "..." + str.slice(-length)
    : str;
}

export function getEnvironmentChainId() {
  const isProduction = process.env.NODE_ENV === "production";
  if (isProduction) {
    return base.id;
  } else {
    return sepolia.id;
  }
}
