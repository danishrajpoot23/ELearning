import React, { useState } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";

const initialStats = [
  { id: 1, title: "Total Students", value: 12430, change: "+4.5%", color: "green" },
  { id: 2, title: "Active Courses", value: 128, change: "+1.2%", color: "blue" },
  { id: 3, title: "New Enrollments (7d)", value: 342, change: "+6.8%", color: "green" },
];

const chartData = [
  { day: "Mon", signups: 40 },
  { day: "Tue", signups: 80 },
  { day: "Wed", signups: 65 },
  { day: "Thu", signups: 120 },
  { day: "Fri", signups: 90 },
  { day: "Sat", signups: 140 },
  { day: "Sun", signups: 160 },
];

const recentCourses = [
  { id: "C-101", title: "Intro to JavaScript", instructor: "Ali Khan", students: 420 },
  { id: "C-204", title: "React from Scratch", instructor: "Sara Ahmed", students: 980 },
  { id: "C-310", title: "Data Structures", instructor: "Dr. Rahim", students: 310 },
];

const instructors = [
  { name: "Sara Ahmed", courses: 12, rating: 4.9 },
  { name: "Ali Khan", courses: 9, rating: 4.8 },
  { name: "Dr. Rahim", courses: 7, rating: 4.7 },
  { name: "Ayesha Malik", courses: 5, rating: 4.6 },
  { name: "Hassan Raza", courses: 8, rating: 4.5 },
  { name: "Fatima Noor", courses: 6, rating: 4.4 },
  { name: "Bilal Khan", courses: 4, rating: 4.3 },
  { name: "Zara Shah", courses: 3, rating: 4.2 },
];

export default function AdminDashboard({ adminUser }) {
  const [stats] = useState(initialStats);

  return (
    <main
      className="flex-1 p-6 min-h-screen 
                 bg-gradient-to-br from-[#1e293b] via-[#0f172a] to-[#1e40af]" // ✅ Yahan change kiya hai
    >
      {/* Greeting + Quick Stats */}
      <section className="mb-6">
        <h2 className="text-2xl font-bold text-white"> {/* ✅ Text color white kiya */}
          Welcome back, {adminUser?.username || "Admin"}
        </h2>
        <p className="text-slate-300"> {/* ✅ Text color light kiya */}
          Here's what's happening with your platform today.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
          {stats.map((s) => (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: s.id * 0.05 }}
              className="p-4 bg-gray-800 rounded-lg shadow-sm border border-gray-700 text-white" // ✅ Cards ke colors change kiye
            >
              <h3 className="text-sm text-slate-400">{s.title}</h3>
              <div className="mt-2 text-2xl font-semibold">
                {s.value.toLocaleString()}
              </div>
              <div
                className={`text-sm mt-3 ${
                  s.color === "green" ? "text-green-400" : "text-blue-400" // ✅ Text colors adjust kiye
                }`}
              >
                {s.change} since last week
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Chart + Right Column */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart + Courses */}
        <div className="lg:col-span-2">
          <div className="bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-700 text-white"> {/* ✅ Chart background */}
            <h4 className="font-semibold mb-3">Weekly Signups</h4>
            <div style={{ width: "100%", height: 220 }}>
              <ResponsiveContainer>
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorSignups" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366F1" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#6366F1" stopOpacity={0.05} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="day" stroke="#a0aec0" /> {/* ✅ XAxis color adjust kiya */}
                  <YAxis stroke="#a0aec0" /> {/* ✅ YAxis color adjust kiya */}
                  <Tooltip contentStyle={{ backgroundColor: '#334155', borderColor: '#475569', color: 'white' }} /> {/* ✅ Tooltip style adjust kiya */}
                  <Area
                    type="monotone"
                    dataKey="signups"
                    stroke="#6366F1"
                    fill="url(#colorSignups)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recent Courses */}
          <div className="mt-6 bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-700 text-white"> {/* ✅ Recent Courses background */}
            <h5 className="font-semibold mb-3">Recent Courses</h5>
            <ul className="space-y-3">
              {recentCourses.map((c) => (
                <li key={c.id} className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{c.title}</div>
                    <div className="text-xs text-slate-400"> {/* ✅ Text color adjust kiya */}
                      {c.instructor} • {c.students} students
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right Column = Top Instructors */}
        <aside className="bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-700 text-white"> {/* ✅ Top Instructors background */}
          <h4 className="font-semibold mb-3">Top Instructors</h4>
          <table className="w-full text-sm table-fixed">
            <thead className="text-slate-400 text-xs text-left"> {/* ✅ Header text color adjust kiya */}
              <tr>
                <th className="w-1/2">Instructor</th>
                <th className="w-1/4">Courses</th>
                <th className="w-1/4">Rating</th>
              </tr>
            </thead>
            <tbody>
              {instructors.map((i, idx) => (
                <tr key={idx} className="border-t border-gray-700"> {/* ✅ Border color adjust kiya */}
                  <td className="py-3">{i.name}</td>
                  <td>{i.courses}</td>
                  <td>{i.rating}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </aside>
      </div>

      <footer className="mt-8 text-sm text-slate-400"> {/* ✅ Footer text color adjust kiya */}
        © 2025 E_Learning - Your Journey to Mastery Starts Here.
      </footer>
    </main>
  );
}