'use client';

import ButtonAccount from "@/components/ButtonAccount";
import SchoolInformationForm from "@/components/SchoolInformationForm";
import SubscribeForm from "@/components/SubscribeForm";
import { createClient } from "@/libs/supabase/client"
import Link from "next/link";
import { useState, useEffect } from "react";

export const dynamic = "force-dynamic";

export default function Dashboard() {
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [showNewForm, setShowNewForm] = useState(false);
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
    setShowNewForm(false);
    // Refresh the schools list
    const fetchSchools = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return;

      const { data, error } = await supabase
        .from('schools')
        .select(`
          *,
          primary_contact:primary_contact_id(*),
          secondary_contact:secondary_contact_id(*)
        `)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error refreshing schools:', error);
      } else {
        setSchools(data || []);
      }
    };

    fetchSchools();
  };

  return (
    <main className="min-h-screen p-8 pb-24">
      <section className="max-w-4xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <ButtonAccount />
          {user && profile?.is_admin && (
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
              <h2 className="text-2xl font-bold mb-6">School Registration</h2>
              {schools.length > 0 ? (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-semibold">Your Registered Schools</h3>
                    <div className="space-x-4">
                      <button
                        onClick={() => setShowNewForm(true)}
                        disabled={showUpdateForm || showNewForm}
                        className={`px-4 py-2 rounded ${
                          showUpdateForm || showNewForm
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-green-600 hover:bg-green-700'
                        } text-white`}
                      >
                        Register New School
                      </button>
                    </div>
                  </div>
                  {schools.map((school) => (
                    <div key={school.id} className="border p-4 rounded">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-bold text-lg mb-4">School Information:</h4>
                          <div className="space-y-2">
                            <p><span className="font-semibold">Full School Name:</span> {school.full_school_name}</p>
                            <p><span className="font-semibold">Short School Name:</span> {school.short_school_name}</p>
                            <p><span className="font-semibold">Address:</span> {school.street_address}</p>
                            <p><span className="font-semibold">City:</span> {school.city}</p>
                            <p><span className="font-semibold">State:</span> {school.state}</p>
                            <p><span className="font-semibold">ZIP Code:</span> {school.zip_code}</p>
                            <p><span className="font-semibold">Last Updated:</span> {new Date(school.updated_at).toLocaleString()}</p>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-bold text-lg mb-4">Contact Information:</h4>
                          <div className="space-y-4">
                            <div>
                              <h5 className="font-bold mb-2">Primary Contact:</h5>
                              <div className="space-y-1">
                                <p><span className="font-semibold">Name:</span> {school.primary_contact?.full_name}</p>
                                <p><span className="font-semibold">Title:</span> {school.primary_contact?.title}</p>
                                <p><span className="font-semibold">Email:</span> {school.primary_contact?.email}</p>
                                <p><span className="font-semibold">Office Phone:</span> {school.primary_contact?.office_phone}</p>
                                <p><span className="font-semibold">Cell Phone:</span> {school.primary_contact?.cell_phone}</p>
                              </div>
                            </div>
                            <div>
                              <h5 className="font-bold mb-2">Secondary Contact:</h5>
                              <div className="space-y-1">
                                {school.secondary_contact && (
                                  <>
                                    <p><span className="font-semibold">Name:</span> {school.secondary_contact.full_name}</p>
                                    <p><span className="font-semibold">Title:</span> {school.secondary_contact.title}</p>
                                    <p><span className="font-semibold">Email:</span> {school.secondary_contact.email}</p>
                                    <p><span className="font-semibold">Office Phone:</span> {school.secondary_contact.office_phone}</p>
                                    <p><span className="font-semibold">Cell Phone:</span> {school.secondary_contact.cell_phone}</p>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-end mt-4">
                        <button
                          onClick={() => {
                            setShowUpdateForm(true);
                            setSchools([school]);
                          }}
                          className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                        >
                          Update School Information
                        </button>
                      </div>
                    </div>
                  ))}
                  {showUpdateForm && (
                    <SchoolInformationForm 
                      school={schools[0]} 
                      onCancel={() => setShowUpdateForm(false)}
                      onSuccess={handleUpdateSuccess}
                    />
                  )}
                </div>
              ) : (
                <SchoolInformationForm />
              )}
            </div>
{/* 
            {schools.length > 0 && (
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
                          <p>{school.primary_contact?.full_name}</p>
                          <p>{school.primary_contact?.title}</p>
                          <p>{school.primary_contact?.email}</p>
                          <p>{school.primary_contact?.office_phone}</p>
                          <p>{school.primary_contact?.cell_phone}</p>
                        </div>
                        <div>
                          <h4 className="font-semibold">Secondary Contact</h4>
                          {school.secondary_contact && (
                            <>
                              <p>{school.secondary_contact.full_name}</p>
                              <p>{school.secondary_contact.title}</p>
                              <p>{school.secondary_contact.email}</p>
                              <p>{school.secondary_contact.office_phone}</p>
                              <p>{school.secondary_contact.cell_phone}</p>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )} */}
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
