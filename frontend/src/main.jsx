
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom"; // 👈 yeh import add karo
import App from "./App";
import './i18n';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { Toaster } from 'react-hot-toast';
import "./styles/index.css";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

// optional dev-time warning if key missing
if (!import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY) {
  console.warn("VITE_STRIPE_PUBLISHABLE_KEY is not set. Stripe will not work until you add it to .env");
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {/* Elements MUST wrap any component that uses useStripe() or CardElement */}
    <Elements stripe={stripePromise}>
    <BrowserRouter>  {/* 👈 App ko Router ke andar wrap karo */}
      <App />
    </BrowserRouter>

     {/* Toaster placed here so any component can call toast() */}
    <Toaster position="top-right" />
    </Elements>
  </React.StrictMode>
);