import { NextResponse } from "next/server";
import { createClient } from "@/libs/supabase/server";
import { getSafeAuthDestination } from "@/libs/auth";

export const dynamic = "force-dynamic";

// This route is called after a successful login. It exchanges the code for a session and redirects to the callback URL (see config.js).
export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = getSafeAuthDestination(requestUrl.searchParams.get("next"));

  if (code) {
    // Create Supabase client
    const supabase = createClient();

    try {
      // Exchange the code for a session
      const { data: { session }, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
      
      if (exchangeError) {
        console.error("Error exchanging code for session:", exchangeError);
        return NextResponse.redirect(`${requestUrl.origin}/signin?error=authentication_failed`);
      }

      if (session) {
        try {
          // Get user metadata that was passed during sign-up
          const metadata = session.user.user_metadata;
          
          // Existing profiles contain admin flags, billing links and contact
          // details. Only create a profile when it is genuinely missing.
          const { data: existingProfile, error: lookupError } = await supabase
            .from('profiles')
            .select('id')
            .eq('id', session.user.id)
            .maybeSingle();

          if (lookupError) throw lookupError;

          if (!existingProfile) {
            const { error: profileError } = await supabase
              .from('profiles')
              .insert({
                id: session.user.id,
                email: session.user.email,
                first_name: metadata?.first_name || '',
                last_name: metadata?.last_name || '',
                phone: metadata?.phone || '',
                updated_at: new Date().toISOString(),
              });

            if (profileError) {
              console.error("Error creating profile:", profileError);
              throw profileError;
            }
          }
          
          // Redirect to the intended destination
          return NextResponse.redirect(`${requestUrl.origin}${next}`);
        } catch (error) {
          console.error("Error in callback handler:", error);
          return NextResponse.redirect(`${requestUrl.origin}/signin?error=profile_unavailable`);
        }
      }
    } catch (error) {
      console.error("Error in auth callback:", error);
      return NextResponse.redirect(`${requestUrl.origin}/signin?error=authentication_failed`);
    }
  }

  // Something went wrong
  return NextResponse.redirect(`${requestUrl.origin}/signin?error=invalid_authentication_code`);
}
