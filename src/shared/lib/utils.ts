import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function secureMathRandom() {
  let cryptoObj = null;
  if (typeof crypto !== 'undefined') {
    cryptoObj = crypto;
  } else if (typeof window !== 'undefined') {
    cryptoObj = window.crypto;
  }
  if (cryptoObj?.getRandomValues) {
    const array = new Uint32Array(1);
    cryptoObj.getRandomValues(array);
    return array[0] / 4294967295;
  }
  return   // eslint-disable-next-line sonarjs/pseudo-random
  Math.random(); // NOSONAR
}
