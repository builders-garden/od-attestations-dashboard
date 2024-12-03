import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { adminAddresses } from "./constants";
import { Config, UseAccountReturnType } from "wagmi";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function shorten(str: string, length = 4) {
  return str.length > length
    ? str.slice(0, 2 + length) + "..." + str.slice(-length)
    : str;
}

export function isAdmin(account: UseAccountReturnType<Config>) {
  if (!account.address) return false;
  return adminAddresses.includes(account.address);
}
