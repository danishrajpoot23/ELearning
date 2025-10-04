import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
import AdminLayout from "./AdminLayout";
import Users from "./Users";
import Courses from "./Courses";
import Tests from "./Tests";
import Questions from "./Questions";
import Results from "./Results";
import Home from "./Home";
import Subscriptions from "./Subscriptions";

const AdminDashboard = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = () => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      navigate("/admin/login");
      return;
    }
    setIsAuthenticated(true);
    setIsLoading(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
    setIsAuthenticated(false);
    navigate("/admin/login");
  };

  if (isLoading) return <p>Loading...</p>;
  if (!isAuthenticated) return <Navigate to="/admin/login" />;
  if (location.pathname === "/admin") return <Navigate to="/admin/dashboard" />;

  return (
    <Routes>
      {/* Wrap all routes in AdminLayout */}
      <Route element={<AdminLayout onLogout={handleLogout} />}>
        <Route path="dashboard" element={<Home />} />
        <Route path="users" element={<Users />} />
        <Route path="courses" element={<Courses />} />
        <Route path="tests" element={<Tests />} />
        <Route path="questions" element={<Questions />} />
        <Route path="results" element={<Results />} />
        <Route path="subscriptions" element={<Subscriptions/>} />
      </Route>
    </Routes>
  );
};

export default AdminDashboard;