"use client";

import React from "react";
import { createClient } from "@/libs/supabase/client";
import { useEffect, useState } from "react";

interface School {
  id: string;
  full_school_name: string;
  short_school_name: string;
  street_address: string;
  city: string;
  state: string;
  zip_code: string;
  primary_contact: {
    full_name: string;
    title: string;
    email: string;
    office_phone: string;
    cell_phone: string;
  };
  secondary_contact: {
    full_name: string;
    title: string;
    email: string;
    office_phone: string;
    cell_phone: string;
  };
}

export default function AdminSchoolsManager() {
  const [schools, setSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [supabase] = useState(() => createClient());

  useEffect(() => {
    let mounted = true;

    async function fetchSchools() {
      try {
        const { data, error } = await supabase
          .from("schools")
          .select(`
            *,
            primary_contact:contacts!primary_contact_id(*),
            secondary_contact:contacts!secondary_contact_id(*)
          `)
          .order("created_at", { ascending: false });

        if (error) throw error;
        if (mounted) {
          setSchools(data || []);
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : "Failed to fetch schools");
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    fetchSchools();

    return () => {
      mounted = false;
    };
  }, [supabase]);

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
        <div className="text-sm text-gray-500">
          Total Schools: {schools.length}
        </div>
      </div>

      <div className="space-y-6">
        {schools.map((school) => (
          <div
            key={school.id}
            className="bg-white p-6 rounded-lg shadow border border-gray-200"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-xl font-bold mb-2">{school.full_school_name}</h3>
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
          </div>
        ))}

        {schools.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No schools have registered yet.
          </div>
        )}
      </div>
    </div>
  );
} 