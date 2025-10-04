// 📁 src/services/adminAuthService.js (FINAL UPDATED VERSION)

import axios from "axios"; 
import toast from "react-hot-toast";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

// ⭐️ FIX: Request Interceptor add karain taake har request ke saath token jaaye
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("adminToken");
        // Agar token mojood hai, toh usay Authorization header mein attach kar do.
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);


/**
 * Admin Login API ko call karega aur token ko localStorage mein save karega.
 * @param {string} email - Admin ka email. 
 * @param {string} password - Admin ka password.
 * @returns {object} Logged-in user ka data.
 */
export async function adminLogin(email, password) { 
    try {
        const res = await api.post('/users/admin/login', { email, password }); 
        
        const { token, user } = res.data; 

        if (token) {
            // Token ko save karein
            localStorage.setItem("adminToken", token);
            localStorage.setItem("adminUser", JSON.stringify(user));
            
            // 💡 NOTE: Interceptor token ko agli request se attach karna shuru kar dega
            return user;
        } else {
            throw new Error("Login successful, but token missing from response.");
        }
    } catch (error) {
        const errorMessage = error.response?.data?.message || error.message || "Login failed. Please check server status.";
        toast.error(errorMessage);
        throw error; 
    }
}


/**
 * Admin ke liye user ka role update karega.
 * @param {string} userId - Jis user ka role update karna hai uski ID.
 * @param {string} newRole - Naya role ("admin" ya "student").
 * @returns {object} Updated user object.
 */
export async function updateAdminUserRole(userId, newRole) {
    // Ab token automatic Interceptor ke zariye attach ho jayega!
    try {
        const res = await api.put(`/users/role/${userId}`, { newRole });
        return res.data.user; 
    } catch (error) {
        const errorMessage = error.response?.data?.message || error.message || "Failed to update user role.";
        toast.error(errorMessage);
        throw error;
    }
}