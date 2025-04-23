'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/libs/supabase/client';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

interface SchoolFormData {
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

export default function SchoolInformationForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasSchool, setHasSchool] = useState(false);
  const [formData, setFormData] = useState<SchoolFormData>(school ? {
    full_school_name: school.full_school_name || '',
    short_school_name: school.short_school_name || '',
    street_address: school.street_address || '',
    city: school.city || '',
    state: school.state || '',
    zip_code: school.zip_code || '',
    primary_contact: {
      full_name: school.primary_contact?.full_name || '',
      title: school.primary_contact?.title || '',
      email: school.primary_contact?.email || '',
      office_phone: school.primary_contact?.office_phone || '',
      cell_phone: school.primary_contact?.cell_phone || '',
    },
    secondary_contact: {
      full_name: school.secondary_contact?.full_name || '',
      title: school.secondary_contact?.title || '',
      email: school.secondary_contact?.email || '',
      office_phone: school.secondary_contact?.office_phone || '',
      cell_phone: school.secondary_contact?.cell_phone || '',
    },
  } : {
    full_school_name: '',
    short_school_name: '',
    street_address: '',
    city: '',
    state: '',
    zip_code: '',
    primary_contact: {
      full_name: '',
      title: '',
      email: '',
      office_phone: '',
      cell_phone: '',
    },
    secondary_contact: {
      full_name: '',
      title: '',
      email: '',
      office_phone: '',
      cell_phone: '',
    },
  });

  const supabase = createClient();

  useEffect(() => {
    async function fetchSchoolData() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('No user found');

        const { data: school, error } = await supabase
          .from('schools')
          .select(`
            *,
            primary_contact:contacts!primary_contact_id(*),
            secondary_contact:contacts!secondary_contact_id(*)
          `)
          .eq('user_id', user.id)
          .single();

        if (error) {
          if (error.code === 'PGRST116') {
            // No school found, this is expected for new users
            setHasSchool(false);
          } else {
            throw error;
          }
        } else if (school) {
          setHasSchool(true);
        }
      } catch (error) {
        console.error('Error fetching school data:', error);
        toast.error('Failed to load school information');
      } finally {
        setLoading(false);
      }
    }

    fetchSchoolData();
  }, []);

  const handleInputChange = (parent: keyof SchoolFormData, child: string, value: string) => {
    setFormData(prev => {
      const newData = { ...prev };
      if (parent === 'primary_contact' || parent === 'secondary_contact') {
        newData[parent] = {
          ...newData[parent],
          [child]: value
        };
      } else {
        newData[parent] = value as any;
      }
      return newData;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      if (hasSchool) {
        toast.error('You can only register one school. Updates are temporarily disabled.');
        return;
      }

      // Register new school
      // First, create primary contact
      const { data: primaryContact, error: primaryError } = await supabase
        .from('contacts')
        .insert({
          full_name: formData.primary_contact.full_name,
          title: formData.primary_contact.title,
          email: formData.primary_contact.email,
          office_phone: formData.primary_contact.office_phone,
          cell_phone: formData.primary_contact.cell_phone,
        })
        .select()
        .single();

      if (primaryError) throw primaryError;

      // Then, create secondary contact
      const { data: secondaryContact, error: secondaryError } = await supabase
        .from('contacts')
        .insert({
          full_name: formData.secondary_contact.full_name,
          title: formData.secondary_contact.title,
          email: formData.secondary_contact.email,
          office_phone: formData.secondary_contact.office_phone,
          cell_phone: formData.secondary_contact.cell_phone,
        })
        .select()
        .single();

      if (secondaryError) throw secondaryError;

      // Finally, create the school record
      const { error: schoolError } = await supabase
        .from('schools')
        .insert({
          user_id: user.id,
          full_school_name: formData.full_school_name,
          short_school_name: formData.short_school_name,
          street_address: formData.street_address,
          city: formData.city,
          state: formData.state,
          zip_code: formData.zip_code,
          primary_contact_id: primaryContact.id,
          secondary_contact_id: secondaryContact.id,
        });

      if (schoolError) throw schoolError;

      toast.success('School information saved successfully!');
      router.refresh();
    } catch (error) {
      console.error('Error saving school data:', error);
      toast.error('Failed to save school information');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading school information...</div>;
  }

  if (hasSchool) {
    return (
      <div className="text-center py-8">
        <h2 className="text-xl font-bold mb-4">School Information</h2>
        <p className="text-gray-600">You have already registered a school. Updates are temporarily disabled.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* School Information */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">School Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Full School Name</label>
            <input
              type="text"
              value={formData.full_school_name}
              onChange={(e) => handleInputChange('full_school_name', '', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Short School Name</label>
            <input
              type="text"
              value={formData.short_school_name}
              onChange={(e) => handleInputChange('short_school_name', '', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Street Address</label>
            <input
              type="text"
              value={formData.street_address}
              onChange={(e) => handleInputChange('street_address', '', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">City</label>
            <input
              type="text"
              value={formData.city}
              onChange={(e) => handleInputChange('city', '', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">State</label>
            <input
              type="text"
              value={formData.state}
              onChange={(e) => handleInputChange('state', '', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">ZIP Code</label>
            <input
              type="text"
              value={formData.zip_code}
              onChange={(e) => handleInputChange('zip_code', '', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>
        </div>
      </div>

      {/* Primary Contact */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">Primary Contact</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Full Name</label>
            <input
              type="text"
              value={formData.primary_contact.full_name}
              onChange={(e) => handleInputChange('primary_contact', 'full_name', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <input
              type="text"
              value={formData.primary_contact.title}
              onChange={(e) => handleInputChange('primary_contact', 'title', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={formData.primary_contact.email}
              onChange={(e) => handleInputChange('primary_contact', 'email', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Office Phone</label>
            <input
              type="tel"
              value={formData.primary_contact.office_phone}
              onChange={(e) => handleInputChange('primary_contact', 'office_phone', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Cell Phone</label>
            <input
              type="tel"
              value={formData.primary_contact.cell_phone}
              onChange={(e) => handleInputChange('primary_contact', 'cell_phone', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
        </div>
      </div>

      {/* Secondary Contact */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">Secondary Contact</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Full Name</label>
            <input
              type="text"
              value={formData.secondary_contact.full_name}
              onChange={(e) => handleInputChange('secondary_contact', 'full_name', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <input
              type="text"
              value={formData.secondary_contact.title}
              onChange={(e) => handleInputChange('secondary_contact', 'title', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={formData.secondary_contact.email}
              onChange={(e) => handleInputChange('secondary_contact', 'email', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Office Phone</label>
            <input
              type="tel"
              value={formData.secondary_contact.office_phone}
              onChange={(e) => handleInputChange('secondary_contact', 'office_phone', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Cell Phone</label>
            <input
              type="tel"
              value={formData.secondary_contact.cell_phone}
              onChange={(e) => handleInputChange('secondary_contact', 'cell_phone', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={saving || hasSchool}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Register School'}
        </button>
      </div>
    </form>
  );
} 