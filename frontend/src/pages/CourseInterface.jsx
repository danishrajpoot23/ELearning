import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

function Card({ title, description, image, onClick }) {
  return (
    <div
      onClick={onClick}
      className="bg-[#0d2d5a] flex-1 max-w-[350px] rounded-xl shadow-md p-4 
                 cursor-pointer transition-transform duration-200 hover:-translate-y-1"
    >
      <img
        src={image}
        alt={title}
        className="w-4/5 h-[110px] object-contain mx-auto mb-4"
      />
      <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
      <p className="text-sm text-white">{description}</p>
    </div>
  );
}

export default function CourseInterface() {
  const navigate = useNavigate();
  const [dbCourses, setDbCourses] = useState([]);

  const cardsData = [
    {
      id: "math",
      title: "Mathematics Basics",
      description:
        "Learn algebra, geometry, and arithmetic fundamentals through easy-to-follow lessons.",
      image: "https://cdn-icons-png.flaticon.com/512/1828/1828884.png",
    },
    {
      id: "english",
      title: "English Grammar",
      description:
        "Understand grammar rules, tenses, prepositions, and punctuation with interactive lessons.",
      image: "https://cdn-icons-png.flaticon.com/512/197/197484.png",
    },
    {
      id: "vocab",
      title: "Intermediate Vocabulary",
      description:
        "Enhance your vocabulary with useful words, phrases, and expressions for everyday use.",
      image: "https://cdn-icons-png.flaticon.com/512/2721/2721271.png",
    },
    {
      id: "science",
      title: "Science Explorer",
      description:
        "Explore the basics of physics, chemistry, and biology with engaging learning materials.",
      image: "https://cdn-icons-png.flaticon.com/512/3629/3629192.png",
    },
    {
      id: "history",
      title: "History Detective",
      description:
        "Discover historical events and timelines to understand the past effectively.",
      image: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
    },
  ];

  useEffect(() => {
    axios.get("http://localhost:5000/api/courses").then((res) => {
      setDbCourses(res.data);
    });
  }, []);

  const handleCardClick = async (card) => {
    const token = localStorage.getItem("token");

    if (!token) {
      Swal.fire({
        icon: 'warning',
        title: 'Login Required',
        text: 'Please log in first to access the course.',
        confirmButtonColor: '#2563eb',
      }).then(() => {
        navigate("/frontendlogin"); 
      });
      return;
    }

    try {
      // Check if course exists in DB
      const response = await axios.get("http://localhost:5000/api/courses");
      const courses = response.data;
      
      const courseExists = courses.find(
        (c) => c.title.toLowerCase() === card.title.toLowerCase()
      );

      if (courseExists) {
        // ✅ FIX: Navigate to ChooseLectures with proper state
        navigate("/choose-lectures", { 
          state: { 
            courseId: courseExists._id, 
            title: card.title 
          } 
        });
      } else {
        // Create the course if it doesn't exist
        const newCourse = await axios.post("http://localhost:5000/api/courses", {
          title: card.title,
          topics: []
        });
        
        // ✅ FIX: Navigate to ChooseLectures with proper state for new course
        navigate("/choose-lectures", { 
          state: { 
            courseId: newCourse.data._id, 
            title: card.title 
          } 
        });
      }
    } catch (error) {
      console.error("Error handling course:", error);
      Swal.fire({
        icon: 'error',
        title: 'Server Error',
        text: 'An error occurred while fetching course data. Please check the server connection.',
        confirmButtonColor: '#d33',
      });
    }
  };

  return (
    <div className="max-w-[1200px] mx-auto p-5 text-center">
      <h1 className="text-[50px] font-bold mb-8 text-[#3e8b4b]">
        "Explore Our Courses"
      </h1>

      {/* First Row - 3 cards */}
      <div className="flex justify-center gap-5 flex-wrap mb-8">
        {cardsData.slice(0, 3).map((card) => (
          <Card
            key={card.id}
            title={card.title}
            description={card.description}
            image={card.image}
            onClick={() => handleCardClick(card)}
          />
        ))}
      </div>

      {/* Second Row - 2 cards */}
      <div className="flex justify-center gap-5 flex-wrap">
        {cardsData.slice(3).map((card) => (
          <Card
            key={card.id}
            title={card.title}
            description={card.description}
            image={card.image}
            onClick={() => handleCardClick(card)}
          />
        ))}
      </div>
    </div>
  );
}