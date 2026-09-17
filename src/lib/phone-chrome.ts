/** Phone chrome rules. Desktop (md+, ≥768px) is unchanged. */

export function isLessonBeat(pathname: string) {
  return /^\/learn\/[^/]+\/[^/]+$/.test(pathname);
}

export function isLingoItem(pathname: string) {
  return /^\/lingo\/[^/]+\/[^/]+$/.test(pathname);
}

export function isBrainImmersive(pathname: string) {
  return (
    pathname === "/brain/feed" ||
    pathname.startsWith("/brain/feed/") ||
    /^\/brain\/play\//.test(pathname)
  );
}

export function isLabTicket(pathname: string) {
  return pathname.startsWith("/lab/t/");
}

/** Duo-style: hide the five-tab bar while a beat / card is in progress. */
export function hidePhoneTabs(pathname: string) {
  return (
    isLessonBeat(pathname) ||
    isLingoItem(pathname) ||
    isBrainImmersive(pathname) ||
    isLabTicket(pathname)
  );
}

/** Player owns Back / × / mute — no TB header, Sign up, or Tech Lab pill. */
export function hidePhoneHeader(pathname: string) {
  return hidePhoneTabs(pathname);
}

export function isBrainFeed(pathname: string) {
  return pathname === "/brain/feed" || pathname.startsWith("/brain/feed/");
}
