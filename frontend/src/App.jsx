import { useEffect } from 'react';
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from './store/useAuthStore';
import { Loader } from "lucide-react";
import { Toaster } from 'react-hot-toast';

import Navbar from "./components/Navbar";
import Home from "./routes/Home";
import Login from "./routes/Login";
import Register from "./routes/Register";
import Settings from "./routes/Settings";
import DashboardOwner from "./routes/DashboardOwner";
import DashboardManager from "./routes/DashboardManager";
import DashboardCustomer from "./routes/DashboardCustomer";
import EmailVerify from './routes/EmailVerify';
import ResetPassword from './routes/ResetPassword';
import UpdateUser from './routes/UpdateUser';

function App() {
  const {authUser, checkAuth, isCheckingAuth} = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  console.log({ authUser });

  if (isCheckingAuth && !authUser) 
    return (
      <div className='loader-container'>
        <Loader className="loader" />
      </div>
    )

  return (
    <div>
      {/* Add Toast notification container */}
      <Toaster 
        position="top-center"
        reverseOrder={false}
        gutter={8}
        toastOptions={{
          // Default options for all toasts
          duration: 5000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          // Custom success toast styling
          success: {
            duration: 3000,
            style: {
              background: 'green',
              color: 'white',
            },
          },
          // Custom error toast styling
          error: {
            duration: 4000,
            style: {
              background: '#ff4b4b',
              color: 'white',
            },
          },
        }}
      />

      <Navbar />
      <Routes>
        <Route path='/' element={<Home/>} />
        <Route path='/login' element={!authUser ? <Login/> : <Navigate to="/" />} />
        <Route path='/register' element={!authUser ? <Register/> : <Navigate to="/" />} />
        <Route path='/settings' element={authUser ? <Settings/> : <Navigate to="/login" />} />

        <Route path='/email/verify' element={!authUser ? <EmailVerify/> : <Navigate to="/" />} />
        <Route path='/reset/password' element={!authUser ? <ResetPassword /> : <ResetPassword />} />
        <Route path='/editData/user' element={authUser ? <UpdateUser /> : <Navigate to="/login" />} />

        {/* Protected routes*/}
        <Route path='/owner/dashboard' element={authUser && authUser.role === "owner" ? <DashboardOwner/> : <Navigate to="/login" />} />
        <Route path='/manager/dashboard' element={authUser && authUser.role === "manager" ? <DashboardManager/> : <Navigate to="/login" />} />
        <Route path='/customer/dashboard' element={authUser && authUser.role === "customer" ? <DashboardCustomer/> : <Navigate to="/login" />} />
        
        {/* Catch-all route */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      
    </div>
  )
}

export default App
