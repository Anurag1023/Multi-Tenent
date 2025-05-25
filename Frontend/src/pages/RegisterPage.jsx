import React, { useState } from "react";
import { useAuthStore } from "../store/authStore";
import { Link } from "react-router-dom";

const RegisterPage = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    inviteCode: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { signup, isSigningUp } = useAuthStore();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      await signup(form);
      setSuccess("Registration successful!");
    } catch (err) {
      setError(err?.message || "Registration failed");
    }
  };

  return (
    <div className="h-screen w-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-100">
      <div className="max-w-md w-full p-8 bg-white rounded-2xl shadow-lg border border-blue-100">
        <div className="mb-4 text-center">
          <span className="text-gray-700">Already have an account? </span>
          <Link to="/login" className="text-blue-600 hover:underline">
            Login
          </Link>
        </div>
        <h2 className="text-3xl font-bold mb-6 text-center text-blue-800 drop-shadow">
          Sign Up
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-blue-300 rounded focus:outline-none focus:ring focus:border-blue-400"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-blue-300 rounded focus:outline-none focus:ring focus:border-blue-400"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                minLength={6}
                className="w-full px-3 py-2 border border-blue-300 rounded focus:outline-none focus:ring focus:border-blue-400 text-black"
              />
              <button
                type="button"
                tabIndex={-1}
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-gray-600 hover:text-gray-900 focus:outline-none scale-[1.4]"
              >
                {showPassword ? "🙈" : "🤔"}
              </button>
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-1">
              Referral Code (optional)
            </label>
            <input
              type="text"
              name="inviteCode"
              value={form.inviteCode}
              onChange={handleChange}
              placeholder="Enter referral/invite code"
              className="w-full px-3 py-2 border border-blue-300 rounded focus:outline-none focus:ring focus:border-blue-400 text-black"
            />
          </div>
          <button
            type="submit"
            disabled={isSigningUp}
            className="w-full py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded hover:from-blue-700 hover:to-purple-700 transition-colors cursor-pointer"
          >
            {isSigningUp ? "Registering..." : "Sign Up"}
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

export default RegisterPage;