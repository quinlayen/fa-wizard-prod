'use client';

import ButtonAccount from "@/components/ButtonAccount";
import SchoolInformationForm from "@/components/SchoolInformationForm";
import SubscribeForm from "@/components/SubscribeForm";
import { createClient } from "@/libs/supabase/client"
import Link from "next/link";
import { useState, useEffect } from "react";
import config from "@/config";

export const dynamic = "force-dynamic";

export default function Dashboard() {
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [schools, setSchools] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setError('No user found');
        setLoading(false);
        return;
      }

      setUser(user);

      // Fetch user profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError) {
        setError(profileError.message);
        setLoading(false);
        return;
      }

      setProfile(profile);

      const { data, error } = await supabase
        .from('schools')
        .select(`
          *,
          primary_contact:primary_contact_id(*),
          secondary_contact:secondary_contact_id(*)
        `)
        .eq('user_id', user.id);

      if (error) {
        setError(error.message);
      } else {
        setSchools(data || []);
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const handleUpdateSuccess = () => {
    setShowUpdateForm(false);
    // Refresh the schools list
    const fetchSchools = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return;

      const { data } = await supabase
        .from('schools')
        .select(`
          *,
          primary_contact:primary_contact_id(*),
          secondary_contact:secondary_contact_id(*)
        `)
        .eq('user_id', user.id);

      if (data) {
        setSchools(data);
      }
    };

    fetchSchools();
  };

  return (
    <main className="min-h-screen p-8 pb-24">
      <section className="max-w-4xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <ButtonAccount />
          {profile?.is_admin && (
            <Link 
              href="/admin"
              className="bg-[#003767] text-white px-4 py-2 rounded hover:bg-[#002a4d]"
            >
              Admin Dashboard
            </Link>
          )}
        </div>
        
        <h1 className="text-3xl md:text-4xl font-extrabold">
          {profile?.is_subscribed ? "Customer Information" : "Subscribe to FA Wizard"}
        </h1>
        
        {/* Temporary section to display user ID and admin status */}
        {user && (
          <div className="bg-yellow-100 p-4 rounded-lg">
            <h2 className="font-bold mb-2">Your User ID (for admin setup):</h2>
            <p className="font-mono bg-white p-2 rounded">{user.id}</p>
            <p className="text-sm mt-2">Copy this ID to make yourself an admin in the SQL editor.</p>
            <p className="text-sm mt-2">
              Current admin status: {profile?.is_admin ? "✅ You are an admin" : "❌ You are not an admin"}
            </p>
            <p className="text-sm mt-2">
              Subscription status: {profile?.is_subscribed ? "✅ You are subscribed" : "❌ You are not subscribed"}
            </p>
          </div>
        )}
        
        {profile?.is_subscribed ? (
          <>
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-2xl font-bold mb-6">School Information</h2>
              {schools.length > 0 ? (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-semibold">Your Registered School</h3>
                    <button
                      onClick={() => setShowUpdateForm(true)}
                      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                      Update School Information
                    </button>
                  </div>
                  
                  {showUpdateForm ? (
                    <div className="text-center py-8">
                      <p className="text-red-600 mb-4">School information updates are temporarily disabled.</p>
                      <p className="text-gray-600 mb-4">
                        If you need to update your school information, please contact our support team at{' '}
                        <a href={`mailto:${config.resend.supportEmail}`} className="text-blue-600 hover:underline">
                          {config.resend.supportEmail}
                        </a>
                      </p>
                      <button
                        onClick={() => setShowUpdateForm(false)}
                        className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                      >
                        Back to School Information
                      </button>
                    </div>
                  ) : (
                    <div className="border p-4 rounded">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-semibold text-lg mb-4">School Information</h4>
                          <div className="space-y-2">
                            <p><span className="font-medium">Full School Name:</span> {schools[0].full_school_name}</p>
                            <p><span className="font-medium">Short School Name:</span> {schools[0].short_school_name}</p>
                            <p><span className="font-medium">Address:</span> {schools[0].street_address}</p>
                            <p><span className="font-medium">City:</span> {schools[0].city}</p>
                            <p><span className="font-medium">State:</span> {schools[0].state}</p>
                            <p><span className="font-medium">ZIP Code:</span> {schools[0].zip_code}</p>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-semibold text-lg mb-4">Contact Information</h4>
                          <div className="space-y-4">
                            <div>
                              <h5 className="font-medium mb-2">Primary Contact</h5>
                              <div className="space-y-1">
                                <p><span className="font-medium">Name:</span> {schools[0].primary_contact?.full_name}</p>
                                <p><span className="font-medium">Title:</span> {schools[0].primary_contact?.title}</p>
                                <p><span className="font-medium">Email:</span> {schools[0].primary_contact?.email}</p>
                                <p><span className="font-medium">Office Phone:</span> {schools[0].primary_contact?.office_phone}</p>
                                <p><span className="font-medium">Cell Phone:</span> {schools[0].primary_contact?.cell_phone}</p>
                              </div>
                            </div>
                            <div>
                              <h5 className="font-medium mb-2">Secondary Contact</h5>
                              <div className="space-y-1">
                                {schools[0].secondary_contact && (
                                  <>
                                    <p><span className="font-medium">Name:</span> {schools[0].secondary_contact.full_name}</p>
                                    <p><span className="font-medium">Title:</span> {schools[0].secondary_contact.title}</p>
                                    <p><span className="font-medium">Email:</span> {schools[0].secondary_contact.email}</p>
                                    <p><span className="font-medium">Office Phone:</span> {schools[0].secondary_contact.office_phone}</p>
                                    <p><span className="font-medium">Cell Phone:</span> {schools[0].secondary_contact.cell_phone}</p>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <SchoolInformationForm onSuccess={handleUpdateSuccess} />
              )}
            </div>
          </>
        ) : (
          <div className="bg-white p-6 rounded-lg shadow">
            <SubscribeForm />
          </div>
        )}
      </section>
    </main>
  );
}
