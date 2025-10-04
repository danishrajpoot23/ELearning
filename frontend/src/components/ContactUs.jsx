import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { sendContact } from "../services/contactService";

export default function ContactUs() {
  const [formData, setFormData] = useState({
    role: "",
    info: "",
    name: "",
    email: "",
    title: "",
    message: "",
    captcha: "",
  });

  const [num1, setNum1] = useState(0);
  const [num2, setNum2] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    generateCaptcha();
  }, []);

  const generateCaptcha = () => {
    setNum1(Math.floor(Math.random() * 10));
    setNum2(Math.floor(Math.random() * 10));
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const correctAnswer = num1 + num2;
    if (parseInt(formData.captcha) !== correctAnswer) {
      Swal.fire({
        icon: "error",
        title: "Incorrect Captcha",
        text: "Please try the math problem again.",
      });
      generateCaptcha();
      setFormData({ ...formData, captcha: "" });
      return;
    }

    try {
      setLoading(true);
      const data = await sendContact(formData);

      Swal.fire({
        icon: "success",
        title: "Message Sent!",
        text: data.message || "Thank you for contacting us. We will respond soon.",
        confirmButtonText: "OK",
      }).then(() => {
        setFormData({
          role: "",
          info: "",
          name: "",
          email: "",
          title: "",
          message: "",
          captcha: "",
        });
        generateCaptcha();
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      Swal.fire({
        icon: "error",
        title: "Submission Failed",
        text: error.message || "Could not connect to the server. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const inputClasses =
    "w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 transform focus:scale-101 shadow-sm";
  const labelClasses = "block text-sm font-semibold text-gray-700 mb-2";
  const buttonClasses =
    "w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 text-lg font-bold rounded-lg cursor-pointer transition-transform duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-md disabled:opacity-50 disabled:cursor-not-allowed";

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-8">
      <div className="w-full max-w-xl mx-auto my-8 p-6 sm:p-10 bg-white rounded-xl shadow-2xl font-sans border border-gray-200">
        <div className="text-center mb-8">
          <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-2">
            Contact Us
          </h2>
          <p className="text-base sm:text-lg text-gray-600">
            Send us a message and we'll get back to you soon.
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Grid for Name and Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className={labelClasses}>Name</label>
              <input
                id="name"
                type="text"
                name="name"
                placeholder="Your full name"
                value={formData.name}
                onChange={handleChange}
                required
                className={inputClasses}
              />
            </div>
            <div>
              <label htmlFor="email" className={labelClasses}>Email</label>
              <input
                id="email"
                type="email"
                name="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                required
                className={inputClasses}
              />
            </div>
          </div>

          {/* Grid for Role and Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label htmlFor="role" className={labelClasses}>You are a</label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                required
                className={`${inputClasses} appearance-none`}
              >
                <option value="" disabled>-- Please select --</option>
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label htmlFor="info" className={labelClasses}>Tell us more</label>
              <input
                id="info"
                type="text"
                name="info"
                placeholder="e.g., School/City"
                value={formData.info}
                onChange={handleChange}
                required
                className={inputClasses}
              />
            </div>
          </div>

          <div>
            <label htmlFor="title" className={labelClasses}>Title</label>
            <input
              id="title"
              type="text"
              name="title"
              placeholder="Subject of your message"
              value={formData.title}
              onChange={handleChange}
              required
              className={inputClasses}
            />
          </div>

          <div>
            <label htmlFor="message" className={labelClasses}>Message</label>
            <textarea
              id="message"
              name="message"
              placeholder="Write your message here..."
              value={formData.message}
              onChange={handleChange}
              maxLength={500}
              required
              className={`${inputClasses} min-h-[140px] resize-y`}
            />
            <p className="text-right text-xs text-gray-500 mt-1">
              {500 - formData.message.length} characters remaining
            </p>
          </div>

          <div>
            <label htmlFor="captcha" className={labelClasses}>Security Check</label>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <span className="text-xl sm:text-2xl font-bold text-blue-600 bg-gray-50 p-3 sm:p-4 rounded-lg border-2 border-gray-300 w-full sm:w-28 text-center shadow-inner">
                {num1} + {num2}
              </span>
              <input
                id="captcha"
                type="number"
                name="captcha"
                value={formData.captcha}
                onChange={handleChange}
                required
                className={`${inputClasses} w-40 text-lg`}
              />
            </div>
            <small className="text-sm text-gray-500 mt-2 block">
              Solve this simple math problem to submit.
            </small>
          </div>

          <button type="submit" disabled={loading} className={buttonClasses}>
            {loading ? "Sending..." : "Send Message"}
          </button>
        </form>
      </div>
    </div>
  );
}







