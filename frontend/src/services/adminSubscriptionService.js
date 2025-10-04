// 📁 src/services/adminSubscriptionService.js

import axios from "axios"; 

// API base URL ko environment variable se ya default se utha rahe hain
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

// Helper function to attach Auth header
const getAdminConfig = () => {
  const token = localStorage.getItem("adminToken");
  if (!token) {
    // Ye zaroori hai agar token na mile to error de dein
    throw new Error("Admin token not found. Please log in.");
  }
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// ✅ Get all subscriptions for Admin
export async function fetchAllSubscriptions() {
    try {
        // Correct endpoint: /subscriptions/all (as per your router)
        const res = await api.get("/subscriptions/all", getAdminConfig());
        return res.data;
    } catch (error) {
        // Throw error for caller to handle toast/logging
        throw error.response?.data || error;
    }
}

// ✅ Verify subscription (Admin approval)
// Iska endpoint bhi fix kar diya hai (aapke router ke hisaab se PATCH /:id/status)
export async function verifySubscription(id) {
    try {
        const res = await api.patch(
            `/subscriptions/${id}/status`, 
            { status: 'paid' }, // Body to change status
            getAdminConfig()
        );
        return res.data;
    } catch (error) {
        throw error.response?.data || error;
    }
}