import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

const LoginPage = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const { login, isLoggingIn } = useAuthStore();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await login(form);
      navigate("/");
    } catch (err) {
      setError(err?.message || "Login failed");
    }
  };

  return (
    <div className="h-screen w-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-100">
      <div className="max-w-md w-full p-8 bg-white rounded-2xl shadow-lg border border-blue-100">
        <div className="mb-4 text-center">
          <span className="text-gray-700">Don't have an account? </span>
          <Link to="/register" className="text-blue-600 hover:underline">
            Register
          </Link>
        </div>
        <h2 className="text-3xl font-bold mb-6 text-center text-blue-800 drop-shadow">
          Login
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-blue-300 rounded focus:outline-none focus:ring focus:border-blue-400"
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-blue-300 rounded focus:outline-none focus:ring focus:border-blue-400"
            />
          </div>
          <button
            type="submit"
            disabled={isLoggingIn}
            className="w-full py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded hover:from-blue-700 hover:to-purple-700 transition-colors cursor-pointer"
          >
            {isLoggingIn ? "Logging in..." : "Login"}
          </button>
          {error && (
            <div className="text-red-600 mt-4 text-center">{error}</div>
          )}
        </form>
      </div>
    </div>
  );
};

export default LoginPage;