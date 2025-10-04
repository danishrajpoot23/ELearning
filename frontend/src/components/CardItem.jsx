import { useEffect, useState } from "react";

// Icons ke liye react-icons use karna better hoga
import { FaCalendarAlt, FaClock, FaUsers, FaGlobe, FaDollarSign } from "react-icons/fa";

// Mock Data
const mockCards = [
  {
    id: 1,
    category: "Writing",
    title: "Master IELTS Writing Task 2",
    teacher: "John Smith",
    date: "2025-09-10",
    time: "6:00 PM",
    attending: 120,
    lang: "English",
    price: "$10",
    img: "https://randomuser.me/api/portraits/men/11.jpg",
    theme: "writing",
  },
  {
    id: 2,
    category: "Speaking",
    title: "Fluency Boost Speaking Practice",
    teacher: "Emma Johnson",
    date: "2025-09-12",
    time: "8:00 PM",
    attending: 80,
    lang: "English",
    price: "$12",
    img: "https://randomuser.me/api/portraits/women/44.jpg",
    theme: "speaking",
  },
  {
    id: 3,
    category: "Listening",
    title: "IELTS Listening Practice Session",
    teacher: "Michael Lee",
    date: "2025-09-08",
    time: "5:00 PM",
    attending: 95,
    lang: "English",
    price: "$12",
    img: "https://randomuser.me/api/portraits/men/76.jpg",
    theme: "listening",
  },
];

// Get all cards
export const getCards = async () => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockCards), 500);
  });
};

function CardItem() {
  const [cards, setCards] = useState([]);

  useEffect(() => {
    getCards().then((data) => {
      setCards(data);
    });
  }, []);

  // theme colors
  const themeClasses = {
    writing: "bg-orange-500",
    speaking: "bg-green-600",
    listening: "bg-green-600",
  };

  return (
    <div className="bg-[#f4f7fa] px-4 py-12 md:px-6 lg:px-12">
      <h2 className="text-center text-2xl md:text-3xl font-bold text-gray-800 mb-10">
        Join our live lessons for advice from the experts
      </h2>

      {cards.length === 0 ? (
        <p className="text-center text-lg text-gray-600">Loading cards...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {cards.map((card) => (
            <div
              key={card.id}
              className="bg-white rounded-xl shadow-md border border-gray-200 flex flex-col overflow-hidden"
            >
              {/* Card Header */}
              <div
                className={`px-5 py-3 text-white font-semibold ${
                  themeClasses[card.theme]
                }`}
              >
                <span className="text-sm">{card.category}</span>
              </div>

              {/* Card Body */}
              <div className="p-6 flex flex-col items-center flex-grow">
                <h5 className="text-lg md:text-xl font-bold text-gray-900 mb-4 text-center">
                  {card.title}
                </h5>

                {/* Teacher */}
                <div className="flex items-center mb-5">
                  <img
                    src={card.img}
                    alt={card.teacher}
                    className="w-12 h-12 rounded-full object-cover mr-3 border-2 border-gray-200"
                  />
                  <span className="text-base font-medium text-gray-700">
                    {card.teacher}
                  </span>
                </div>

                {/* Details */}
                <div className="mb-6 text-sm text-gray-600 space-y-3 w-max text-left">
                  <div className="flex items-center">
                    <FaCalendarAlt className="mr-3 text-lg" />
                    <span>{card.date}</span>
                  </div>
                  <div className="flex items-center">
                    <FaClock className="mr-3 text-lg" />
                    <span>{card.time}</span>
                  </div>
                  <div className="flex items-center">
                    <FaUsers className="mr-3 text-lg" />
                    <span>{card.attending} Attending</span>
                  </div>
                  <div className="flex items-center">
                    <FaGlobe className="mr-3 text-lg" />
                    <span>{card.lang}</span>
                  </div>
                  <div className="flex items-center">
                    <FaDollarSign className="mr-3 text-lg" />
                    <span>{card.price}</span>
                  </div>
                </div>

                {/* Button */}
                <a
                  href={`/card/${card.id}`}
                  className={`block text-center px-5 py-3 rounded-lg text-white font-semibold mt-auto transition-opacity duration-200 ${themeClasses[card.theme]} hover:opacity-90`}
                >
                  View Details
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default CardItem;
