"use client";

import { createClient } from "@/libs/supabase/client";
import { useEffect, useState } from "react";

interface UserProfile {
  id: string;
  email: string;
  is_admin: boolean;
  is_subscribed: boolean;
  created_at: string;
  school_count: number;
}

export default function AdminUsersManager() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [supabase] = useState(() => createClient());

  useEffect(() => {
    let mounted = true;

    async function fetchUsers() {
      try {
        // Get all profiles with their email from auth.users
        const { data: profiles, error: profilesError } = await supabase
          .from("profiles")
          .select(`
            id,
            email,
            is_admin,
            is_subscribed,
            created_at
          `);

        if (profilesError) throw profilesError;

        // Get school counts for each user
        const { data: schools, error: schoolsError } = await supabase
          .from("schools")
          .select("user_id");
        if (schoolsError) throw schoolsError;

        // Count schools per user
        const schoolCounts = schools?.reduce((acc, school) => {
          acc[school.user_id] = (acc[school.user_id] || 0) + 1;
          return acc;
        }, {} as Record<string, number>) || {};

        // Combine the data
        const combinedUsers = profiles?.map(profile => ({
          ...profile,
          school_count: schoolCounts[profile.id] || 0
        })) || [];

        if (mounted) {
          setUsers(combinedUsers);
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : "Failed to fetch users");
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    fetchUsers();

    return () => {
      mounted = false;
    };
  }, [supabase]);

  const toggleAdminStatus = async (userId: string, currentStatus: boolean) => {
    try {
      console.log("Updating admin status for user:", userId, "to:", !currentStatus);
      
      const { data, error } = await supabase
        .from("profiles")
        .update({ is_admin: !currentStatus })
        .eq("id", userId);

      console.log("Update response:", { data, error });

      if (error) {
        console.error("Supabase error:", error);
        throw error;
      }

      // Update local state
      setUsers(users.map(user => 
        user.id === userId 
          ? { ...user, is_admin: !currentStatus }
          : user
      ));
    } catch (err) {
      console.error("Error updating admin status:", err);
      setError(err instanceof Error ? err.message : "Failed to update admin status");
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading users...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center py-8">{error}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">User Management</h2>
        <div className="text-sm text-gray-500">
          Total Users: {users.length}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg shadow">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Admin</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subscribed</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Schools</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id}>
                <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => toggleAdminStatus(user.id, user.is_admin)}
                    className={`px-2 py-1 rounded text-sm ${
                      user.is_admin
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {user.is_admin ? "Yes" : "No"}
                  </button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 rounded text-sm ${
                    user.is_subscribed
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-800"
                  }`}>
                    {user.is_subscribed ? "Yes" : "No"}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{user.school_count}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {new Date(user.created_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 