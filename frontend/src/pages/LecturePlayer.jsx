// src/pages/LecturePlayer.jsx
import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FaFilePdf,
  FaFileAlt,
  FaDownload,
  FaExternalLinkAlt,
  FaVideo,
  FaCopy,
} from "react-icons/fa";

export default function LecturePlayer() {
  const { id, topicId } = useParams();
  const navigate = useNavigate();

  const [lecture, setLecture] = useState(null);
  const [allLectures, setAllLectures] = useState([]);
  const [courseTitle, setCourseTitle] = useState("");
  const [loading, setLoading] = useState(true);

  const previewUrls = useRef({});

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        setLoading(true);
        const res = await fetch(`http://localhost:5000/api/courses/${id}`);
        if (!res.ok) throw new Error("Failed to fetch course");
        const data = await res.json();

        setCourseTitle(data.title || "Untitled Course");
        setAllLectures(data.topics || []);

        const found = (data.topics || []).find((t) => t._id === topicId);
        if (found) {
          setLecture(found);
        } else if ((data.topics || []).length > 0) {
          navigate(`/course/${id}/lectures/${data.topics[0]._id}`, {
            replace: true,
          });
        } else {
          setLecture(null);
        }
      } catch (err) {
        console.error("Fetch course error:", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchCourseData();

    return () => {
      Object.values(previewUrls.current).forEach((u) => {
        try {
          URL.revokeObjectURL(u);
        } catch (_) {}
      });
      previewUrls.current = {};
    };
  }, [id, topicId, navigate]);

  const getYouTubeId = (url) => {
    if (!url) return null;
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const filenameFromPath = (filePath) => {
    if (!filePath) return null;
    return filePath.split("/").pop();
  };

  const fileExt = (filename) => {
    if (!filename) return "";
    const idx = filename.lastIndexOf(".");
    return idx >= 0 ? filename.slice(idx) : "";
  };

  const handleSecureDownload = async (filePath, displayName) => {
    try {
      const storedFilename = filenameFromPath(filePath);
      if (!storedFilename) throw new Error("Invalid file path");

      // fetch via API route (which sets inline etc.)
      const resp = await fetch(
        `http://localhost:5000/api/files/${encodeURIComponent(storedFilename)}`
      );
      if (!resp.ok) throw new Error("Download failed");
      const blob = await resp.blob();

      // pick a sensible download name: displayName (DB name w/o ext) + original ext
      const ext = fileExt(storedFilename); // includes the dot, e.g. ".pdf"
      const suggestedName =
        (displayName ? displayName : storedFilename.replace(ext, "")) + ext;

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = suggestedName;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Secure download failed:", err);
      // fallback: open in new tab via API route
      const storedFilename = filenameFromPath(filePath);
      if (storedFilename) {
        window.open(
          `http://localhost:5000/api/files/${encodeURIComponent(storedFilename)}`,
          "_blank",
          "noopener,noreferrer"
        );
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-lg font-medium text-gray-700">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          Loading lecture...
        </div>
      </div>
    );
  }

  if (!lecture) {
    return (
      <div className="flex items-center justify-center min-h-screen text-lg font-medium text-gray-700">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Lecture Not Found</h2>
          <p className="text-gray-600">
            The requested lecture could not be loaded.
          </p>
          <button
            onClick={() => navigate("/chooselectures")}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Back to Courses
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20"> {/* ✅ Added top padding to push content below navbar */}
      <div className="flex flex-col md:flex-row p-6 md:p-8 gap-6 max-w-7xl mx-auto">
        {/* Main area - Fixed padding to prevent hiding under navbar */}
        <div className="flex flex-col gap-6 flex-[3] w-full md:w-[70%]">
          {/* ✅ Added margin top to ensure topic name is visible */}
          <div className="mt-4">
            <h2 className="text-[#302283] text-3xl md:text-4xl font-bold">
              {lecture.name || "Untitled Lecture"}
            </h2>
          </div>

          {lecture.files && lecture.files.length > 0 ? (
            <div className="grid grid-cols-1 gap-6">
              {lecture.files.map((file, idx) => {
                const storedFilename = filenameFromPath(file.data);
                const lowerStored = (storedFilename || "").toLowerCase();

                const isLink = file.type === "link";
                const isPdf = !isLink && lowerStored.endsWith(".pdf");
                const isTxt =
                  lowerStored.endsWith(".txt") || lowerStored.endsWith(".md");
                const isImg = /\.(png|jpg|jpeg|gif)$/i.test(lowerStored);

                return (
                  <div
                    key={idx}
                    className="border border-gray-300 rounded-lg bg-white shadow-md p-4 flex flex-col"
                    style={{ height: "500px" }}
                  >
                    {/* Header */}
                    <div className="flex items-center gap-3 mb-3">
                      {isLink ? (
                        <FaVideo className="text-red-500" />
                      ) : isPdf ? (
                        <FaFilePdf className="text-red-500" />
                      ) : (
                        <FaFileAlt className="text-gray-600" />
                      )}
                      <h3 className="text-lg font-semibold text-gray-800">
                        {file.name || storedFilename}
                      </h3>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-hidden rounded border bg-gray-50">
                      {isLink ? (
                        file.data.includes("youtube") ||
                        file.data.includes("youtu.be") ? (
                          <iframe
                            width="100%"
                            height="100%"
                            src={`https://www.youtube.com/embed/${getYouTubeId(
                              file.data
                            )}`}
                            title={`${lecture.name} - video ${idx + 1}`}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full p-4">
                            <a
                              href={file.data}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 underline flex items-center gap-2 break-all"
                            >
                              <FaExternalLinkAlt /> {file.data}
                            </a>
                          </div>
                        )
                      ) : isPdf ? (
                        <iframe
                          src={`http://localhost:5000/api/files/${encodeURIComponent(
                            storedFilename
                          )}`}
                          className="w-full h-full"
                          title={file.name || storedFilename}
                        />
                      ) : isTxt ? (
                        <TextPreview file={file} />
                      ) : isImg ? (
                        <img
                          src={`http://localhost:5000/api/files/${encodeURIComponent(
                            storedFilename
                          )}`}
                          alt={file.name || storedFilename}
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center h-full p-4 text-center">
                          <p className="text-gray-700 mb-3">
                            Preview not available for this file type.
                          </p>
                          <button
                            onClick={() =>
                              handleSecureDownload(file.data, file.name)
                            }
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                          >
                            <FaDownload className="inline mr-2" /> Download
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Footer */}
                    <div className="mt-3 flex items-center justify-between text-sm text-gray-600">
                      <div>{file.name || storedFilename}</div>
                      <button
                        onClick={() => {
                          const storedFilename = filenameFromPath(file.data);
                          const actualUrl = `http://localhost:5000/api/files/${encodeURIComponent(
                            storedFilename
                          )}`;
                          navigator.clipboard.writeText(actualUrl);
                          alert("Download URL copied to clipboard");
                        }}
                        className="px-2 py-1 bg-gray-100 rounded hover:bg-gray-200"
                      >
                        <FaCopy />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg border border-gray-300">
              <FaFileAlt className="text-6xl mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                No Content Available
              </h3>
              <p className="text-gray-600">
                This lecture doesn't have any files or links yet.
              </p>
            </div>
          )}
        </div>

        {/* Sidebar - Fixed position to stay visible */}
        <div className="flex-1 bg-[#302283] text-white p-6 rounded-lg max-h-[calc(100vh-120px)] overflow-y-auto sticky top-24"> {/* ✅ Increased top spacing */}
          <h3 className="text-xl font-semibold mb-4 border-b border-white/20 pb-3">
            {courseTitle} - Topics
          </h3>

          {allLectures.length > 0 ? (
            <div className="space-y-2">
              {allLectures.map((lec) => (
                <button
                  key={lec._id}
                  className={`w-full text-left px-4 py-3 rounded-md transition-all duration-200 ${
                    lec._id === lecture._id
                      ? "bg-blue-600 text-white shadow-lg"
                      : "bg-white/10 text-white hover:bg-white/20"
                  }`}
                  onClick={() => navigate(`/course/${id}/lectures/${lec._id}`)}
                >
                  <div className="flex justify-between items-center">
                    <span>{lec.name || "Untitled Topic"}</span>
                    {lec.files && lec.files.length > 0 && (
                      <span className="text-xs bg-green-500 px-2 py-1 rounded-full">
                        {lec.files.length}
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <p className="italic text-gray-300 text-center py-8">
              No topics available for this course.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// Component to preview text files inline
function TextPreview({ file }) {
  const [text, setText] = useState("Loading...");

  useEffect(() => {
    const storedFilename = file.data.split("/").pop();
    fetch(`http://localhost:5000/api/files/${encodeURIComponent(storedFilename)}`)
      .then((res) => res.text())
      .then((txt) => setText(txt))
      .catch(() => setText("Error loading file"));
  }, [file]);

  return (
    <pre className="p-4 text-sm font-mono whitespace-pre-wrap overflow-y-auto h-full">
      {text}
    </pre>
  );
}