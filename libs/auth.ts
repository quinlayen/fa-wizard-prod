export function getSafeAuthDestination(next: string | null | undefined): string {
  if (!next || !next.startsWith("/") || next.startsWith("//") || /[\\\r\n]/.test(next)) {
    return "/dashboard";
  }
  // Limit magic-link redirects to the application's protected destinations.
  const destination = new URL(next, "https://auth.local");
  const pathname = destination.pathname;
  return pathname === "/admin" || pathname === "/dashboard" || pathname.startsWith("/dashboard/")
    ? `${pathname}${destination.search}${destination.hash}`
    : "/dashboard";
}

export function getAuthCallbackUrl(domain: string, next?: string | null): string {
  const baseUrl = /^https?:\/\//.test(domain) ? domain : `https://${domain}`;
  const callback = new URL("/api/auth/callback", baseUrl);
  callback.searchParams.set("next", getSafeAuthDestination(next));
  return callback.toString();
}
