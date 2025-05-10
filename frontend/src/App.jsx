import React from 'react';
import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Home from "./routes/Home";
import Login from "./routes/Login";
import DashboardOwner from "./routes/DashboardOwner";

function App() {
  

  return (
    <div>
      <Navbar />
      <Routes>
        <Route path='/' element={<Home/>} />
        <Route path='/login' element={<Login/>} />
        <Route path='/dashboard-owner' element={<DashboardOwner/>} />
      </Routes>
      
    </div>
  )
}

export default App
