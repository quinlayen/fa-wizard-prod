import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  // Get the current URL from the browser
  const currentUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const isLocalhost = currentUrl.includes('localhost');
  
  // Use the current URL for redirects
  const redirectUrl = `${currentUrl}/api/auth/callback`;

  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        flowType: 'pkce',
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
        redirectTo: redirectUrl,
      }
    }
  );
}
