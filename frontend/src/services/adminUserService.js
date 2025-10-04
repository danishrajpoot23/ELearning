// 📁 src/services/adminUserService.js (FINAL VERSION - Code is Correct)

import axios from "axios"; 
import toast from "react-hot-toast"; // For better error messages

// API base URL ko environment variable se utha rahe hain
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

// Helper function to attach Auth header (Used for secure admin routes)
const getAdminConfig = () => {
  const token = localStorage.getItem("adminToken");
  if (!token) {
    // Agar token na mile to error de dein aur user ko inform karein
    toast.error("Admin token not found. Please log in.");
    throw new Error("No token provided");
  }
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// ✅ 1. Fetch All Users
export async function fetchAllUsers() {
    try {
        const res = await api.get("/users", getAdminConfig());
        return res.data; // Expected to be an array of users
    } catch (error) {
        // Error handling centralize karein
        const errorMessage = error.response?.data?.message || "Failed to fetch users.";
        throw new Error(errorMessage);
    }
}

// ✅ 2. Add New User (Admin Panel se)
export async function createNewUser(userData) {
    try {
        const res = await api.post("/users", userData, getAdminConfig());
        return res.data; // Returns the newly created user object
    } catch (error) {
        const errorMessage = error.response?.data?.message || "Failed to add user.";
        throw new Error(errorMessage);
    }
}

// ✅ 3. Delete User
export async function deleteUser(userId) {
    try {
        const res = await api.delete(`/users/${userId}`, getAdminConfig());
        // Status 200/204 is usually a success, we return a success message or the response data
        return res.data; 
    } catch (error) {
        const errorMessage = error.response?.data?.message || "Failed to delete user.";
        throw new Error(errorMessage);
    }
}