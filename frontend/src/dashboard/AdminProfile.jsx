// src/dashboard/AdminProfile.jsx
import React, { useState } from "react";
import ChangePasswordModal from "./ChangePasswordModal";

const AdminProfile = ({ user }) => {
  const name = user?.username || user?.name || "Admin";
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="p-6 bg-white rounded-lg shadow-md max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Admin Profile</h2>

      <div className="space-y-2 mb-4">
        <p>
          <span className="font-semibold">Name:</span> {name}
        </p>
        <p>
          <span className="font-semibold">Email:</span>{" "}
          {user?.email || "not-provided"}
        </p>
        <p>
          <span className="font-semibold">Role:</span>{" "}
          {user?.role || "Administrator"}
        </p>
      </div>

      {/* Change Password Button */}
      <button
        onClick={() => setShowModal(true)}
        className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
      >
        Change Password
      </button>

      {/* Modal */}
      {showModal && (
        <ChangePasswordModal onClose={() => setShowModal(false)} />
      )}
    </div>
  );
};

export default AdminProfile;
