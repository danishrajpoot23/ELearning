import React, { useState, useEffect } from "react";
import { FaFileAlt, FaEdit, FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Tests = () => {
  const navigate = useNavigate();

  const [subjects] = useState([
    { id: 1, title: "Mathematics-Basics" },
    { id: 2, title: "English-Grammar" },
    { id: 3, title: "Intermediate-Vocabulary" },
    { id: 4, title: "Science-Explorer" },
    { id: 5, title: "History-Detective" },
  ]);

  const [counts, setCounts] = useState({});
  const [search, setSearch] = useState("");

const loadCounts = async () => {
  try {
    const res = await fetch("http://localhost:5000/api/questions/count"); // ✅ correct URL
    const data = await res.json();

    const updatedCounts = {};
    data.forEach((item) => {
      updatedCounts[item._id] = item.count;
    });
    setCounts(updatedCounts);

    console.log("Counts data from server:", data); // optional: check data
  } catch (err) {
    console.error("Error fetching counts:", err);
  }
};


  useEffect(() => {
    loadCounts();
    window.addEventListener("storage", loadCounts);
    return () => window.removeEventListener("storage", loadCounts);
  }, [subjects]);

const handleAttempt = (title, id) => {
  // MongoDB me stored subject string ko URL me bhejo
   navigate(`/questions/${title}`, { state: { subjectId: id } });
};

  const filteredSubjects = subjects.filter((sub) =>
    sub.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex items-center justify-center p-6 min-h-screen bg-gradient-to-br from-[#1e293b] via-[#0f172a] to-[#1e40af] font-sans">
      <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-200 w-full max-w-5xl">
        <h1 className="text-center text-3xl font-bold text-gray-900 mb-6">
          Subjects & Questions
        </h1>

        <div className="flex items-center mb-6 bg-gray-100 rounded-full px-4 py-2 shadow-sm w-80 mx-auto">
          <FaSearch className="text-gray-500 mr-2" />
          <input
            type="text"
            placeholder="Search subjects..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-transparent outline-none text-gray-700"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full bg-white rounded-lg shadow-md border border-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">
                  Subject
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">
                  No. of Questions
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredSubjects.length > 0 ? (
                filteredSubjects.map((sub, index) => (
                  <tr
                    key={sub.id}
                    className={`hover:bg-gray-50 ${
                      index % 2 === 0 ? "bg-gray-50" : "bg-white"
                    }`}
                  >
                    <td className="px-4 py-3 flex items-center gap-2 text-gray-800">
                      <FaFileAlt className="text-indigo-600" />
                      {sub.title}
                    </td>
                    <td className="px-4 py-3 text-gray-700">
                      {counts[sub.title] || 0}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleAttempt(sub.title, sub.id)}
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 hover:scale-105 transition-all shadow-sm"
                      >
                        <FaEdit />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="text-center py-6 text-gray-500">
                    No subjects found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <style>
          {`
          table {
            border-collapse: separate;
            border-spacing: 0;
          }
          tbody tr td {
            border-top: 1px solid #e5e7eb;
          }
          tbody tr:first-child td {
            border-top: none;
          }
          `}
        </style>
      </div>
    </div>
  );
};

export default Tests;