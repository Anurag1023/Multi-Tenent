import React from "react";
import { Link } from "react-router-dom";

const HomePage = () => (
  <div className="h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-purple-100">
    <div className="bg-white rounded-2xl shadow-lg p-10 border border-blue-100 max-w-lg w-full text-center">
      <h1 className="text-4xl font-extrabold mb-4 text-blue-900 drop-shadow-lg">
        Welcome to Multi-Tenant App
      </h1>
      <p className="text-gray-700 mb-8">
        Manage your team, tasks, and organization efficiently with our multi-tenant
        platform.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link
          to="/dashboard"
          className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded shadow hover:from-blue-700 hover:to-purple-700 transition"
        >
          Login
        </Link>
        <Link
          to="/orgRegister"
          className="px-6 py-2 bg-white border border-blue-600 text-blue-700 rounded shadow hover:bg-blue-50 transition"
        >
          Register
        </Link>
      </div>
    </div>
  </div>
);

export default HomePage;
