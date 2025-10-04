import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const Questions = () => {
  const { subject } = useParams();

  const [questions, setQuestions] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newQuestion, setNewQuestion] = useState({
    statement: "",
    options: [""],
    correct: "",
  });

  // ✅ Fetch questions from MongoDB
  useEffect(() => {
    fetch(`http://localhost:5000/api/questions/${subject}`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setQuestions(data);
        } else {
          console.error("Invalid data from server:", data);
          setQuestions([]);
        }
      })
      .catch((err) => console.error("Fetch error:", err));
  }, [subject]);

  // ✅ Handle option change
  const handleOptionChange = (index, value) => {
    const updatedOptions = [...newQuestion.options];
    updatedOptions[index] = value;
    setNewQuestion({ ...newQuestion, options: updatedOptions });
  };

  // ✅ Remove option
  const handleRemoveOption = (index) => {
    const updatedOptions = newQuestion.options.filter((_, i) => i !== index);
    setNewQuestion({ ...newQuestion, options: updatedOptions });
  };

  // ✅ Add option
  const handleAddOption = () => {
    setNewQuestion({ ...newQuestion, options: [...newQuestion.options, ""] });
  };

  // ✅ Save new question
  const handleAddQuestion = async () => {
  if (
    !newQuestion.statement ||
    newQuestion.options.some((opt) => !opt.trim()) ||
    !newQuestion.correct
  ) {
    alert("Please fill all fields and select the correct answer!");
    return;
  }

  try {
    const res = await fetch("http://localhost:5000/api/questions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subject, ...newQuestion }),
    });

    if (!res.ok) {
      const error = await res.json();
      console.error("Failed to save:", error);
      alert("Failed to save question");
      return;
    }

    const saved = await res.json();
    const newEntry = Array.isArray(saved) ? saved[0] : saved;

    setQuestions((prev) => [...prev, newEntry]);
    setNewQuestion({ statement: "", options: [""], correct: "" });
    setShowForm(false);
  } catch (err) {
    console.error("Error adding question:", err);
  }
};


  // ✅ Delete question
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this question?")) return;
    try {
      const res = await fetch(`http://localhost:5000/api/questions/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        console.error("Failed to delete");
        return;
      }

      setQuestions((prev) => prev.filter((q) => q._id !== id));
    } catch (err) {
      console.error("Error deleting question:", err);
    }
  };

  return (
    <div className="flex items-center justify-center p-6 min-h-screen bg-gradient-to-br from-[#1e293b] via-[#0f172a] to-[#1e40af]">
      <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-200 w-full max-w-5xl">
        <h1 className="text-2xl font-bold mb-6 text-gray-900">
          {subject} - Questions
        </h1>

        {/* Add Question Button */}
        <button
          className="mb-6 px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 shadow-md transition"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? "Cancel" : "Add Question"}
        </button>

        {/* Form */}
        {showForm && (
          <div className="flex flex-col gap-3 mb-6 p-4 border border-gray-300 rounded-lg bg-white shadow">
            <input
              type="text"
              placeholder="Enter question statement"
              className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
              value={newQuestion.statement}
              onChange={(e) =>
                setNewQuestion({ ...newQuestion, statement: e.target.value })
              }
            />

            {newQuestion.options.map((opt, i) => (
              <div key={i} className="flex gap-2 items-center">
                <input
                  type="text"
                  placeholder={`Option ${i + 1}`}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  value={opt}
                  onChange={(e) => handleOptionChange(i, e.target.value)}
                />
                {newQuestion.options.length > 1 && (
                  <button
                    type="button"
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    onClick={() => handleRemoveOption(i)}
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}

            <button
              type="button"
              onClick={handleAddOption}
              className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
            >
              + Add Option
            </button>

            <select
              value={newQuestion.correct}
              onChange={(e) =>
                setNewQuestion({ ...newQuestion, correct: e.target.value })
              }
              className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
            >
              <option value="">Select Correct Answer</option>
              {newQuestion.options.map((opt, i) => (
                <option key={i} value={opt}>
                  {opt || `Option ${i + 1}`}
                </option>
              ))}
            </select>

            <button
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              onClick={handleAddQuestion}
            >
              Save Question
            </button>
          </div>
        )}

        {/* Saved Questions */}
        <div className="questions-list">
          <h2 className="text-xl font-semibold mb-3 text-gray-900">
            Saved Questions
          </h2>
          {questions.length === 0 && <p>No questions added yet.</p>}
          {questions.map((q) => (
            <div
              key={q._id || Math.random()}
              className="border border-gray-300 p-4 rounded-lg mb-3 bg-gray-50 shadow"
            >
              <p className="mb-2">
                <span className="font-bold">Q:</span>{" "}
                {q.statement || "No statement"}
              </p>
              <ul className="list-disc list-inside mb-2">
                {(q.options || []).map((opt, i) => (
                  <li key={i}>{opt}</li>
                ))}
              </ul>
              <p className="mb-2">
                <span className="font-bold">Correct Answer:</span>{" "}
                {q.correct || "N/A"}
              </p>
              <button
                className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition"
                onClick={() => handleDelete(q._id)}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Questions;
