import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getCardById } from "../services/cardService";
import { motion } from "framer-motion";

const CardDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [card, setCard] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    setError(null);

    getCardById(id)
      .then((data) => {
        if (!isMounted) return;
        if (!data) {
          setError("Lesson not found");
        }
        setCard(data || null);
      })
      .catch(() => {
        if (!isMounted) return;
        setError("Failed to load lesson");
      });

    return () => {
      isMounted = false;
    };
  }, [id]);

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100 p-5 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full"
        >
          <div className="text-8xl mb-5 text-red-500">😞</div>
          <h3 className="text-red-600 mb-5 text-2xl font-semibold">{error}</h3>
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center rounded-full bg-blue-600 px-6 py-3 font-medium text-white shadow-md transition-all duration-300 hover:scale-105 hover:bg-blue-700"
          >
            ← Back
          </button>
        </motion.div>
      </div>
    );
  }

  // 🔹 Loader hatane ke baad agar card null hoga to kuch bhi render nahi hoga
  if (!card) return null;

  const { headerBg, categoryBg, categoryText } = themeToColors(card.theme);

  return (
    <div className="flex min-h-screen flex-col bg-gray-100 font-sans antialiased">
      {/* Header */}
      <header
        className="relative flex h-16 shrink-0 items-center px-4 md:px-8 text-white shadow-lg z-10"
        style={{ backgroundColor: headerBg }}
      >
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-sm md:text-base font-extrabold transition hover:text-opacity-80"
        >
          <span className="mr-1 text-xl font-bold">←</span> Back
        </button>

        {/* Title */}
        <h1 className="absolute left-1/2 -translate-x-1/2 text-lg md:text-2xl font-extrabold truncate max-w-[50%] text-center">
          {card.title}
        </h1>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col items-center p-4 sm:p-6 md:p-8 overflow-y-auto">
        <motion.div
          className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl flex flex-col h-full overflow-hidden"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          {/* Teacher Info Section */}
          <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-4 p-6 bg-gradient-to-r from-gray-50 to-white border-b border-gray-100 shadow-sm shrink-0">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="h-20 w-20 sm:h-24 sm:w-24 rounded-full overflow-hidden border-4 border-white shadow-lg flex-shrink-0"
            >
              <img
                src={card.img}
                alt={card.teacher}
                className="h-full w-full object-cover object-center"
              />
            </motion.div>
            <div className="text-center sm:text-left">
              <h4 className="text-xl sm:text-2xl font-bold text-gray-900 leading-tight">
                {card.teacher}
              </h4>
              <p className="text-sm text-gray-600 mt-0.5">Expert IELTS Instructor</p>
              <span
                className={`mt-2 inline-block rounded-full px-4 py-1 text-xs font-semibold ${categoryText}`}
                style={{ backgroundColor: categoryBg }}
              >
                {card.category}
              </span>
            </div>
          </div>

          {/* Details Grid Section */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 p-6 flex-1 overflow-y-auto custom-scrollbar">
            <DetailCard icon="📅" label="Date" value={card.date} />
            <DetailCard icon="⏰" label="Time" value={card.time} />
            <DetailCard
              icon="👥"
              label="Attending"
              value={`${card.attending}+ Students`}
            />
            <DetailCard icon="🌐" label="Language" value={card.lang} />
          </div>

          {/* Price Section */}
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 py-6 text-center shadow-inner shrink-0 rounded-b-3xl">
            <p className="text-sm md:text-base text-blue-800 font-medium">Lesson Price</p>
            <motion.div
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5, ease: "easeOut" }}
              className="text-4xl md:text-5xl font-extrabold text-green-700 mt-2"
            >
              {card.price}
            </motion.div>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

// Reusable Detail Card Component
const DetailCard = ({ icon, label, value }) => (
  <motion.div
    whileHover={{
      scale: 1.03,
      boxShadow:
        "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
    }}
    transition={{ duration: 0.2 }}
    className="flex flex-col items-center justify-center rounded-2xl bg-white p-5 shadow-lg border border-gray-100"
  >
    <div className="text-3xl mb-2">{icon}</div>
    <h6 className="text-xs font-semibold uppercase text-gray-500 tracking-wide">
      {label}
    </h6>
    <p className="text-base font-bold text-gray-800 text-center mt-1">{value}</p>
  </motion.div>
);

// Helper function for theme-based colors
const themeToColors = (theme) => {
  switch (theme) {
    case "writing":
      return {
        headerBg: "#f97316", // Orange-500
        categoryBg: "#fff7ed", // Orange-50
        categoryText: "text-orange-700",
      };
    case "speaking":
      return {
        headerBg: "#22c55e", // Green-500
        categoryBg: "#ecfdf5", // Green-50
        categoryText: "text-green-700",
      };
    case "listening":
      return {
        headerBg: "#0ea5e9", // Sky-500
        categoryBg: "#eff6ff", // Blue-50
        categoryText: "text-blue-700",
      };
    default:
      return {
        headerBg: "#6b7280", // Gray-500
        categoryBg: "#f9fafb", // Gray-50
        categoryText: "text-gray-700",
      };
  }
};

export default CardDetail;