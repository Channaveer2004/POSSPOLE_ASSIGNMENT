// components/AuthModal.jsx
import React, { useState } from "react";

const AuthModal = ({ onClose, onLoginSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ email: "", password: "", name: "" });
  const [error, setError] = useState("");

  const toggleForm = () => setIsLogin(!isLogin);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const url = isLogin
        ? "http://localhost:4000/api/auth/login"
        : "http://localhost:4000/api/auth/signup";

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
        credentials: "include", // for cookies
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Something went wrong");

      onLoginSuccess(data); // call parent to update state / redirect
      onClose();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded shadow w-96">
        <h2 className="text-xl mb-4">{isLogin ? "Login" : "Sign Up"}</h2>
        {error && <p className="text-red-500">{error}</p>}
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          {!isLogin && (
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          )}
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <button type="submit" className="bg-blue-500 text-white py-2 rounded">
            {isLogin ? "Login" : "Sign Up"}
          </button>
        </form>
        <p className="mt-2 text-sm">
          {isLogin ? "No account?" : "Already have an account?"}{" "}
          <span className="text-blue-500 cursor-pointer" onClick={toggleForm}>
            {isLogin ? "Sign Up" : "Login"}
          </span>
        </p>
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-500">
          ✖
        </button>
      </div>
    </div>
  );
};

export default AuthModal;
