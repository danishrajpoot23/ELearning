import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // useNavigate will be used for '/frontendlogin' link
import Profile from "../assets/images/E_learning_profile.png";
import { FaEye, FaEyeSlash } from "react-icons/fa";
// New Logic Imports
import Swal from "sweetalert2";
// Assume you have this file/function
// Agar aapke pass 'authService' mein 'signup' function nahi hai, toh use create kar lein.
import { signup } from "../services/authService"; 

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Pehli file se useNavigate import rakha hai, agar aapko sirf login page par jana ho toh
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    // 1. Password Match Check (Using SweetAlert2)
    if (password !== confirmPassword) {
      Swal.fire("Error", "❌ Passwords do not match!", "error");
      return;
    }

    setLoading(true);

    try {
      // 2. New User Object (Role aur Status jaisi fields ke saath)
      const newUser = { name, email, password, role: "Student", status: "Active" };
      
      // 3. Use 'signup' service function
      const res = await signup(newUser);

      // 4. Success message (as per new logic) - Assuming backend sends a message for email verification
      Swal.fire({
        icon: "success",
        title: "Signup Successful!",
        text: res.message || "Please check your email to verify your account.", 
        confirmButtonColor: "#2563eb",
      });

      // 5. Form clear kar dein, redirect nahi karna
      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      
    } catch (err) {
      // 6. Error handling (as per new logic)
      const errorMessage = err.response?.data?.message || err.message || "Signup failed!";
      Swal.fire("Error", errorMessage, "error");
    } finally {
      setLoading(false);
    }
  };

  // UI/Design is exactly the same as your first provided code
  return (
    <div className="flex justify-center items-center min-h-[80vh] bg-gradient-to-b from-[#7699ce] to-[#7bb673] rounded-xl">
      <div className="p-8 rounded-xl shadow-md w-full max-w-md text-center bg-gradient-to-b from-[#7699ce] to-[#7bb673]">
        {/* Logo */}
        <div className="flex justify-center mb-4">
          <img src={Profile} alt="Logo" className="w-20 rounded-full" />
        </div>

        <h3 className="font-bold mb-8 text-lg">CREATE AN ACCOUNT</h3>

        {/* Form */}
        <form onSubmit={handleSignup} className="space-y-6 text-left">
          {/* Name */}
          <div>
            <label className="block font-bold mb-2">Name</label>
            <input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full p-2 border border-gray-300 rounded-md bg-transparent"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block font-bold mb-2">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
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

          {/* Confirm Password */}
          <div>
            <label className="block font-bold mb-2">Confirm Password</label>
            <div className="flex items-center relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Please confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="flex-1 p-2 pr-12 border border-gray-300 rounded-md bg-transparent"
              />
              <button
                type="button"
                className="absolute right-3 text-gray-500 text-xl"
                onClick={() => setShowConfirmPassword((s) => !s)}
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md disabled:opacity-50"
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        {/* Link */}
        <p className="mt-4 text-sm">
          Have an account already?{" "}
          <a href="/frontendlogin" className="text-blue-600 hover:underline">
            Please login here
          </a>
        </p>
      </div>
    </div>
  );
};

export default Signup;
