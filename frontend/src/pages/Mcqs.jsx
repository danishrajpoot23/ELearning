import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";

const Mcqs = () => {
  const { subject } = useParams();
  const [questions, setQuestions] = useState([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState(null);
  const [subjectTitle, setSubjectTitle] = useState("");
  const [showFinalScore, setShowFinalScore] = useState(false);
  const [answeredQuestions, setAnsweredQuestions] = useState([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [currentFeedback, setCurrentFeedback] = useState({});

  // 👇 user ka naam login se nikal lo
  const userData = JSON.parse(localStorage.getItem("user")); 
  const userName = userData ? userData.name : "Guest";

  // ✅ Questions MongoDB se fetch karo
  useEffect(() => {
    const subjectMap = {
      "1": "Mathematics-Basics",
      "2": "English-Grammar",
      "3": "Intermediate-Vocabulary",
      "4": "Science-Explorer",
      "5": "History-Detective",
    };

    const actualSubject = subjectMap[subject] || subject;
    setSubjectTitle(actualSubject);

    const fetchQuestions = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/questions/${actualSubject}`);
        const data = await res.json();

        if (res.ok) {
          setQuestions(data);
        } else {
          Swal.fire("Error", data.error || "Failed to load questions", "error");
        }
      } catch (err) {
        console.error(err);
        Swal.fire("Error", "Network/Server Error", "error");
      }
    };

    fetchQuestions();
  }, [subject]);

  const correctCount = answeredQuestions.filter((q) => q.isCorrect).length;
  const totalQuestions = questions.length;

  // ✅ Next button / Submit test
  const handleNext = async () => {
  if (!selected) {
    Swal.fire("Please select an answer first!");
    return;
  }

  const isCorrect = selected === questions[currentQ].correct;

  const currentAnswer = {
    questionIndex: currentQ,
    selectedAnswer: selected,
    correctAnswer: questions[currentQ].correct,
    isCorrect: isCorrect,
  };

  setAnsweredQuestions((prev) => [...prev, currentAnswer]);

  setCurrentFeedback({
    isCorrect,
    selected,
    correct: questions[currentQ].correct,
  });
  setShowFeedback(true);

  setTimeout(async () => {
    setSelected(null);
    setShowFeedback(false);

    if (currentQ + 1 < questions.length) {
      setCurrentQ((prevCurrentQ) => prevCurrentQ + 1);
    } else {
      const finalCorrect = correctCount + (isCorrect ? 1 : 0);
      setShowFinalScore(true);

      // ✅ FIXED: Properly get student name
      let userName = "Guest User";
      
      try {
        // Method 1: Check localStorage for current user
        const currentUserData = localStorage.getItem("currentUser");
        if (currentUserData) {
          const userObj = JSON.parse(currentUserData);
          userName = userObj.name || userObj.username || "Student";
        }
        
        // Method 2: Check for user data in other localStorage keys
        if (userName === "Guest User") {
          const userData = localStorage.getItem("user");
          if (userData) {
            const userObj = JSON.parse(userData);
            userName = userObj.name || userObj.username || "Student";
          }
        }
        
        // Method 3: Check sessionStorage
        if (userName === "Guest User") {
          const sessionUser = sessionStorage.getItem("currentUser");
          if (sessionUser) {
            const userObj = JSON.parse(sessionUser);
            userName = userObj.name || userObj.username || "Student";
          }
        }
        
      } catch (error) {
        console.error("Error getting user data:", error);
        userName = "Student";
      }

      const newResult = {
        user: userName, // ✅ Proper student name
        test: subjectTitle,
        correct: finalCorrect,
        total: totalQuestions,
        date: new Date().toISOString().split("T")[0],
        time: new Date().toLocaleTimeString(),
      };

      // Debug: Check what we're sending
      console.log("Saving result with user:", userName);
      console.log("Full result data:", newResult);

      try {
        const response = await fetch("http://localhost:5000/api/results", {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newResult),
        });
        
        if (response.ok) {
          console.log("Result saved successfully");
        } else {
          console.error("Failed to save result");
        }
      } catch (err) {
        console.error("Error saving result:", err);
      }

      Swal.fire({
        title: "Test Completed",
        html: `<p>Your score: <b>${finalCorrect}/${totalQuestions}</b></p>`,
        icon: "success",
        confirmButtonText: "OK",
        confirmButtonColor: "#28a745",
      });
    }
  }, 2000);
};
  // ✅ Final Score Screen
  if (showFinalScore) {
    const finalCorrectCount = answeredQuestions.filter((q) => q.isCorrect).length;
    return (
      <div className="min-w-[80vw] min-h-screen mx-auto my-6 p-6 md:p-10 bg-gradient-to-b from-[#43749c] to-white rounded-xl shadow-lg font-sans text-center">
        <h2 className="text-3xl md:text-5xl pt-[100px] font-bold text-white mb-6">Test Completed!</h2>
        <div className="bg-white/80 p-6 rounded-lg shadow-md">
          <h3 className="text-2xl font-semibold mb-2">
            Your Score: {finalCorrectCount}/{totalQuestions}
          </h3>
          <p className="text-lg text-gray-700 mb-4">Total Questions: {totalQuestions}</p>
          <div className="flex justify-center gap-6 text-lg font-medium mb-6">
            <p className="text-green-600">✅ Correct: {finalCorrectCount}</p>
            <p className="text-red-600">❌ Wrong: {totalQuestions - finalCorrectCount}</p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="w-1/2 md:w-1/3 bg-blue-600 hover:bg-blue-800 text-white font-semibold py-3 px-6 rounded-lg transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // ✅ Agar questions hi nahi mile
  if (questions.length === 0)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-center text-lg text-gray-700">
          No questions available for {subjectTitle}.
        </p>
      </div>
    );

  // ✅ Test Screen
  return (
    <div className="min-w-[80vw] min-h-screen mx-auto my-6 p-6 md:p-10 mt-[70px] bg-gradient-to-b from-[#43749c] to-white rounded-xl shadow-lg font-sans">
      <h2 className="text-3xl md:text-5xl font-bold text-white text-center mb-6">{subjectTitle} Test</h2>

      <div className="text-2xl md:text-3xl font-semibold text-gray-800 mb-6 text-center">
        <strong>
          Score: {correctCount}/{totalQuestions}
        </strong>
        <span className="text-lg"> | Question: {currentQ + 1}/{totalQuestions}</span>
      </div>

      <p className="text-xl md:text-2xl font-medium text-gray-700 mb-4">
        <b>Q{currentQ + 1}:</b> {questions[currentQ].statement}
      </p>

      <div className="space-y-4 mb-6">
        {questions[currentQ].options.map((opt, i) => (
          <label
            key={i}
            className={`block bg-gray-50 px-4 py-3 rounded-lg border-2 cursor-pointer text-lg md:text-2xl transition 
              w-full sm:w-2/3 md:w-1/2
              ${
                showFeedback
                  ? opt === currentFeedback.correct
                    ? "border-green-500 bg-green-100"
                    : opt === currentFeedback.selected && !currentFeedback.isCorrect
                    ? "border-red-500 bg-red-100"
                    : "border-transparent"
                  : "border-transparent hover:border-blue-500 hover:bg-blue-50"
              }`}
          >
            <input
              type="radio"
              name="answer"
              value={opt}
              checked={selected === opt}
              onChange={() => setSelected(opt)}
              disabled={showFeedback}
              className="mr-3 transform scale-125"
            />
            {opt}
          </label>
        ))}
      </div>

      {showFeedback && (
        <div
          className={`text-lg md:text-xl font-medium px-4 py-3 rounded-lg mb-6 ${
            currentFeedback.isCorrect
              ? "bg-green-100 text-green-700 border border-green-400"
              : "bg-red-100 text-red-700 border border-red-400"
          }`}
        >
          {currentFeedback.isCorrect ? (
            <span>✅ Correct! Good job!</span>
          ) : (
            <span>❌ Wrong! Correct answer: <b>{currentFeedback.correct}</b></span>
          )}
        </div>
      )}

      <button
        onClick={handleNext}
        disabled={!selected || showFeedback}
        className="w-1/2 md:w-1/3 bg-blue-600 hover:bg-blue-800 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition block mx-auto"
      >
        {currentQ + 1 < questions.length ? "Next Question" : "Submit Test"}
      </button>
    </div>
  );
};

export default Mcqs;
