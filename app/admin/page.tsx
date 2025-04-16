import { createClient } from "@/libs/supabase/server";
import { redirect } from "next/navigation";
import AdminSchoolsManager from "@/components/AdminSchoolsManager";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const supabase = createClient();
  
  // Check if user is authenticated and is an admin
  const {
    data: { user },
  } = await supabase.auth.getUser();
  
  if (!user) {
    redirect("/signin");
  }

  // Check if user is admin (you'll need to implement this check based on your auth setup)
  const { data: profile } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .single();

  if (!profile?.is_admin) {
    redirect("/dashboard");
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      <AdminSchoolsManager />
    </div>
  );
} 