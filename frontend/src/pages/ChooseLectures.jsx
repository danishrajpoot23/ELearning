import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

export default function ChooseLectures() {
  const navigate = useNavigate();
  const location = useLocation();

  // 👇 state se courseId & title receive
  const { courseId, title } = location.state || {};

  const [lectures, setLectures] = useState([]);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        if (!courseId) return; // agar courseId na ho

        // ✅ direct ek hi course fetch karo by ID
        const res = await axios.get(`http://localhost:5000/api/courses/${courseId}`);
        const course = res.data;

        if (course && course.topics) {
          setLectures(course.topics);
        } else {
          setLectures([]);
        }
      } catch (err) {
        console.error("Error fetching course:", err);
        setLectures([]);
      }
    };

    fetchCourse();
  }, [courseId]);

  // ✅ navigate with courseId & topicId
  const handleLectureClick = (topic) => {
    if (courseId) {
      navigate(`/course/${courseId}/lectures/${topic._id}`);
    } else {
      console.error("CourseId not found!");
    }
  };

  return (
    <div className="min-w-[99vw] flex bg-gradient-to-br from-[#0d1b4c] to-[#8594c4]">
      <div className="min-w-[40vw] mx-auto font-sans bg-gradient-to-br from-[#0d1b4c] to-[#1c2c5b] min-h-[99vh] px-12 border-2 border-gray-500">
        
        {/* Course Title */}
        <div className="pt-[5vh] text-center mb-8 pb-4 border-b border-white/20">
          <h1 className="text-white text-2xl font-semibold">
            {title || "Course"}
          </h1>
        </div>

        {/* Topics */}
        <div className="bg-white/5 rounded-xl shadow-lg p-4 text-white">
          <h2 className="text-lg font-medium mb-5 pb-2 border-b border-white/10">
            Topics in "{title || "Course"}"
          </h2>

          <div className="flex flex-col gap-3">
            {lectures.length > 0 ? (
              lectures.map((lec) => (
                <div
                  key={lec._id}
                  onClick={() => handleLectureClick(lec)}
                  className="flex justify-between items-center p-4 bg-white/10 border border-white/20 rounded-md cursor-pointer transition-all duration-200 hover:bg-white/20 hover:translate-x-1"
                >
                  <span className="text-base font-medium">{lec.name}</span>
                  <span className="text-lg font-bold">→</span>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-300 italic p-5">
                No topics found. Please add topics in admin panel.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
