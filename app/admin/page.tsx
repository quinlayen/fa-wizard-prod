import { createClient } from "@/libs/supabase/server";
import { redirect } from "next/navigation";
import AdminSchoolsManager from "@/components/AdminSchoolsManager";
import AdminUsersManager from "@/components/AdminUsersManager";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const supabase = createClient();
  
  // Check if user is authenticated and is an admin
  const {
    data: { user },
  } = await supabase.auth.getUser();
  
  if (!user) {
    redirect("/signin?next=%2Fadmin");
  }

  // Check if user is admin (you'll need to implement this check based on your auth setup)
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .single();

  if (profileError) {
    console.error("Admin profile lookup failed:", profileError.code);
    throw new Error("Unable to verify admin access. Please try again later.");
  }

  if (!profile?.is_admin) {
    redirect("/dashboard");
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      <div className="space-y-12">
        <AdminUsersManager />
        <AdminSchoolsManager />
      </div>
    </div>
  );
}
