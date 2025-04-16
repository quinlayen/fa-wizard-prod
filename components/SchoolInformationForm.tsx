'use client';

import React from 'react';
import { useState } from 'react';
import { createClient } from '@/libs/supabase/client';

interface ContactFormData {
  fullName: string;
  title: string;
  email: string;
  officePhone: string;
  cellPhone: string;
}

interface SchoolFormData {
  fullSchoolName: string;
  shortSchoolName: string;
  streetAddress: string;
  city: string;
  state: string;
  zipCode: string;
  primaryContact: ContactFormData;
  secondaryContact: ContactFormData;
}

export default function SchoolInformationForm() {
  const [formData, setFormData] = useState<SchoolFormData>({
    fullSchoolName: '',
    shortSchoolName: '',
    streetAddress: '',
    city: '',
    state: '',
    zipCode: '',
    primaryContact: {
      fullName: '',
      title: '',
      email: '',
      officePhone: '',
      cellPhone: '',
    },
    secondaryContact: {
      fullName: '',
      title: '',
      email: '',
      officePhone: '',
      cellPhone: '',
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    
    try {
      // First, insert primary contact
      const { data: primaryContact, error: primaryError } = await supabase
        .from('contacts')
        .insert([{
          full_name: formData.primaryContact.fullName,
          title: formData.primaryContact.title,
          email: formData.primaryContact.email,
          office_phone: formData.primaryContact.officePhone,
          cell_phone: formData.primaryContact.cellPhone,
        }])
        .select()
        .single();

      if (primaryError) throw primaryError;

      // Then, insert secondary contact
      const { data: secondaryContact, error: secondaryError } = await supabase
        .from('contacts')
        .insert([{
          full_name: formData.secondaryContact.fullName,
          title: formData.secondaryContact.title,
          email: formData.secondaryContact.email,
          office_phone: formData.secondaryContact.officePhone,
          cell_phone: formData.secondaryContact.cellPhone,
        }])
        .select()
        .single();

      if (secondaryError) throw secondaryError;

      // Finally, insert school with references to both contacts
      const { error: schoolError } = await supabase
        .from('schools')
        .insert([{
          full_school_name: formData.fullSchoolName,
          short_school_name: formData.shortSchoolName,
          street_address: formData.streetAddress,
          city: formData.city,
          state: formData.state,
          zip_code: formData.zipCode,
          primary_contact_id: primaryContact.id,
          secondary_contact_id: secondaryContact.id,
        }]);

      if (schoolError) throw schoolError;
      
      alert('School information submitted successfully!');
      // Reset form
      setFormData({
        fullSchoolName: '',
        shortSchoolName: '',
        streetAddress: '',
        city: '',
        state: '',
        zipCode: '',
        primaryContact: {
          fullName: '',
          title: '',
          email: '',
          officePhone: '',
          cellPhone: '',
        },
        secondaryContact: {
          fullName: '',
          title: '',
          email: '',
          officePhone: '',
          cellPhone: '',
        },
      });
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Error submitting form. Please try again.');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof SchoolFormData],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">School Information</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Full School Name</label>
            <input
              type="text"
              name="fullSchoolName"
              value={formData.fullSchoolName}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Short School Name</label>
            <input
              type="text"
              name="shortSchoolName"
              value={formData.shortSchoolName}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Street Address</label>
          <input
            type="text"
            name="streetAddress"
            value={formData.streetAddress}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">City</label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">State</label>
            <input
              type="text"
              name="state"
              value={formData.state}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">ZIP Code</label>
            <input
              type="text"
              name="zipCode"
              value={formData.zipCode}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Primary Contact Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Full Name</label>
            <input
              type="text"
              name="primaryContact.fullName"
              value={formData.primaryContact.fullName}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <input
              type="text"
              name="primaryContact.title"
              value={formData.primaryContact.title}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              name="primaryContact.email"
              value={formData.primaryContact.email}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Office Phone</label>
            <input
              type="tel"
              name="primaryContact.officePhone"
              value={formData.primaryContact.officePhone}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Cell Phone</label>
            <input
              type="tel"
              name="primaryContact.cellPhone"
              value={formData.primaryContact.cellPhone}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Secondary Contact Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Full Name</label>
            <input
              type="text"
              name="secondaryContact.fullName"
              value={formData.secondaryContact.fullName}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <input
              type="text"
              name="secondaryContact.title"
              value={formData.secondaryContact.title}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              name="secondaryContact.email"
              value={formData.secondaryContact.email}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Office Phone</label>
            <input
              type="tel"
              name="secondaryContact.officePhone"
              value={formData.secondaryContact.officePhone}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Cell Phone</label>
            <input
              type="tel"
              name="secondaryContact.cellPhone"
              value={formData.secondaryContact.cellPhone}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
        </div>
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
      >
        Submit School Information
      </button>
    </form>
  );
} 