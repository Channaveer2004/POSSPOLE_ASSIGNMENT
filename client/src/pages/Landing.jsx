import React from "react";
import { Link } from "react-router-dom";
import "./Landing.css";

export default function Landing() {
  return (
    <div className="landing-container">
      <nav className="landing-nav">
        <div className="logo">POSSPole</div>
        <div className="nav-links">
          <Link to="/login">Login</Link>
          <Link to="/signup">Sign Up</Link>
        </div>
      </nav>
      <main className="landing-main">
        <h1>Welcome to POSSPole</h1>
        <p>Your platform for managing courses, feedback, and more.</p>
        <div className="cta-buttons">
          <Link to="/signup" className="cta-primary">Get Started</Link>
          <Link to="/login" className="cta-secondary">Already have an account?</Link>
        </div>
      </main>
      <footer className="landing-footer">
        <span>© {new Date().getFullYear()} POSSPole. All rights reserved.</span>
      </footer>
    </div>
  );
}
