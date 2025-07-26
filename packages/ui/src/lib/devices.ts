export function isAndroid(): boolean {
  return typeof navigator !== 'undefined' && /android/i.test(navigator.userAgent);
}

function isSmallIos(): boolean {
  return typeof navigator !== 'undefined' && /iPhone|iPod/i.test(navigator.userAgent);
}

function isLargeIos(): boolean {
  return (
    (typeof navigator !== 'undefined' && /iPad/i.test(navigator.userAgent)) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
  );
}

export function isIos(): boolean {
  return isSmallIos() || isLargeIos();
}

export function isMobile(): boolean {
  return isAndroid() || isIos();
}
