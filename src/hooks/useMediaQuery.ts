import { useSyncExternalStore } from 'react';

const noop = () => {};
const serverSnap = () => false;

function subscribe(query: string, cb: () => void) {
  const mql = window.matchMedia(query);
  mql.addEventListener?.('change', cb);
  return () => {
    mql.removeEventListener?.('change', cb);
  };
}

export function useMediaQuery(query: string) {
  return useSyncExternalStore(
    (cb) => (typeof window === 'undefined' ? noop : subscribe(query, cb)),
    () =>
      (typeof window !== 'undefined' && window.matchMedia(query).matches) ||
      false,
    serverSnap,
  );
}
