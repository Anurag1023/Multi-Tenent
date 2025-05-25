import React, { useEffect, useState } from "react";
import { useAuthStore } from "../store/authStore";
import { axiosInstance } from "../lib/axios";

const ProfilePage = () => {
  const { authUser } = useAuthStore();
  const [orgName, setOrgName] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrgDetails = async () => {
      setError("");
      try {
        const res = await axiosInstance.get("/organizations/me", { withCredentials: true });
        setOrgName(res.data.name || "");
      } catch (err) {
        setError("Could not fetch organization details.");
      }
    };
    fetchOrgDetails();
  }, [authUser]);

  if (!authUser) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-100">
        <div className="text-xl text-gray-700">Loading user profile...</div>
      </div>
    );
  }

  const user = authUser.user || authUser;

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-100">
      <div className="max-w-md w-full p-8 bg-white rounded-2xl shadow-lg border border-blue-100">
        <h2 className="text-3xl font-bold mb-6 text-center text-blue-800 drop-shadow">
          User Profile
        </h2>
        <div className="mb-4 flex items-center">
          <span className="font-semibold text-blue-700 w-32">Name:</span>
          <span className="text-gray-900">{user.name}</span>
        </div>
        <div className="mb-4 flex items-center">
          <span className="font-semibold text-blue-700 w-32">Email:</span>
          <span className="text-gray-900">{user.email}</span>
        </div>
        <div className="mb-4 flex items-center">
          <span className="font-semibold text-blue-700 w-32">Role:</span>
          <span className="text-gray-900 capitalize">{user.role || "N/A"}</span>
        </div>
        <div className="mb-4 flex items-center">
          <span className="font-semibold text-blue-700 w-32">Organization:</span>
          <span className="text-gray-900">{orgName || "N/A"}</span>
        </div>
        {error && <div className="text-red-600 mt-2">{error}</div>}
      </div>
    </div>
  );
};

export default ProfilePage;