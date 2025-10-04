// src/components/Login.jsx (Finalized)
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Profile from "../assets/images/E_learning_profile.png";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Swal from "sweetalert2";
// Import the external login service function
import { login } from "../services/authService"; // Path is correct

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      // 1. Call the 'login' service function (which sends credentials to API)
      // Renaming 'res' to 'loginData' for better clarity
      const loginData = await login({ email, password }); 
      
      // ⭐️ CORE LOGIC: Save Token and User Data in localStorage
      localStorage.setItem("token", loginData.token);
      localStorage.setItem("currentUser", JSON.stringify(loginData.user));

      // 2. Show Success Alert
      Swal.fire({
        icon: "success",
        title: "Login Successful! 🎉", 
        text: "Welcome back to E-Learning.",
        confirmButtonColor: "#2563eb",
      }).then(() => {
        
        // 3. Redirect to the home page AFTER the user closes the alert
        navigate("/"); 
      });

    } catch (err) {
      // 4. Handle Error 
      const errorMessage = err.message || "An unknown error occurred!";
      Swal.fire("Error", errorMessage, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-[#7699ce] to-[#7bb673]">
      <div className="p-8 rounded-xl shadow-md w-full max-w-md text-center bg-gradient-to-b from-[#7699ce] to-[#7bb673]">
        {/* Logo */}
        <div className="flex justify-center mb-4">
          <img src={Profile} alt="Logo" className="w-20 rounded-full" />
        </div>

        <h3 className="font-bold mb-8 text-lg">LOG IN TO YOUR ACCOUNT</h3>

        <form onSubmit={handleLogin} className="space-y-6 text-left">
          {/* Email */}
          <div>
            <label className="block font-bold mb-2">Email</label>
            <input
              type="email"
              placeholder="Please enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-2 border border-gray-300 rounded-md bg-transparent"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block font-bold mb-2">Password</label>
            <div className="flex items-center relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Please enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="flex-1 p-2 pr-12 border border-gray-300 rounded-md bg-transparent"
              />
              <button
                type="button"
                className="absolute right-3 text-gray-500 text-xl"
                onClick={() => setShowPassword((s) => !s)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          {/* Login button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Signup link */}
        <p className="mt-4 text-sm">
          Don’t have an account?{" "}
          <a href="/signup" className="text-blue-600 hover:underline">
            Create one now!
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
