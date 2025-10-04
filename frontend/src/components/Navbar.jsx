// src/components/Navbar.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaUserCircle, FaBars, FaTimes } from "react-icons/fa";
// ⭐️ Zaroori Imports: authService se functions import krain
import { fetchMe, logout } from "../services/authService"; // Ensure this path is correct

const Navbar = ({ onNavHover = () => {}, setScrollTarget = () => {}, setUser }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [user, setLocalUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false); // mobile toggle
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Scroll effect (No change)
  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // ⭐️ Fetch user on mount (Logic Updated)
  useEffect(() => {
    const fetchUser = async () => {
      try {
        // DIRECTLY use the service function: no need for complex fetch/res/data logic here
        const data = await fetchMe(); 
        
        // fetchMe returns null if unauthorized (401), which solves your error!
        if (data && data.user) {
          setLocalUser(data.user);
          setUser && setUser(data.user); // update global state
        } else {
          // User authorized nahi hai ya data nahi mila, toh user state clear krain.
          setLocalUser(null);
          setUser && setUser(null);
        }
      } catch (err) {
        // Network ya unexpected error
        console.error("Error fetching user details:", err);
        setLocalUser(null);
        setUser && setUser(null);
      }
    };
    fetchUser();
  }, [setUser]);

  // ⭐️ Logout (Logic Updated)
  const handleLogout = async () => {
    try {
      // DIRECTLY use the logout service function
      await logout(); 
    } catch (error) {
      console.error("Logout failed:", error.message);
      // Agar server-side error ho, tab bhi frontend se state clear karna behtar hai
    }
    setLocalUser(null);
    setUser && setUser(null);
    navigate("/");
  };

  return (
    <nav
      className={`navbar fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? "scrolled" : ""
      }`}
    >
      <div className="container mx-auto px-4 flex justify-between items-center h-16">
        {/* Logo */}
        <div
          className="logo cursor-pointer"
          onClick={() =>
            location.pathname === "/" ? window.location.reload() : navigate("/")
          }
        >
          <div className="logo-shapes">
            <div className="logo-shape shape-1"></div>
            <div className="logo-shape shape-2"></div>
            <div className="logo-shape shape-3"></div>
            <div className="logo-shape shape-4"></div>
          </div>
          <div className="logo-text">
            <span className="logo-title">IELTS</span>
            <span className="logo-subtitle">Online</span>
            <span className="logo-tagline">Practice Test</span>
          </div>
        </div>

        {/* Desktop Menu */}
        <div className="nav-links desktop-only">
          <button className="nav-link" onClick={() => setScrollTarget("prep-courses")}>
            Prep Courses
          </button>
          <button className="nav-link" onClick={() => setScrollTarget("exam-library")}>
            Exam Library
          </button>
          <button className="nav-link" onClick={() => navigate("/contact")}>
            Contact
          </button>
        </div>

        {/* Desktop Auth Section */}
        <div className="auth-buttons desktop-only">
          {!user ? (
            <>
              <button className="auth-button" onClick={() => navigate("/signup")}>
                Sign Up
              </button>
              <button className="auth-button" onClick={() => navigate("/frontendlogin")}>
                Log in
              </button>
            </>
          ) : (
            <div className="profile-dropdown">
              <button
                className="auth-button profile-trigger"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                <FaUserCircle size={40} />
                {/* <span>{user.name || "Profile"}</span> */}
              </button>
              {dropdownOpen && (
                <div className="profile-menu absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden animate-fadeIn">
                  {/* User Info */}
                  <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
                    <p className="font-semibold text-gray-800">{user.name}</p>
                    <p className="text-sm text-gray-500 truncate">{user.email}</p>
                  </div>

                  {/* Menu Items */}
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile Toggle */}
        <div className="md:hidden">
          <button onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="mobile-menu bg-[#0d253f] text-white md:hidden flex flex-col space-y-3 px-6 py-6 rounded-b-2xl shadow-lg transition-all duration-300">
          <button
            onClick={() => setScrollTarget("prep-courses")}
            className="nav-link block text-left px-4 py-2 rounded-lg hover:bg-white/10 transition"
          >
            Prep Courses
          </button>
          <button
            onClick={() => setScrollTarget("exam-library")}
            className="nav-link block text-left px-4 py-2 rounded-lg hover:bg-white/10 transition"
          >
            Exam Library
          </button>
          <button
            onClick={() => navigate("/contact")}
            className="nav-link block text-left px-4 py-2 rounded-lg hover:bg-white/10 transition"
          >
            Contact
          </button>
          <button
            onClick={() => navigate("/profile")}
            className="nav-link block text-left px-4 py-2 rounded-lg hover:bg-white/10 transition"
          >
            My Profile
          </button>

          {/* Auth in mobile */}
          {!user ? (
            <div className="mobile-auth mt-4 flex flex-col gap-3">
              <button
                onClick={() => navigate("/signup")}
                className="auth-button w-full bg-yellow-400 text-black font-semibold py-2 rounded-lg shadow hover:bg-yellow-500 transition"
              >
                Sign Up
              </button>
              <button
                onClick={() => navigate("/frontendlogin")}
                className="auth-button w-full bg-white text-[#0d253f] font-semibold py-2 rounded-lg shadow hover:bg-gray-200 transition"
              >
                Log in
              </button>
            </div>
          ) : (
            <div className="mobile-auth mt-4 flex flex-col gap-3">
              <button
                onClick={handleLogout}
                className="dropdown-item w-full text-left px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
