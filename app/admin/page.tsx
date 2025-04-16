import { createClient } from "@/libs/supabase/server";
import { redirect } from "next/navigation";
import AdminContactsManager from "@/components/AdminContactsManager";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const supabase = createClient();
  
  // Check if user is authenticated and is an admin
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    redirect("/login");
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
    <main className="min-h-screen p-8 pb-24">
      <section className="max-w-6xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl md:text-4xl font-extrabold">Admin Dashboard</h1>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <AdminContactsManager />
        </div>
      </section>
    </main>
  );
} 