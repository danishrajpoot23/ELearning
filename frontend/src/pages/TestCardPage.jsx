// src/pages/TestCardsPage.jsx (FINAL - Layout Fixed, SweetAlert Added)

import React from "react";
import { useNavigate } from "react-router-dom";
// ⭐️ ZAROORI: SweetAlert2 ko import krain
import Swal from "sweetalert2"; 
import TestCard from "../components/TestCard"; 
import MathImg from "../assets/images/math.jpeg";
import EnglishImg from "../assets/images/english.jpeg";
import VocabularyImg from "../assets/images/vocabulary.jpeg";
import ScienceImg from "../assets/images/science.jpeg";
import HistoryImg from "../assets/images/history.jpeg";
import { checkSubscription } from "../services/subscriptionService";

const TestCardsPage = () => {
  const navigate = useNavigate();

  const tests = [
    { id: "1", title: "MATHEMATICS", image: MathImg, price: 500 },
    { id: "2", title: "ENGLISH", image: EnglishImg, price: 400 },
    { id: "3", title: "VOCABULARY", image: VocabularyImg, price: 300 },
    { id: "4", title: "SCIENCE", image: ScienceImg, price: 450 },
    { id: "5", title: "HISTORY", image: HistoryImg, price: 350 },
  ];

  const handleCardClick = async (test) => {
    const token = localStorage.getItem("token");

    // 1. Authentication Check (SweetAlert)
    if (!token) {
      Swal.fire({
        icon: 'warning',
        title: 'Login Required',
        text: 'Please log in first to access the test.',
        confirmButtonColor: '#2563eb',
      }).then(() => {
        navigate("/frontendlogin");
      });
      return;
    }

    try {
      const data = await checkSubscription(test.id, token);

      if (data.isSubscribed) {
        navigate(`/mcqs/${test.id}`);
      } else {
        navigate(`/subscribe/${test.id}`, {
          state: { title: test.title, price: test.price },
        });
      }
    } catch (error) {
      console.error("Error checking subscription:", error);
      // 2. Error Handling (SweetAlert)
      Swal.fire({
        icon: 'error',
        title: 'Network Error',
        text: 'An error occurred while checking your subscription status. Please try again.',
        confirmButtonColor: '#d33',
      });
    }
  };

  return (
    <div className="max-w-[1200px] mx-auto p-5 text-center"> 
      <h1 className="text-4xl font-bold text-center text-red-600 mb-8">
        Test Your Understanding
      </h1>

      {/* First Row: 3 Cards */}
      <div className="flex justify-center gap-5 flex-wrap mb-8">
        {tests.slice(0, 3).map((test) => (
          <div 
            key={test.id} 
            // ⭐️ Layout Fixed: flex-1 max-w-[350px]
            className="flex-1 max-w-[350px]"
          >
            <TestCard
              id={test.id}
              title={test.title}
              image={test.image}
              onClick={() => handleCardClick(test)}
            />
          </div>
        ))}
      </div>

      {/* Second Row: 2 Cards */}
      <div className="flex justify-center gap-5 flex-wrap">
        {tests.slice(3).map((test) => (
          <div 
            key={test.id} 
            // ⭐️ Layout Fixed: flex-1 max-w-[350px]
            className="flex-1 max-w-[350px]"
          >
            <TestCard
              id={test.id}
              title={test.title}
              image={test.image}
              onClick={() => handleCardClick(test)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default TestCardsPage;
