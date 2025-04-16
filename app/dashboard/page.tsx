import ButtonAccount from "@/components/ButtonAccount";
import SchoolInformationForm from "@/components/SchoolInformationForm";
import {createClient} from "@/libs/supabase/server"
import Link from "next/link";

export const dynamic = "force-dynamic";

// This is a private page: It's protected by the layout.js component which ensures the user is authenticated.
// It's a server compoment which means you can fetch data (like the user profile) before the page is rendered.
// See https://shipfa.st/docs/tutorials/private-page
export default async function Dashboard() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: profile } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user?.id)
    .single();
  
  const { data: schools } = await supabase
    .from("schools")
    .select(`
      *,
      primary_contact:contacts!primary_contact_id(*),
      secondary_contact:contacts!secondary_contact_id(*)
    `);
  
  return (
    <main className="min-h-screen p-8 pb-24">
      <section className="max-w-4xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <ButtonAccount />
          {profile?.is_admin && (
            <Link 
              href="/admin"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Admin Dashboard
            </Link>
          )}
        </div>
        
        <h1 className="text-3xl md:text-4xl font-extrabold">Customer Information</h1>
        
        {/* Temporary section to display user ID and admin status */}
        {user && (
          <div className="bg-yellow-100 p-4 rounded-lg">
            <h2 className="font-bold mb-2">Your User ID (for admin setup):</h2>
            <p className="font-mono bg-white p-2 rounded">{user.id}</p>
            <p className="text-sm mt-2">Copy this ID to make yourself an admin in the SQL editor.</p>
            <p className="text-sm mt-2">
              Current admin status: {profile?.is_admin ? "✅ You are an admin" : "❌ You are not an admin"}
            </p>
          </div>
        )}
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-6">School Registration</h2>
          <SchoolInformationForm />
        </div>

        {schools && schools.length > 0 && (
          <div className="bg-white p-6 rounded-lg shadow mt-8">
            <h2 className="text-2xl font-bold mb-6">Registered Schools</h2>
            <div className="space-y-4">
              {schools.map((school) => (
                <div key={school.id} className="border p-4 rounded">
                  <h3 className="font-bold text-lg">{school.full_school_name}</h3>
                  <p className="text-gray-600">{school.short_school_name}</p>
                  <p className="mt-2">
                    {school.street_address}, {school.city}, {school.state} {school.zip_code}
                  </p>
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold">Primary Contact</h4>
                      <p>{school.primary_contact.full_name}</p>
                      <p>{school.primary_contact.title}</p>
                      <p>{school.primary_contact.email}</p>
                      <p>{school.primary_contact.office_phone}</p>
                      <p>{school.primary_contact.cell_phone}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold">Secondary Contact</h4>
                      <p>{school.secondary_contact.full_name}</p>
                      <p>{school.secondary_contact.title}</p>
                      <p>{school.secondary_contact.email}</p>
                      <p>{school.secondary_contact.office_phone}</p>
                      <p>{school.secondary_contact.cell_phone}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
