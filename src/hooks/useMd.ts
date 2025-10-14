import { useMediaQuery } from './useMediaQuery';

function readVar(name: string, fallback: string) {
  if (typeof window === 'undefined') return fallback;
  const v = getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim();
  return v || fallback;
}

export function useMd() {
  const md = readVar('--breakpoint-md', '768px');
  return useMediaQuery(`(min-width: ${md})`);
}
