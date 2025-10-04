// src/components/Courses.jsx
import React, { useState, useEffect } from "react";
import { FaPlus, FaSearch, FaEdit, FaTrash, FaFile, FaLink, FaCheck, FaTimes } from "react-icons/fa";
import axios from "axios";

const API_URL = "http://localhost:5000/api/courses";

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [fileType, setFileType] = useState("file");
  const [newLink, setNewLink] = useState("");
  const [courseData, setCourseData] = useState({ title: "", topics: [] });

  const [topicModal, setTopicModal] = useState(false);
  const [currentTopic, setCurrentTopic] = useState(null);
  const [currentCourse, setCurrentCourse] = useState(null);

  const [showTopicModal, setShowTopicModal] = useState(false);
  const [topicInput, setTopicInput] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

  // Popup States
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [confirmMessage, setConfirmMessage] = useState("");

  // ---------------- POPUP FUNCTIONS ----------------
  const showSuccess = (message) => {
    setPopupMessage(message);
    setShowSuccessPopup(true);
    setTimeout(() => setShowSuccessPopup(false), 3000);
  };

  const showError = (message) => {
    setPopupMessage(message);
    setShowErrorPopup(true);
    setTimeout(() => setShowErrorPopup(false), 3000);
  };

  const showConfirm = (message, action) => {
    setConfirmMessage(message);
    setConfirmAction(() => action);
    setShowConfirmPopup(true);
  };

  // ---------------- FETCH COURSES ----------------
  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error("Failed to fetch courses");
      const data = await res.json();
      setCourses(data.courses || data);
    } catch (err) {
      showError("Failed to load courses");
    }
  };

  const truncateText = (text = "", max = 30) =>
    text.length > max ? text.slice(0, 25) + "..." + text.slice(-5) : text;

  // ---------------- SAVE COURSE ----------------
  const handleSaveCourse = async () => {
    if (!courseData.title.trim()) {
      showError("Course title is required!");
      return;
    }

    try {
      const method = editingCourse ? "PUT" : "POST";
      const url = editingCourse ? `${API_URL}/${editingCourse._id}` : API_URL;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(courseData),
      });

      if (!res.ok) throw new Error("Failed to save course");
      
      fetchCourses();
      setShowModal(false);
      setCourseData({ title: "", topics: [] });
      showSuccess(editingCourse ? "Course updated successfully!" : "Course added successfully!");
      
    } catch (err) {
      showError("Error saving course");
    }
  };

  // ---------------- DELETE COURSE ----------------
  const handleDeleteCourse = async (id) => {
    showConfirm("Are you sure you want to delete this course?", async () => {
      try {
        const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
        if (!res.ok) throw new Error("Failed to delete course");
        fetchCourses();
        showSuccess("Course deleted successfully!");
      } catch (err) {
        showError("Failed to delete course");
      }
    });
  };

  // ---------------- LINK ADDITION ----------------
  const handleAddLinkToTopic = async (courseId, topicId, link) => {
    if (!link.trim()) {
      showError("Please enter a link");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/courses/${courseId}/topics/${topicId}/links`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: link, name: "YouTube Link" }),
        }
      );

      if (!response.ok) throw new Error("Failed to add link");
      const updatedCourse = await response.json();

      const updatedTopic = updatedCourse.topics.find((t) => t._id === topicId);
      if (updatedTopic) {
        setCurrentTopic(updatedTopic);
      }

      showSuccess("Link added successfully!");
      setNewLink("");
      fetchCourses();
    } catch (error) {
      showError("Failed to add link");
    }
  };

  // ---------------- FILE UPLOAD ----------------
  const handleFileUpload = async (courseId, topicId, file) => {
    if (!file) {
      showError("Please select a file");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(
        `http://localhost:5000/api/courses/${courseId}/topics/${topicId}/files`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) throw new Error("Upload failed");
      const updatedCourse = await response.json();

      const updatedTopic = updatedCourse.topics.find((t) => t._id === topicId);
      if (updatedTopic) {
        setCurrentTopic(updatedTopic);
      }

      showSuccess("File uploaded successfully!");
      fetchCourses();
    } catch (error) {
      showError("File upload failed");
    }
  };

  // ---------------- DELETE FILE ----------------
  const handleDeleteFileFromTopic = async (fileIndex) => {
    showConfirm("Are you sure you want to delete this file?", async () => {
      const updatedTopic = {
        ...currentTopic,
        files: (currentTopic.files || []).filter((_, i) => i !== fileIndex),
      };

      const updatedCourse = {
        ...currentCourse,
        topics: currentCourse.topics.map((t) =>
          t._id === currentTopic._id ? updatedTopic : t
        ),
      };

      try {
        const res = await fetch(`${API_URL}/${currentCourse._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedCourse),
        });
        if (!res.ok) throw new Error("Failed to delete file");
        await res.json();

        setCurrentTopic(updatedTopic);
        fetchCourses();
        showSuccess("File deleted successfully!");
      } catch (err) {
        showError("Failed to delete file");
      }
    });
  };

  // ---------------- TOPIC MODALS ----------------
  const handleOpenAddTopicModal = () => {
    setTopicInput("");
    setShowTopicModal(true);
  };

  const handleAddTopic = async () => {
    if (topicInput.trim()) {
      const newTopic = { name: topicInput.trim(), files: [] };
      const updatedCourseData = {
        ...courseData,
        topics: [...(courseData.topics || []), newTopic],
      };
      setCourseData(updatedCourseData);
      setTopicInput("");
      setShowTopicModal(false);
      showSuccess("Topic added successfully!");
    } else {
      showError("Please enter topic name");
    }
  };

  const handleDeleteTopic = (topicId) => {
    showConfirm("Are you sure you want to delete this topic?", () => {
      setCourseData({
        ...courseData,
        topics: (courseData.topics || []).filter((t) => t._id !== topicId),
      });
      showSuccess("Topic deleted successfully!");
    });
  };

  const handleOpenTopic = (course, topic) => {
    setCurrentCourse(course);
    setCurrentTopic(topic);
    setTopicModal(true);
    setNewLink("");
    setFileType("file");
  };

  const handleCloseTopic = () => {
    setTopicModal(false);
    setCurrentTopic(null);
    setCurrentCourse(null);
    setNewLink("");
  };

  // ---------------- FILTERED COURSES ----------------
  const filteredCourses = courses.filter((c) =>
    (c.title || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ---------------- RENDER ----------------
  return (
  <div className="flex items-center justify-center p-6 min-h-screen bg-gradient-to-br from-[#1e293b] via-[#0f172a] to-[#1e40af] relative">
    
    {/* ✅ Success Popup */}
    {showSuccessPopup && (
      <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-[9999] animate-fadeIn">
        <div className="flex items-center gap-2">
          <FaCheck className="text-white" />
          <span>{popupMessage}</span>
        </div>
      </div>
    )}

    {/* ✅ Error Popup */}
    {showErrorPopup && (
      <div className="fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-[9999] animate-fadeIn">
        <div className="flex items-center gap-2">
          <FaTimes className="text-white" />
          <span>{popupMessage}</span>
        </div>
      </div>
    )}

    {/* ✅ Confirm Popup → ab sab ke upar render hoga */}
    {showConfirmPopup && (
      <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[10000]">
        <div className="bg-white p-6 rounded-xl w-full max-w-sm shadow-lg animate-fadeIn">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Confirm Action</h3>
          <p className="text-gray-600 mb-6">{confirmMessage}</p>
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setShowConfirmPopup(false)}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                confirmAction();
                setShowConfirmPopup(false);
              }}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    )}

      <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-200 w-full max-w-5xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Course Management</h1>
          <button
            onClick={() => {
              setEditingCourse(null);
              setCourseData({ title: "", topics: [] });
              setShowModal(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 shadow-md transition-all"
          >
            <FaPlus /> Add Course
          </button>
        </div>

        {/* Search */}
        <div className="flex items-center bg-white rounded-lg px-4 py-2 shadow-md w-80 mb-6 border border-gray-200">
          <FaSearch className="text-gray-400 mr-2" />
          <input
            type="text"
            placeholder="Search courses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 outline-none bg-transparent text-gray-700"
          />
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full bg-white rounded-lg shadow-md border border-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left font-semibold text-gray-700">Title</th>
                <th className="px-4 py-2 text-left font-semibold text-gray-700">Topics</th>
                <th className="px-4 py-2 text-left font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCourses.length > 0 ? (
                filteredCourses.map((c) => (
                  <tr key={c._id} className="hover:bg-gray-50">
                    <td className="px-4 py-2">{c.title}</td>
                    <td className="px-4 py-2">
                      {c.topics && c.topics.length > 0 ? (
                        <select
                          onChange={(e) => {
                            const topic = c.topics.find(
                              (t) => t._id.toString() === e.target.value
                            );
                            if (topic) handleOpenTopic(c, topic);
                          }}
                          className="border rounded px-2 py-1 text-gray-700"
                        >
                          <option>Select topic</option>
                          {c.topics.map((t) => (
                            <option key={t._id} value={t._id}>
                              {t.name}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <span className="text-gray-500">No topics</span>
                      )}
                    </td>
                    <td className="px-4 py-2 flex gap-2">
                      <button
                        onClick={() => {
                          setEditingCourse(c);
                          setCourseData({
                            title: c.title,
                            topics: [...(c.topics || [])],
                          });
                          setShowModal(true);
                        }}
                        className="p-2 bg-blue-100 text-blue-600 rounded hover:scale-110 transition-all"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDeleteCourse(c._id)}
                        className="p-2 bg-red-100 text-red-600 rounded hover:scale-110 transition-all"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="text-center py-6 text-gray-500">
                    No courses found. Please add a course.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ---------------- COURSE MODAL ---------------- */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-lg overflow-y-auto max-h-[80vh] animate-fadeIn">
            <h3 className="text-lg font-semibold mb-4">
              {editingCourse ? "Edit Course" : "Add New Course"}
            </h3>
            <input
              type="text"
              placeholder="Course Title"
              value={courseData.title}
              onChange={(e) =>
                setCourseData({ ...courseData, title: e.target.value })
              }
              className="w-full mb-4 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />

            <div className="mb-4">
              <label className="font-semibold">Topics:</label>
              <button
                type="button"
                onClick={handleOpenAddTopicModal}
                className="ml-2 px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
              >
                + Add Topic
              </button>
              <ul className="mt-2 space-y-1">
                {courseData.topics.map((t, i) => (
                  <li
                    key={t._id || i}
                    className="flex justify-between items-center bg-gray-100 px-2 py-1 rounded"
                  >
                    {t.name}
                    <button
                      onClick={() => handleDeleteTopic(t._id || i)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <FaTrash />
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveCourse}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                {editingCourse ? "Update" : "Add"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ---------------- ADD TOPIC MODAL ---------------- */}
      {showTopicModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-sm shadow-lg animate-fadeIn">
            <h3 className="text-lg font-semibold mb-4">Add New Topic</h3>
            <input
              type="text"
              placeholder="Enter topic name"
              value={topicInput}
              onChange={(e) => setTopicInput(e.target.value)}
              className="w-full mb-4 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowTopicModal(false)}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleAddTopic}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ---------------- TOPIC MODAL ---------------- */}
      {topicModal && currentTopic && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-lg overflow-y-auto max-h-[80vh] animate-fadeIn">
            <h3 className="text-lg font-semibold mb-4">
              Manage Topic: {currentTopic.name}
            </h3>

            <div className="mb-4">
              <label className="font-semibold">Add File or YouTube Link:</label>
              <select
                value={fileType}
                onChange={(e) => {
                  setFileType(e.target.value);
                  setSelectedFile(null);
                  setNewLink("");
                }}
                className="block mb-2 px-3 py-1 border rounded w-full"
              >
                <option value="file">File</option>
                <option value="link">YouTube Link</option>
              </select>

              {fileType === "file" ? (
                <div className="space-y-2 mb-2">
                  <input
                    type="file"
                    onChange={(e) => setSelectedFile(e.target.files[0])}
                    className="w-full p-2 border rounded"
                  />
                  <button
                    onClick={() => {
                      if (!selectedFile) {
                        showError("Please select a file first!");
                        return;
                      }
                      handleFileUpload(currentCourse._id, currentTopic._id, selectedFile);
                    }}
                    className="w-full px-3 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                  >
                    Upload File
                  </button>
                  {selectedFile && (
                    <p className="text-sm text-gray-600">
                      Selected: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(2)} KB)
                    </p>
                  )}
                </div>
              ) : (
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="Paste YouTube link..."
                    value={newLink}
                    onChange={(e) => setNewLink(e.target.value)}
                    className="flex-1 px-3 py-2 border rounded"
                  />
                  <button
                    onClick={() =>
                      handleAddLinkToTopic(
                        currentCourse._id,
                        currentTopic._id,
                        newLink
                      )
                    }
                    className="px-3 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                  >
                    Add Link
                  </button>
                </div>
              )}

              {currentTopic.files && currentTopic.files.length > 0 ? (
                <div className="mt-4">
                  <h4 className="font-semibold mb-2">Attached Content:</h4>
                  <ul className="space-y-2 max-h-40 overflow-y-auto">
                    {currentTopic.files.map((file, index) => (
                      <li
                        key={index}
                        className="flex justify-between items-center bg-gray-100 px-3 py-2 rounded text-sm border border-gray-300"
                      >
                        <span className="flex items-center gap-2 flex-1">
                          {file.type === "file" ? (
                            <>
                              <FaFile className="text-blue-600" />
                              <span title={file.name} className="truncate">
                                {file.name}
                              </span>
                            </>
                          ) : (
                            <>
                              <FaLink className="text-green-600" />
                              <a
                                href={file.data}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline truncate"
                                title={file.data}
                              >
                                {file.name || "External Link"}
                              </a>
                            </>
                          )}
                        </span>
                        
                        <button
                          onClick={() => handleDeleteFileFromTopic(index)}
                          className="text-red-600 hover:text-red-800 ml-2 p-1 rounded hover:bg-red-100"
                          title="Delete"
                        >
                          <FaTrash size={14} />
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p className="text-gray-500 text-sm mt-2 text-center py-4">
                  No files or links added yet.
                </p>
              )}
            </div>

            <div className="flex justify-between">
              <button
                onClick={handleCloseTopic}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Courses;