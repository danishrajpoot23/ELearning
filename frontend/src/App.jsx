import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from "react-router-dom";


import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Features from "./components/Features";
import LoadingAnimation from "./components/LoadingAnimation";
import FloatingActionButton from "./components/FloatingActionButton";
import CardItem from "./components/CardItem";
import Signup from "./components/Signup";
import EmailVerified from "./pages/EmailVerified.jsx";
import FrontendLogin from "./components/FrontendLogin.jsx";
import Partner from "./components/Partner";
import TestimonialsSection from "./components/TestimonialsSection.jsx";
import ContactUs from "./components/ContactUs";
import SubscriptionPage from "./components/SubscriptionPage";

import CardDetail from "./pages/CardDetail";
import CourseInterface from "./pages/CourseInterface.jsx";
import ChooseLectures from "./pages/ChooseLectures";
import LecturePlayer from "./pages/LecturePlayer";
import TestCardPage from "./pages/TestCardPage";
import Mcqs from "./pages/Mcqs"; 
import AboutUs from "./pages/AboutUs";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsAndConditions from "./pages/TermsAndConditions";

import AdminLogin from "./dashboard/AdminLogin.jsx";
import AdminDashboard from "./dashboard/AdminDashboard.jsx";
import Questions from "./dashboard/Questions";
import Profile from "./pages/Profile";


function AppContent() {
  const [activeSlide, setActiveSlide] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [scrollTarget, setScrollTarget] = useState(null);
  const location = useLocation();

  // Jab loader khatam ho jaye aur "/" pe ho to scroll karo
  useEffect(() => {
    if (!isLoading && location.pathname === "/" && scrollTarget) {
      const el = document.getElementById(scrollTarget);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      setScrollTarget(null);
    }
  }, [isLoading, location.pathname, scrollTarget]);

  // Har route change pe loader 2 sec ka
  useEffect(() => {
    setIsLoading(true);
    const t = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(t);
  }, [location.pathname]);

  if (isLoading) return <LoadingAnimation />;

  // Check karo agar route admin ya questions hai
  const isAdminRoute =
    location.pathname.startsWith("/admin") ||
    location.pathname.startsWith("/questions");

  return (
    <div className="font-sans">
      {/* Navbar sirf admin ke ilawa */}
      {!isAdminRoute && (
        <Navbar onNavHover={setActiveSlide} setScrollTarget={setScrollTarget} />
      )}

      {/* Hero sirf home page pe aur admin ke ilawa */}
      {location.pathname === "/" && !isAdminRoute && (
        <Hero activeSlide={activeSlide} />
      )}

      <Routes>
        <Route
          path="/"
          element={
            <>
              <Features />
              <FloatingActionButton />
              <CardItem />
              <div id="prep-courses">
                <CourseInterface />
              </div>
              <Partner />
              <div id="exam-library">
                <TestCardPage />
              </div>
              <TestimonialsSection />
              <AboutUs />
            </>
          }
        />

        <Route path="/card/:id" element={<CardDetail />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/email-verified" element={<EmailVerified/>} />
        <Route path="/frontendlogin" element={<FrontendLogin />} />
        <Route path="/chooselectures" element={<ChooseLectures />} />
        <Route path="/choose-lectures" element={<ChooseLectures />} />
        <Route path="/course/:id/lectures" element={<LecturePlayer />} />
        <Route path="/course/:id/lectures/:topicId" element={<LecturePlayer />} />
        <Route path="/subscribe/:id" element={<SubscriptionPage />} />
        <Route path="/mcqs/:subject" element={<Mcqs />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/privacypolicy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsAndConditions />} />

        {/* Admin routes */}
        <Route path="/admin" element={<Navigate to="/admin/login" />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/*" element={<AdminDashboard />} />
        <Route path="/questions/:subject" element={<Questions />} />

    

        {/* User Profile */}
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </div>
  );
}

function App() {
  return <AppContent />;  // 👈 bas itna, Router hata do
}

export default App;