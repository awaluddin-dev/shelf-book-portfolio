import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function secureMathRandom() {
  const cryptoObj = typeof crypto !== 'undefined' ? crypto : (typeof window !== 'undefined' ? window.crypto : null);
  if (cryptoObj?.getRandomValues) {
    const array = new Uint32Array(1);
    cryptoObj.getRandomValues(array);
    return array[0] / 4294967295;
  }
  return Math.random(); // NOSONAR
}
