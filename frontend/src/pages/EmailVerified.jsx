import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Swal from "sweetalert2";

const EmailVerified = () => {
  const navigate = useNavigate();

  React.useEffect(() => {
    // Show professional SweetAlert when page loads
    Swal.fire({
      icon: "success",
      title: "Email Verified Successfully 🎉",
      text: "You can now login to your account.",
      confirmButtonColor: "#2563eb",
      confirmButtonText: "Go to Login",
    }).then(() => {
      navigate("/frontendlogin");
    });
  }, [navigate]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 font-sans">
      <motion.div
        className="text-center p-6 bg-white rounded-2xl shadow-xl border border-gray-100"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-2xl font-bold text-green-600">Email Verified ✅</h2>
        <p className="text-gray-500 mt-2">Redirecting you to login...</p>
      </motion.div>
    </div>
  );
};

export default EmailVerified;
