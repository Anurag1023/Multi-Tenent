import React, { useEffect, useState } from "react";
import { useAuthStore } from "../store/authStore";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

const ManageUser = () => {
  const { authUser } = useAuthStore();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all users
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/users", { withCredentials: true });
      setUsers(Array.isArray(res.data) ? res.data : res.data.users || []);
    } catch (err) {
      toast.error("Failed to fetch users");
      setUsers([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Change user role
  const handleRoleChange = async (userId, newRole) => {
    try {
      await axiosInstance.patch(
        `/users/${userId}/role`,
        { newRole }, // <-- This matches backend expectation
        { withCredentials: true }
      );
      toast.success("Role updated!");
      setUsers((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, role: newRole } : u))
      );
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to update role");
    }
  };

  // Delete user
  const handleDeleteUser = async (userId) => {
    try {
      await axiosInstance.delete(`/users/${userId}`, { withCredentials: true });
      toast.success("User deleted!");
      setUsers((prev) => prev.filter((u) => u._id !== userId));
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to delete user");
    }
  };

  const user = authUser?.user;

  if (!user || user.role !== "admin") {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-100">
        <div className="text-xl text-red-600 font-semibold">
          Access Denied: Only admins can manage users.
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8 border border-blue-100">
        <h2 className="text-3xl font-bold mb-8 text-center text-blue-800 drop-shadow">
          Manage Users
        </h2>
        {loading ? (
          <div className="text-center text-blue-600 font-semibold py-8">
            Loading users...
          </div>
        ) : users.length === 0 ? (
          <div className="text-center text-gray-500 py-8">No users found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-blue-50">
                  <th className="py-3 px-4 font-semibold text-blue-900">Name</th>
                  <th className="px-4 font-semibold text-blue-900">Email</th>
                  <th className="px-4 font-semibold text-blue-900">Role</th>
                  <th className="px-4 font-semibold text-blue-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users
                  .filter((u) => user && u._id !== user._id && u.role !== "admin") // Exclude current admin and any other admins
                  .map((u, idx) => (
                    <tr
                      key={u._id}
                      className={`border-t ${
                        idx % 2 === 0 ? "bg-white" : "bg-blue-50"
                      }`}
                    >
                      <td className="py-3 px-4">{u.name}</td>
                      <td className="px-4">{u.email}</td>
                      <td className="px-4 capitalize">
                        <select
                          value={u.role}
                          onChange={(e) => handleRoleChange(u._id, e.target.value)}
                          className="px-2 py-1 border border-blue-300 rounded focus:outline-none focus:ring focus:border-blue-400 bg-white"
                        >
                          <option value="manager">Manager</option>
                          <option value="member">Member</option>
                        </select>
                      </td>
                      <td className="px-4">
                        <button
                          onClick={() => handleDeleteUser(u._id)}
                          className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageUser;