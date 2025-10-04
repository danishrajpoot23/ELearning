
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
    theme: "writing"
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
    theme: "speaking"
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

export const getCards = async () => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockCards), 500); 
  });
};

export const getCardById = async (id) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const card = mockCards.find((c) => c.id === parseInt(id));
      resolve(card);
    }, 500);
  });
};

