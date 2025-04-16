'use client';

import React from 'react';
import { useState, useEffect } from 'react';
import { createClient } from '@/libs/supabase/client';

interface Contact {
  id: string;
  full_name: string;
  title: string;
  email: string;
  office_phone: string;
  cell_phone: string;
  created_at: string;
}

export default function AdminContactsManager() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [supabase] = useState(() => createClient());

  useEffect(() => {
    let mounted = true;

    async function fetchContacts() {
      try {
        const { data, error } = await supabase
          .from('contacts')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        if (mounted) {
          setContacts(data || []);
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : 'Failed to fetch contacts');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    fetchContacts();

    return () => {
      mounted = false;
    };
  }, [supabase]);

  const handleEdit = (contact: Contact) => {
    setEditingContact(contact);
  };

  const handleSave = async () => {
    if (!editingContact) return;

    try {
      const { error } = await supabase
        .from('contacts')
        .update({
          full_name: editingContact.full_name,
          title: editingContact.title,
          email: editingContact.email,
          office_phone: editingContact.office_phone,
          cell_phone: editingContact.cell_phone,
        })
        .eq('id', editingContact.id);

      if (error) throw error;

      setContacts(contacts.map(contact => 
        contact.id === editingContact.id ? editingContact : contact
      ));
      setEditingContact(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update contact');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('contacts')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setContacts(contacts.filter(contact => contact.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete contact');
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading contacts...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center py-8">{error}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Contact Management</h2>
        <div className="text-sm text-gray-500">
          Total Contacts: {contacts.length}
        </div>
      </div>

      {editingContact && (
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <h3 className="text-xl font-bold mb-4">Edit Contact</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Full Name</label>
              <input
                type="text"
                value={editingContact.full_name}
                onChange={(e) => setEditingContact({ ...editingContact, full_name: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Title</label>
              <input
                type="text"
                value={editingContact.title}
                onChange={(e) => setEditingContact({ ...editingContact, title: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                value={editingContact.email}
                onChange={(e) => setEditingContact({ ...editingContact, email: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Office Phone</label>
              <input
                type="tel"
                value={editingContact.office_phone}
                onChange={(e) => setEditingContact({ ...editingContact, office_phone: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Cell Phone</label>
              <input
                type="tel"
                value={editingContact.cell_phone}
                onChange={(e) => setEditingContact({ ...editingContact, cell_phone: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
          </div>
          <div className="mt-4 flex justify-end space-x-3">
            <button
              onClick={() => setEditingContact(null)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
            >
              Save Changes
            </button>
          </div>
        </div>
      )}

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {contacts.map((contact) => (
            <li key={contact.id} className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {contact.full_name}
                  </p>
                  <p className="text-sm text-gray-500">{contact.title}</p>
                  <p className="text-sm text-gray-500">{contact.email}</p>
                  <p className="text-sm text-gray-500">Office: {contact.office_phone}</p>
                  <p className="text-sm text-gray-500">Cell: {contact.cell_phone}</p>
                </div>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => handleEdit(contact)}
                    className="text-indigo-600 hover:text-indigo-900"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(contact.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {contacts.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No contacts have been added yet.
        </div>
      )}
    </div>
  );
} 