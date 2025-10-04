# 🎓 ELearning Platform

A full-stack **E-Learning web application** built with **React (Vite)** for the frontend and **Node.js + Express + MongoDB** for the backend.  
This platform is designed to provide students with easy access to interactive learning content, online tests, and subscription-based premium features.

---

## 🚀 Features

- 🔐 Secure authentication (JWT-based login/signup)
- 💳 Stripe-powered payment system
- 📚 Dynamic course and test management
- 📊 Subscription system (Free / Premium)
- 🧠 Quiz & test modules with instant results
- 📨 Email notifications for transactions
- ⚙️ Admin panel for managing content and users
- 💾 Data persistence with MongoDB
- 🎨 Fully responsive modern UI (React + CSS)

---

## 🛠️ Tech Stack

**Frontend:**
- React (Vite)
- React Router DOM
- Axios
- Stripe.js
- Plain CSS

**Backend:**
- Node.js
- Express.js
- MongoDB with Mongoose
- Stripe API
- Nodemailer
- dotenv

**Other Tools:**
- Git & GitHub
- Postman (for API testing)
- VS Code

---

## 📂 Folder Structure

ELearning/
├── backend/
│ ├── controllers/
│ ├── models/
│ ├── routes/
│ ├── config/
│ ├── emails/
│ ├── services/
│ ├── validators/
│ └── server.js
├── frontend/
│ ├── src/
│ │ ├── components/
│ │ ├── pages/
│ │ ├── assets/
│ │ ├── styles/
│ │ └── main.jsx
│ ├── public/
│ └── vite.config.js
├── .gitignore
└── README.md

---

## ⚙️ Installation & Setup Guide

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/danishrajpoot23/ELearning.git
cd ELearning



## 2-Backend-Setup
cd backend
npm install

## .env in backend
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
STRIPE_SECRET_KEY=your_stripe_secret
EMAIL_USER=your_email_address
EMAIL_PASS=your_email_password

## Strat the Server
npm run dev

## 3-Frontend-Setup
cd ../frontend
npm install
npm run dev

## Visit the frontend at:
👉 http://localhost:5173





 🧑‍💻 Author

👨‍💻 Danish Rajpoot
Student | Full Stack Web Developer

🌐 GitHub Profile

📧 Email: danishrajpoot23@gmail.com




💡 Future Enhancements

🧾 Add progress tracking for students

📱 Launch mobile-responsive layout improvements

💬 Add discussion forums and Q&A

🎥 Integrate video lessons

📈 Admin dashboard with analytics




⭐ Contribute

Want to improve this project?
Fork the repo → Create a new branch → Make changes → Submit a PR ✅


📝 License

This project is open-source and available under the MIT License.
