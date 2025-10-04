// src/services/authService.js (FIXED VERSION)

const API = import.meta.env.VITE_API_URL + "/users";

// --- AUTHENTICATION FUNCTIONS ---

// Signup function
export async function signup(userData) {
  const res = await fetch(`${API}/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
    credentials: "include", // Required for sending/receiving cookies
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Signup failed");
  return data;
}

// Login function
export async function login(credentialsData) {
  const res = await fetch(`${API}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentialsData),
    credentials: "include", // Required for sending/receiving cookies
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Login failed");
  return data; // Returns { user: {...}, token: '...' }
}


// --- NAVBAR FUNCTIONS (ME & LOGOUT) ---

/**
 * Fetches the current user's details. Used for checking login status.
 * @returns {object | null} Returns user data object or null if unauthorized (401).
 */
export async function fetchMe() {
  // ⭐️ FIX 1: Get token from localStorage
  const token = localStorage.getItem('token'); 
  if (!token) {
    return null; // Agar token nahi, toh request hi na bhejein
  }

  const res = await fetch(`${API}/me`, {
    // ⭐️ FIX 2: Add Authorization Header for JWT Bearer Token
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json' // Default content-type for consistency
    },
    credentials: "include", // Cookies ke liye shamil rakhein
  });

  // 401 (Unauthorized) error ko silently handle karein
  if (res.status === 401 || res.status === 403) {
    // Agar token invalid hai toh localStorage se token hata dena achha hai
    localStorage.removeItem('token'); 
    return null;
  }
  
  const data = await res.json();
  
  // Agar koi aur server-side error ho (e.g., 500)
  if (!res.ok) {
    console.error("Error fetching user details:", data.message);
    return null; 
  }
  
  return data; // Expected: { user: {...} }
}

/**
 * Logs the user out by calling the backend /logout endpoint.
 */
export async function logout() {
  // Logout ke waqt frontend se bhi token clear krain
  localStorage.removeItem('token'); 
  
  const res = await fetch(`${API}/logout`, {
    method: "POST",
    credentials: "include",
  });
  
  // Logout fail bhi ho jaye tab bhi frontend se user state clear ho chuka hai
  if (!res.ok) {
    console.error("Server reported an error during logout.");
  }
  
  return true;
}
