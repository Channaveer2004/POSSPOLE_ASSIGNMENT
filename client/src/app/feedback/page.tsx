"use client";

import React from "react";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";

export default function FeedbackPage() {
  const { user, logout } = useAuth();
  const router = useRouter();

  // Redirect to login if not authenticated, but do it in useEffect to avoid setState in render
  React.useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);
  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-md text-center">
        <h1 className="text-2xl font-bold text-gray-800">Hello {user.name} 👋</h1>
        <p className="mt-2 text-gray-600">Submit and manage your course feedback here.</p>
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
