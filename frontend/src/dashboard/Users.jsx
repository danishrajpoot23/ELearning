// 📁 Users.jsx (FINAL FIXED VERSION with Badges & Role Management)

import React, { useState, useEffect } from "react";
import { FaTrash } from "react-icons/fa";
import toast from "react-hot-toast";
// ⭐️ NEW IMPORT: SweetAlert2 ko import karein
import Swal from 'sweetalert2'; 

// ⭐️ IMPORT: Role Update function aur User Service functions
import { updateAdminUserRole } from "../services/adminAuthService"; 
import { fetchAllUsers, createNewUser, deleteUser } from "../services/adminUserService"; 

// ⭐️ NEW HELPER FUNCTION: Role/Status ko colored badge styling dega
const getStatusBadge = (status) => {
    // Input value ko lowercase kar len taake "Student" aur "student" dono match ho
    const lowerStatus = status.toLowerCase();
    let classes = "";
    
    if (lowerStatus === "active") {
        classes = "bg-green-100 text-green-700";
    } else if (lowerStatus === "inactive") {
        classes = "bg-yellow-100 text-yellow-700";
    }
    else if (lowerStatus === "admin") {
        classes = "bg-red-100 text-red-700 font-bold";
    }
    else if (lowerStatus === "teacher") {
        classes = "bg-blue-100 text-blue-700";
    }
    else { // Default for student
        classes = "bg-indigo-100 text-indigo-700";
    }

    // Display ke liye pehla letter capital kar den
    const displayStatus = lowerStatus.charAt(0).toUpperCase() + lowerStatus.slice(1);
    
    return (
        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${classes}`}>
            {displayStatus}
        </span>
    );
};

function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true); 
  const [updatingUserId, setUpdatingUserId] = useState(null); 
  
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "student", // Database mein role lowercase mein hona chahiye
    status: "Active",
  });
  const [showAddModal, setShowAddModal] = useState(false);
  const [search, setSearch] = useState("");

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await fetchAllUsers();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error.message);
      toast.error(error.message);
      setUsers([]); 
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []); 

  const handleAddUser = async () => {
    if (newUser.name && newUser.email) {
      try {
        const data = await createNewUser({
          ...newUser,
          // Role ko lowercase mein bhejein
          role: newUser.role.toLowerCase(), 
          status: newUser.status,
        });

        // Backend se aane wala data use karein
        setUsers([...users, data]);
        setNewUser({ name: "", email: "", role: "student", status: "Active" });
        setShowAddModal(false);
        toast.success("User added successfully!");
      } catch (error) {
        console.error("Error adding user:", error.message);
        toast.error(error.message);
      }
    } else {
      toast.error("Please fill out both Name and Email.");
    }
  };

  // ⭐️ UPDATED: handleDeleteUser with SweetAlert2
  const handleDeleteUser = async (userId) => {
    // SweetAlert2 Confirmation
    const result = await Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this! The user data will be permanently deleted.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#dc2626", // Red-600
        cancelButtonColor: "#4b5563", // Gray-600
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "Cancel"
    });

    if (result.isConfirmed) {
        try {
            await deleteUser(userId);
            
            setUsers(users.filter((u) => u._id !== userId));
            
            // Success notification using Swal (or you can use toast)
            Swal.fire({
                title: "Deleted!",
                text: "The user has been deleted successfully.",
                icon: "success"
            });
        } catch (error) {
            console.error("Error deleting user:", error.message);
            // Error notification using Swal
            Swal.fire({
                title: "Error!",
                text: error.message || "Failed to delete user.",
                icon: "error"
            });
        }
    }
  };

  // Role Update Handler (As discussed before)
  const handleRoleChange = async (userId, newRole) => {
    setUpdatingUserId(userId); 
    const roleToSend = newRole.toLowerCase();

    try {
      const updatedUser = await updateAdminUserRole(userId, roleToSend); 
      
      setUsers(users.map(u => u._id === userId ? { ...u, role: updatedUser.role } : u));

      toast.success(`${updatedUser.name}'s role updated to ${newRole}!`);
    } catch (error) {
      console.error("Error updating role:", error.message);
      fetchUsers(); // Refresh list on error
    } finally {
      setUpdatingUserId(null);
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex items-center justify-center p-6 min-h-screen bg-gradient-to-br from-[#1e293b] via-[#0f172a] to-[#1e40af]">
      <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-200 w-full max-w-5xl">
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">
          Users Management
        </h2>

        {/* Search + Add */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="min-w-[260px] px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white shadow-sm"
          />
          <button
            onClick={() => setShowAddModal(true)}
            className="w-48 px-5 py-2 font-semibold text-white rounded-lg bg-indigo-600 hover:bg-indigo-700 shadow-md transition-all"
          >
            + Add User
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="text-center py-8 text-indigo-600">
              Loading users...
            </div>
          ) : (
            <table className="w-full bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  {["#", "Name", "Email", "Role", "Status", "Actions"].map(
                    (head) => (
                      <th
                        key={head}
                        className="px-4 py-3 text-left text-gray-700 font-semibold text-sm border-b"
                      >
                        {head}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user, index) => (
                    <tr
                      key={user._id || index}
                      className={`hover:bg-gray-50 ${
                        index % 2 === 0 ? "bg-gray-50" : "bg-white"
                      }`}
                    >
                      <td className="px-4 py-2 border-b">{index + 1}</td>
                      <td className="px-4 py-2 border-b">{user.name}</td>
                      <td className="px-4 py-2 border-b">{user.email}</td>
                      
                      {/* Role Dropdown & Badge */}
                      <td className="px-4 py-2 border-b">
                        <select
                          value={user.role || "student"}
                          onChange={(e) => handleRoleChange(user._id, e.target.value)}
                          disabled={updatingUserId === user._id || user.role === 'admin'} 
                          className={`px-2 py-1 rounded border ${
                            user.role === "admin" ? "bg-red-100 border-red-300" : "bg-white border-gray-300"
                          } focus:ring-2 focus:ring-indigo-400`}
                        >
                          {/* Options ko lowercase values ke saath rakhein */}
                          <option value="student">Student</option>
                          <option value="teacher">Teacher</option>
                          <option value="admin">Admin</option>
                        </select>
                        {updatingUserId === user._id && <span className="ml-2 text-indigo-600 text-sm">Saving...</span>}
                      </td>

                      {/* Status Badge */}
                      <td className="px-4 py-2 border-b">
                        {/* Status/Role ko badge style se dikhayein */}
                        {getStatusBadge(user.status || "Active")}
                      </td>
                      <td className="px-4 py-2 border-b">
                        <button
                          onClick={() => handleDeleteUser(user._id)}
                          className="p-2 bg-red-100 text-red-600 rounded hover:scale-110 transition-all"
                          disabled={user.role === 'admin'} 
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="6"
                      className="text-center py-4 text-gray-500 border-b"
                    >
                      No users found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Add User Modal (Unchanged) */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-11/12 max-w-md shadow-lg animate-fadeIn">
            <h3 className="text-lg font-semibold mb-4">Add New User</h3>
            <input
              type="text"
              placeholder="Enter name"
              value={newUser.name}
              onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
              className="w-full mb-3 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
            <input
              type="email"
              placeholder="Enter email"
              value={newUser.email}
              onChange={(e) =>
                setNewUser({ ...newUser, email: e.target.value })
              }
              className="w-full mb-3 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
            <select
              value={newUser.role}
              onChange={(e) =>
                setNewUser({ ...newUser, role: e.target.value })
              }
              className="w-full mb-3 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
            >
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
              <option value="admin">Admin</option>
            </select>
            <select
              value={newUser.status}
              onChange={(e) =>
                setNewUser({ ...newUser, status: e.target.value })
              }
              className="w-full mb-4 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
            <div className="flex justify-end gap-3">
              <button
                onClick={handleAddUser}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-all"
              >
                Save
              </button>
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Users;