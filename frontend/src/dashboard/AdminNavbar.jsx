import React, { useState } from "react";
import { FaBars, FaUserCircle } from "react-icons/fa";
import ChangePasswordModal from "../dashboard/ChangePasswordModal";
import AdminProfile from "../dashboard/AdminProfile";

function AdminNavbar({
  onToggleSidebar = () => {},
  user = { name: "Admin", email: "admin@example.com", avatar: null },
  onSignOut = () => {},
}) {
  // prefer prop user, fallback to localStorage
  const stored = JSON.parse(localStorage.getItem("adminUser") || "null");
  const admin = user && Object.keys(user).length ? user : stored || { name: "Admin", email: "admin@example.com" };

  const [showProfile, setShowProfile] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showProfilePage, setShowProfilePage] = useState(false);

  const handlePasswordChange = ({ oldPassword, newPassword }) => {
    // TODO: Backend API call for password update
    console.log("Password change request:", { oldPassword, newPassword });
    alert("Password changed successfully (demo)!");
  };

  const handleLogout = () => {
    // remove local token/user then call parent's sign out
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
    onSignOut();
  };

  return (
    <>
      <header className="bg-gradient-to-br from-[#1e293b] via-[#0f172a] to-[#1e40af] sticky top-0 z-40 border-b border-gray-200 dark:border-gray-100 shadow-sm">
        <div className="max-w-full mx-auto px-3 py-2 flex items-center justify-between">
          {/* Left: Sidebar toggle + title */}
          <div className="flex items-center gap-3">
            <button
              onClick={onToggleSidebar}
              aria-label="Toggle sidebar"
              className="p-2 rounded-md text-white hover:bg-gray-600"
            >
              <FaBars />
            </button>

            <div className="flex flex-col">
              <span className="text-white font-semibold text-sm">Admin Panel</span>
            </div>
          </div>

          {/* Right: Profile dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowProfile((s) => !s)}
              className="flex items-center gap-2 px-2 py-1 "
            >
              {admin && admin.avatar ? (
                <img
                  src={admin.avatar}
                  alt="Admin Avatar"
                  className="w-8 h-8 rounded-full border-2 border-white"
                />
              ) : (
                <FaUserCircle className="text-white text-2xl" />
              )}
            </button>

            {showProfile && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border rounded-lg shadow-lg overflow-hidden">
                <button
                  onClick={() => {
                    setShowProfilePage(true);
                    setShowProfile(false);
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 text-sm"
                >
                  Profile
                </button>

                <button
                  onClick={() => {
                    setShowPasswordModal(true);
                    setShowProfile(false);
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 text-sm"
                >
                  Change Password
                </button>

                <div className="border-t dark:border-gray-700">
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 text-sm text-red-600"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Profile Page Modal */}
      {showProfilePage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <AdminProfile user={admin} />
            <button
              onClick={() => setShowProfilePage(false)}
              className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {showPasswordModal && (
        <ChangePasswordModal
          onClose={() => setShowPasswordModal(false)}
          onSubmit={handlePasswordChange}
        />
      )}
    </>
  );
}

export default AdminNavbar;
