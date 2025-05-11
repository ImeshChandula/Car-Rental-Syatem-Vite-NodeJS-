import { useEffect } from 'react';
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from './store/useAuthStore';
import { Loader } from "lucide-react";

import Navbar from "./components/Navbar";
import Home from "./routes/Home";
import Login from "./routes/Login";
import Register from "./routes/Register";
import DashboardOwner from "./routes/DashboardOwner";
import DashboardManager from "./routes/DashboardManager";
import DashboardCustomer from "./routes/DashboardCustomer";

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
      <Navbar />
      <Routes>
        <Route path='/' element={<Home/>} />
        <Route path='/login' element={<Login/>} />
        <Route path='/register' element={<Register/>} />

        {/* Protected routes*/}
        <Route path='/owner/dashboard' element={authUser ? <DashboardOwner/> : <Navigate to="/login" />} />
        <Route path='/manager/dashboard' element={authUser ? <DashboardManager/> : <Navigate to="/login" />} />
        <Route path='/customer/dashboard' element={authUser ? <DashboardCustomer/> : <Navigate to="/login" />} />
        
      </Routes>
      
    </div>
  )
}

export default App
