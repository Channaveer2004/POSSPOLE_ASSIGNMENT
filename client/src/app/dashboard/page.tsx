
"use client";

import React from "react";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const router = useRouter();

  // Redirect logic moved to useEffect to avoid setState in render
  React.useEffect(() => {
    if (!user) {
      router.push("/login");
    } else if (user.role !== "admin") {
      router.push("/feedback");
    }
  }, [user, router]);
  if (!user || user.role !== "admin") {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-lg text-center">
        <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard 🛠️</h1>
        <p className="mt-2 text-gray-600">Manage students, courses, and feedback trends.</p>
        <button
          onClick={logout}
          className="mt-6 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
