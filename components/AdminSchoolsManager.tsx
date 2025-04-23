"use client";

import React from "react";
import { createClient } from "@/libs/supabase/client";
import { useEffect, useState } from "react";
import { CSVLink } from "react-csv";

interface School {
  id: string;
  full_school_name: string;
  short_school_name: string;
  street_address: string;
  city: string;
  state: string;
  zip_code: string;
  user_id: string;
  primary_contact: {
    id: string;
    full_name: string;
    title: string;
    email: string;
    office_phone: string;
    cell_phone: string;
  };
  secondary_contact: {
    id: string;
    full_name: string;
    title: string;
    email: string;
    office_phone: string;
    cell_phone: string;
  };
}

interface UserProfile {
  id: string;
  email: string;
  is_subscribed: boolean;
}

export default function AdminSchoolsManager() {
  const [schools, setSchools] = useState<School[]>([]);
  const [filteredSchools, setFilteredSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingSchool, setEditingSchool] = useState<School | null>(null);
  const [userProfiles, setUserProfiles] = useState<Record<string, UserProfile>>({});
  const [supabase] = useState(() => createClient());

  useEffect(() => {
    let mounted = true;

    async function fetchData() {
      try {
        // Fetch schools
        const { data: schoolsData, error: schoolsError } = await supabase
          .from("schools")
          .select(`
            *,
            primary_contact:contacts!primary_contact_id(*),
            secondary_contact:contacts!secondary_contact_id(*)
          `)
          .order("created_at", { ascending: false });

        if (schoolsError) throw schoolsError;

        // Fetch user profiles for subscription status
        const { data: profilesData, error: profilesError } = await supabase
          .from("profiles")
          .select("id, email, is_subscribed");

        if (profilesError) throw profilesError;

        // Create a map of user profiles
        const profilesMap = profilesData?.reduce((acc, profile) => {
          acc[profile.id] = profile;
          return acc;
        }, {} as Record<string, UserProfile>);

        if (mounted) {
          setSchools(schoolsData || []);
          setFilteredSchools(schoolsData || []);
          setUserProfiles(profilesMap || {});
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : "Failed to fetch data");
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    fetchData();

    return () => {
      mounted = false;
    };
  }, [supabase]);

  useEffect(() => {
    const filtered = schools.filter(school => 
      school.full_school_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      school.short_school_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      school.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      school.state.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredSchools(filtered);
  }, [searchTerm, schools]);

  const handleEdit = async (school: School) => {
    try {
      console.log("Updating school:", school.id);
      
      // Update school information
      const { data: updatedSchool, error: schoolError } = await supabase
        .from("schools")
        .update({
          full_school_name: school.full_school_name,
          short_school_name: school.short_school_name,
          street_address: school.street_address,
          city: school.city,
          state: school.state,
          zip_code: school.zip_code
        })
        .eq("id", school.id);

      console.log("School update response:", { updatedSchool, schoolError });

      if (schoolError) {
        console.error("School update error:", schoolError);
        throw schoolError;
      }

      // Update primary contact
      const { data: updatedPrimary, error: primaryError } = await supabase
        .from("contacts")
        .update({
          full_name: school.primary_contact.full_name,
          title: school.primary_contact.title,
          email: school.primary_contact.email,
          office_phone: school.primary_contact.office_phone,
          cell_phone: school.primary_contact.cell_phone
        })
        .eq("id", school.primary_contact.id);

      console.log("Primary contact update response:", { updatedPrimary, primaryError });

      if (primaryError) {
        console.error("Primary contact update error:", primaryError);
        throw primaryError;
      }

      // Update secondary contact
      const { data: updatedSecondary, error: secondaryError } = await supabase
        .from("contacts")
        .update({
          full_name: school.secondary_contact.full_name,
          title: school.secondary_contact.title,
          email: school.secondary_contact.email,
          office_phone: school.secondary_contact.office_phone,
          cell_phone: school.secondary_contact.cell_phone
        })
        .eq("id", school.secondary_contact.id);

      console.log("Secondary contact update response:", { updatedSecondary, secondaryError });

      if (secondaryError) {
        console.error("Secondary contact update error:", secondaryError);
        throw secondaryError;
      }

      setEditingSchool(null);
      
      // Refresh the data
      const { data: updatedSchools, error: fetchError } = await supabase
        .from("schools")
        .select(`
          *,
          primary_contact:contacts!primary_contact_id(*),
          secondary_contact:contacts!secondary_contact_id(*)
        `)
        .order("created_at", { ascending: false });

      console.log("Data refresh response:", { updatedSchools, fetchError });

      if (fetchError) {
        console.error("Data refresh error:", fetchError);
        throw fetchError;
      }

      setSchools(updatedSchools || []);
      setFilteredSchools(updatedSchools || []);
    } catch (err) {
      console.error("Error updating school:", err);
      setError(err instanceof Error ? err.message : "Failed to update school");
    }
  };

  const prepareCSVData = () => {
    return filteredSchools.map(school => ({
      "School Name": school.full_school_name,
      "Short Name": school.short_school_name,
      "Address": school.street_address,
      "City": school.city,
      "State": school.state,
      "ZIP": school.zip_code,
      "Primary Contact Name": school.primary_contact.full_name,
      "Primary Contact Title": school.primary_contact.title,
      "Primary Contact Email": school.primary_contact.email,
      "Primary Contact Office": school.primary_contact.office_phone,
      "Primary Contact Cell": school.primary_contact.cell_phone,
      "Secondary Contact Name": school.secondary_contact.full_name,
      "Secondary Contact Title": school.secondary_contact.title,
      "Secondary Contact Email": school.secondary_contact.email,
      "Secondary Contact Office": school.secondary_contact.office_phone,
      "Secondary Contact Cell": school.secondary_contact.cell_phone,
      "Subscription Status": userProfiles[school.user_id]?.is_subscribed ? "Active" : "Inactive"
    }));
  };

  if (loading) {
    return <div className="text-center py-8">Loading schools...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center py-8">{error}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">School Registrations</h2>
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-500">
            Total Schools: {filteredSchools.length}
          </div>
          <CSVLink
            data={prepareCSVData()}
            filename="schools.csv"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Export to CSV
          </CSVLink>
        </div>
      </div>

      <div className="relative">
        <input
          type="text"
          placeholder="Search schools..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="space-y-6">
        {filteredSchools.map((school) => (
          <div
            key={school.id}
            className="bg-white p-6 rounded-lg shadow border border-gray-200"
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold">{school.full_school_name}</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => setEditingSchool(school)}
                  className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Edit
                </button>
                <span className={`px-3 py-1 rounded ${
                  userProfiles[school.user_id]?.is_subscribed
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}>
                  {userProfiles[school.user_id]?.is_subscribed ? "Subscribed" : "Not Subscribed"}
                </span>
              </div>
            </div>

            {editingSchool?.id === school.id ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Full School Name</label>
                    <input
                      type="text"
                      value={editingSchool.full_school_name}
                      onChange={(e) => setEditingSchool({...editingSchool, full_school_name: e.target.value})}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Short Name</label>
                    <input
                      type="text"
                      value={editingSchool.short_school_name}
                      onChange={(e) => setEditingSchool({...editingSchool, short_school_name: e.target.value})}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Address</label>
                    <input
                      type="text"
                      value={editingSchool.street_address}
                      onChange={(e) => setEditingSchool({...editingSchool, street_address: e.target.value})}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">City</label>
                    <input
                      type="text"
                      value={editingSchool.city}
                      onChange={(e) => setEditingSchool({...editingSchool, city: e.target.value})}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">State</label>
                    <input
                      type="text"
                      value={editingSchool.state}
                      onChange={(e) => setEditingSchool({...editingSchool, state: e.target.value})}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">ZIP Code</label>
                    <input
                      type="text"
                      value={editingSchool.zip_code}
                      onChange={(e) => setEditingSchool({...editingSchool, zip_code: e.target.value})}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setEditingSchool(null)}
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleEdit(editingSchool)}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="space-y-2">
                    <p><span className="font-medium">Short Name:</span> {school.short_school_name}</p>
                    <p><span className="font-medium">Address:</span> {school.street_address}</p>
                    <p><span className="font-medium">City:</span> {school.city}</p>
                    <p><span className="font-medium">State:</span> {school.state}</p>
                    <p><span className="font-medium">ZIP Code:</span> {school.zip_code}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-2">Primary Contact</h4>
                    <div className="space-y-1">
                      <p><span className="font-medium">Name:</span> {school.primary_contact.full_name}</p>
                      <p><span className="font-medium">Title:</span> {school.primary_contact.title}</p>
                      <p><span className="font-medium">Email:</span> {school.primary_contact.email}</p>
                      <p><span className="font-medium">Office Phone:</span> {school.primary_contact.office_phone}</p>
                      <p><span className="font-medium">Cell Phone:</span> {school.primary_contact.cell_phone}</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Secondary Contact</h4>
                    <div className="space-y-1">
                      <p><span className="font-medium">Name:</span> {school.secondary_contact.full_name}</p>
                      <p><span className="font-medium">Title:</span> {school.secondary_contact.title}</p>
                      <p><span className="font-medium">Email:</span> {school.secondary_contact.email}</p>
                      <p><span className="font-medium">Office Phone:</span> {school.secondary_contact.office_phone}</p>
                      <p><span className="font-medium">Cell Phone:</span> {school.secondary_contact.cell_phone}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}

        {filteredSchools.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            {searchTerm ? "No schools match your search." : "No schools have registered yet."}
          </div>
        )}
      </div>
    </div>
  );
} 