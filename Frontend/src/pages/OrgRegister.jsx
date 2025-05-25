import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

const OrgRegister = () => {
  const [orgName, setOrgName] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { orgSignup, isOrgSigningUp } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      await orgSignup({ OrgName: orgName });
      navigate("/dashboard");
      setSuccess("Organization registered successfully!");
    } catch (err) {
      setError(err?.message || "Organization registration failed");
    }
  };

  return (
    <div className="h-screen w-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-100">
      <div className="max-w-md w-full p-8 bg-white rounded-2xl shadow-lg border border-blue-100">
        <h2 className="text-3xl font-bold mb-6 text-center text-blue-800 drop-shadow">
          Register Organization
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-1">
              Organization Name
            </label>
            <input
              type="text"
              name="orgName"
              value={orgName}
              onChange={(e) => setOrgName(e.target.value)}
              required
              className="w-full px-3 py-2 border border-blue-300 rounded focus:outline-none focus:ring focus:border-blue-400"
            />
          </div>
          <button
            type="submit"
            disabled={isOrgSigningUp}
            className="w-full py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded hover:from-blue-700 hover:to-purple-700 transition-colors cursor-pointer"
          >
            {isOrgSigningUp ? "Registering..." : "Register Organization"}
          </button>
          {error && (
            <div className="text-red-600 mt-4 text-center">{error}</div>
          )}
          {success && (
            <div className="text-green-600 mt-4 text-center">{success}</div>
          )}
        </form>
      </div>
    </div>
  );
};

export default OrgRegister;