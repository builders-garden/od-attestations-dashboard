import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { adminAddresses } from "./constants";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function shorten(str: string, length = 4) {
  return str.length > length
    ? str.slice(0, 2 + length) + "..." + str.slice(-length)
    : str;
}

export function isAdmin(address: string | undefined) {
  if (!address) return false;
  return adminAddresses.includes(address);
}
