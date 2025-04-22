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

interface SchoolInformationFormProps {
  school?: any;
  onCancel?: () => void;
  onSuccess?: () => void;
}

export default function SchoolInformationForm({ school, onCancel, onSuccess }: SchoolInformationFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
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

        // If we already have school data passed in, use that instead of fetching
        if (school) {
          setFormData({
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
          });
          setLoading(false);
          return;
        }

        const { data: schoolData, error } = await supabase
          .from('schools')
          .select(`
            *,
            primary_contact:primary_contact_id(*),
            secondary_contact:secondary_contact_id(*)
          `)
          .eq('user_id', user.id)
          .single();

        if (error) throw error;

        if (schoolData) {
          setFormData({
            full_school_name: schoolData.full_school_name || '',
            short_school_name: schoolData.short_school_name || '',
            street_address: schoolData.street_address || '',
            city: schoolData.city || '',
            state: schoolData.state || '',
            zip_code: schoolData.zip_code || '',
            primary_contact: {
              full_name: schoolData.primary_contact?.full_name || '',
              title: schoolData.primary_contact?.title || '',
              email: schoolData.primary_contact?.email || '',
              office_phone: schoolData.primary_contact?.office_phone || '',
              cell_phone: schoolData.primary_contact?.cell_phone || '',
            },
            secondary_contact: {
              full_name: schoolData.secondary_contact?.full_name || '',
              title: schoolData.secondary_contact?.title || '',
              email: schoolData.secondary_contact?.email || '',
              office_phone: schoolData.secondary_contact?.office_phone || '',
              cell_phone: schoolData.secondary_contact?.cell_phone || '',
            },
          });
        }
      } catch (error) {
        console.error('Error fetching school data:', error);
        toast.error('Failed to load school information');
      } finally {
        setLoading(false);
      }
    }

    fetchSchoolData();
  }, [school]); // Add school as a dependency

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

      if (school) {
        console.log('Updating existing school:', school);
        console.log('Form data:', formData);

        // Update school information
        console.log('Attempting to update school with ID:', school.id);
        const { data: schoolUpdateData, error: schoolError } = await supabase
          .from('schools')
          .update({
            full_school_name: formData.full_school_name,
            short_school_name: formData.short_school_name,
            street_address: formData.street_address,
            city: formData.city,
            state: formData.state,
            zip_code: formData.zip_code,
            updated_at: new Date().toISOString()
          })
          .eq('id', school.id)
          .select();

        console.log('School update response:', { data: schoolUpdateData, error: schoolError });
        if (schoolError) {
          console.error('Error updating school:', schoolError);
          throw schoolError;
        }

        // Update primary contact
        console.log('Attempting to update primary contact with ID:', school.primary_contact_id);
        const { data: primaryUpdateData, error: primaryError } = await supabase
          .from('contacts')
          .update({
            full_name: formData.primary_contact.full_name,
            title: formData.primary_contact.title,
            email: formData.primary_contact.email,
            office_phone: formData.primary_contact.office_phone,
            cell_phone: formData.primary_contact.cell_phone,
          })
          .eq('id', school.primary_contact_id)
          .select();

        console.log('Primary contact update response:', { data: primaryUpdateData, error: primaryError });
        if (primaryError) {
          console.error('Error updating primary contact:', primaryError);
          throw primaryError;
        }

        // Update secondary contact
        console.log('Attempting to update secondary contact with ID:', school.secondary_contact_id);
        const { data: secondaryUpdateData, error: secondaryError } = await supabase
          .from('contacts')
          .update({
            full_name: formData.secondary_contact.full_name,
            title: formData.secondary_contact.title,
            email: formData.secondary_contact.email,
            office_phone: formData.secondary_contact.office_phone,
            cell_phone: formData.secondary_contact.cell_phone,
          })
          .eq('id', school.secondary_contact_id)
          .select();

        console.log('Secondary contact update response:', { data: secondaryUpdateData, error: secondaryError });
        if (secondaryError) {
          console.error('Error updating secondary contact:', secondaryError);
          throw secondaryError;
        }

        // Verify the updates
        console.log('Verifying updates...');
        const { data: verifyData, error: verifyError } = await supabase
          .from('schools')
          .select(`
            *,
            primary_contact:primary_contact_id(*),
            secondary_contact:secondary_contact_id(*),
            updated_at
          `)
          .eq('id', school.id)
          .single();

        console.log('Verification data:', verifyData);
        if (verifyError) {
          console.error('Error verifying updates:', verifyError);
          throw verifyError;
        }

        toast.success('School information updated successfully!');
        if (onSuccess) onSuccess();
        if (onCancel) onCancel();
      } else {
        // Register new school
        console.log('Registering new school...');
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

        console.log('Primary contact creation response:', { data: primaryContact, error: primaryError });
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

        console.log('Secondary contact creation response:', { data: secondaryContact, error: secondaryError });
        if (secondaryError) throw secondaryError;

        // Finally, create the school record
        const { data: newSchool, error: schoolError } = await supabase
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
          })
          .select()
          .single();

        console.log('School creation response:', { data: newSchool, error: schoolError });
        if (schoolError) throw schoolError;

        toast.success('School information saved successfully!');
        if (onSuccess) onSuccess();
        router.refresh();
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Error submitting form. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading school information...</div>;
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

      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={saving}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {saving ? 'Saving...' : school ? 'Save Changes' : 'Register School'}
        </button>
      </div>
    </form>
  );
} 