import React from 'react'
import { useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { useEffect } from 'react'
import { Loader } from 'lucide-react'

import RegisterPage from './pages/RegisterPage'
import Navbar from './components/Navbar'
import LoginPage from './pages/LoginPage'
import HomePage from './pages/HomePage'
import OrgRegister from './pages/OrgRegister'
import Dashboard from './pages/Dashboard'

import { useAuthStore } from './store/authStore'
import ErrorPage from './pages/ErrorPage'
import ProfilePage from './pages/ProfilePage'
import ManageUser from './pages/ManageUser'


const App = () => {


  const { authUser, checkAuth, isCheckingAuth, onlineUsers } = useAuthStore();

  console.log({ onlineUsers });

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  console.log({ authUser });

  if (isCheckingAuth && !authUser)
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );

  return (
    <div>
      <Navbar />

      <Routes>
        <Route path="/" element={(authUser)? <HomePage/>: <Navigate to="/login"/>} />
        <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/" />} />
        <Route path="/register" element={!authUser ? <RegisterPage /> : <Navigate to="/" />} />
        <Route path="/profile" element={(authUser)? <ProfilePage/>: <Navigate to="/login"/>} />
        <Route path="/orgRegister" element={(authUser)? <OrgRegister/>: <Navigate to="/login"/>} />
        <Route path="/dashboard" element={(authUser)? <Dashboard/>: <Navigate to="/login"/>} />
        <Route path="/manageUser" element={(authUser)? <ManageUser/>: <Navigate to="/login"/>} />
        <Route path="*" element={<ErrorPage />} />
      </Routes>

      <Toaster />
    </div>
  )
}

export default App