import { NextResponse } from "next/server";
import { createClient } from "@/libs/supabase/server";

export const dynamic = "force-dynamic";

// This route is called after a successful login. It exchanges the code for a session and redirects to the callback URL (see config.js).
export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");

  if (code) {
    // Create Supabase client
    const supabase = createClient();

    // Exchange the code for a session
    const { data: { session }, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
    
    if (exchangeError) {
      console.error("Error exchanging code for session:", exchangeError);
      return NextResponse.redirect(`${requestUrl.origin}/error`);
    }

    if (session) {
      try {
        // Get user metadata that was passed during sign-up
        const metadata = session.user.user_metadata;
        
        // Create or update profile
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert({
            id: session.user.id,
            email: session.user.email,
            first_name: metadata?.first_name || '',
            last_name: metadata?.last_name || '',
            phone: metadata?.phone || '',
            updated_at: new Date().toISOString(),
          }, {
            onConflict: 'id',
            // Don't update these fields if they already exist
            ignoreDuplicates: false,
          });

        if (profileError) {
          console.error("Error updating profile:", profileError);
          throw profileError;
        }
        
        // Redirect to the dashboard
        return NextResponse.redirect(`${requestUrl.origin}/dashboard`);
      } catch (error) {
        console.error("Error in callback handler:", error);
        return NextResponse.redirect(`${requestUrl.origin}/error`);
      }
    }
  }

  // Something went wrong
  return NextResponse.redirect(`${requestUrl.origin}/error`);
}
