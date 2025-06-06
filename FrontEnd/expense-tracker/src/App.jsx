import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./Pages/Auth/Login";
import SignUp from "./Pages/Auth/SignUp";
import Home from "./Pages/Dashboard/Home";
import Income from "./Pages/Dashboard/Income";
import Expense from "./Pages/Dashboard/Expense";
import UserProvider from "./Context/UserContext";
import {Toaster} from "react-hot-toast";

const App = () => {
  return (
    <UserProvider>
      <div>
      <Routes>
        <Route path="/" element={<Root />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/dashboard" element={<Home />} />
        <Route path="/income" element={<Income />} />
        <Route path="/expense" element={<Expense />} />
      </Routes>
      </div>
      <Toaster 
        toastOptions={{
          className:"",
          style:{
            fontSize:'13px'
          },

        }}
        />
    </UserProvider>
  );
};

const Root = () => {
  const isAuthenticated = !!localStorage.getItem("token");
  return isAuthenticated ? <Navigate to="/dashboard" /> : <Navigate to="/login" />;
};

export default App;
