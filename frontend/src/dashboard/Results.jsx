import React, { useState, useEffect } from "react";
import { FaSearch, FaEye, FaDownload, FaTrash } from "react-icons/fa";
import jsPDF from "jspdf";
import Swal from "sweetalert2";

const Results = () => {
  const [results, setResults] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTest, setSelectedTest] = useState("All");
  const [selectedResult, setSelectedResult] = useState(null);

  // Load results from API
  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/results");
        const data = await res.json();
        setResults(data);
      } catch (err) {
        console.error("Error fetching results:", err);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to load results',
          confirmButtonColor: '#dc3545'
        });
      }
    };
    fetchResults();
  }, []);

  // ✅ Fixed function to get only student name
  const getStudentName = (result) => {
    if (!result.user) return "Unknown";
    
    // Agar user object hai aur usme name property hai
    if (typeof result.user === 'object' && result.user !== null) {
      return result.user.name || "Unknown";
    }
    
    // Agar user string hai (purane format mein)
    if (typeof result.user === 'string') {
      return result.user;
    }
    
    // Agar kuch aur format hai
    return "Unknown";
  };

  // ✅ Search and filter only by name + test
  const filteredResults = results.filter((result) => {
    const userName = getStudentName(result);

    const matchesSearch =
      userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      result.test.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesTest = selectedTest === "All" || result.test === selectedTest;
    return matchesSearch && matchesTest;
  });

  const handleView = (result) => setSelectedResult(result);

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    });

    if (result.isConfirmed) {
      try {
        await fetch(`http://localhost:5000/api/results/${id}`, {
          method: "DELETE",
        });
        setResults((prev) => prev.filter((result) => result._id !== id));
        
        Swal.fire({
          title: 'Deleted!',
          text: 'Result has been deleted.',
          icon: 'success',
          confirmButtonColor: '#28a745',
          timer: 1500
        });
      } catch (err) {
        console.error("Error deleting result:", err);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to delete result',
          confirmButtonColor: '#dc3545'
        });
      }
    }
  };

  // ✅ Download PDF
  const handleDownload = (result) => {
    const userName = getStudentName(result);

    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Student Report", 20, 20);

    doc.setFontSize(12);
    doc.text(`Name: ${userName}`, 20, 40);
    doc.text(`Test: ${result.test}`, 20, 50);
    doc.text(`Score: ${result.correct}/${result.total}`, 20, 60);
    doc.text(`Date: ${result.date}`, 20, 70);

    doc.save(`${userName}_${result.test}_report.pdf`);

    // Success message
    Swal.fire({
      icon: 'success',
      title: 'Download Started!',
      text: 'PDF report is being downloaded',
      confirmButtonColor: '#28a745',
      timer: 1500
    });
  };

  return (
    <div className="flex items-center justify-center p-6 min-h-screen bg-gradient-to-br from-[#1e293b] via-[#0f172a] to-[#1e40af]">
      {/* White Box */}
      <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-200 w-full max-w-5xl">
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-2">
          Test Results
        </h2>
        <p className="text-gray-600 text-center mb-6">
          View and analyze student performance
        </p>

        {/* Filters */}
        <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
          {/* Search */}
          <div className="flex items-center border border-gray-300 rounded-lg px-3 bg-white shadow-sm">
            <FaSearch className="text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="Search by student name or test..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="min-w-[220px] py-2 outline-none bg-transparent"
            />
          </div>

          {/* Test Filter */}
          <select
            value={selectedTest}
            onChange={(e) => setSelectedTest(e.target.value)}
            className="px-4 py-2 rounded-lg border border-gray-300 bg-white shadow-sm text-sm cursor-pointer"
          >
            <option value="All">All Tests</option>
            {[...new Set(results.map((r) => r.test))].map((test, idx) => (
              <option key={idx} value={test}>
                {test}
              </option>
            ))}
          </select>
        </div>

        {/* Results Table */}
        <div className="overflow-x-auto bg-white rounded-xl shadow-lg">
          <table className="w-full table-auto">
            <thead className="bg-gradient-to-r from-blue-500 to-blue-700 text-white">
              <tr>
                <th className="px-4 py-3 text-left">Student Name</th>
                <th className="px-4 py-3 text-left">Test</th>
                <th className="px-4 py-3 text-left">Score</th>
                <th className="px-4 py-3 text-left">Date</th>
                <th className="px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredResults.length ? (
                filteredResults.map((result) => {
                  const userName = getStudentName(result);

                  return (
                    <tr
                      key={result._id || result.id}
                      className="hover:bg-blue-50 transition-all"
                    >
                      <td className="px-4 py-3">
                        {result.user && typeof result.user === "object" ? result.user.name : result.user}
                      </td>
                      <td className="px-4 py-3">{result.test}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-1 rounded-full text-white text-sm font-semibold ${
                            (result.correct / result.total) * 100 >= 75
                              ? "bg-green-600"
                              : (result.correct / result.total) * 100 >= 60
                              ? "bg-yellow-500"
                              : "bg-red-600"
                          }`}
                        >
                          {result.correct}/{result.total}
                        </span>
                      </td>
                      <td className="px-4 py-3">{result.date}</td>
                      <td className="px-4 py-3 flex gap-2">
                        <button
                          onClick={() => handleView(result)}
                          className="p-2 rounded-md text-blue-600 hover:bg-blue-100 transition"
                          title="View Details"
                        >
                          <FaEye />
                        </button>
                        <button
                          onClick={() => handleDownload(result)}
                          className="p-2 rounded-md text-green-600 hover:bg-green-100 transition"
                          title="Download Report"
                        >
                          <FaDownload />
                        </button>
                        <button
                          onClick={() => handleDelete(result._id || result.id)}
                          className="p-2 rounded-md text-red-600 hover:bg-red-100 transition"
                          title="Delete Result"
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-4 text-gray-500">
                    No results found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {selectedResult && (
        <div
          className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50"
          onClick={() => setSelectedResult(null)}
        >
          <div
            className="bg-white rounded-xl p-6 w-80 max-w-full shadow-2xl animate-fadeIn"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold mb-3">Student Report</h3>
            <p>
              <strong>Name:</strong> {getStudentName(selectedResult)}
            </p>
            <p>
              <strong>Test:</strong> {selectedResult.test}
            </p>
            <p>
              <strong>Score:</strong> {selectedResult.correct}/
              {selectedResult.total}
            </p>
            <p>
              <strong>Date:</strong> {selectedResult.date}
            </p>
            <button
              onClick={() => setSelectedResult(null)}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Results;