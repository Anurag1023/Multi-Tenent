import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { axiosInstance } from '../lib/axios';
import { useAuthStore } from '../store/authStore';

const Navbar = () => {
  const navigate = useNavigate();

  const { logout, authUser } = useAuthStore();
  const user = authUser?.user;

  return (
    <div className='text-white bg-gray-800 p-4 flex justify-between items-center'>
      <div className="logo">
        <h1 className='text-2xl font-bold'>MyApp</h1>
      </div>
      {authUser && (
        <nav className='space-x-4'>
          <Link to="/" className='hover:text-gray-400'>Home</Link>
          <Link to="/profile" className='hover:text-gray-400'>Profile</Link>
          {user?.role === "admin" && (
            <Link to="/manageUser" className='hover:text-gray-400'>
              Manage Users
            </Link>
          )}
          <button
            onClick={logout}
            className='hover:text-gray-400 cursor-pointer bg-transparent border-none outline-none'
            type="button"
          >
            Logout
          </button>
        </nav>
      )}
    </div>
  )
}

export default Navbar