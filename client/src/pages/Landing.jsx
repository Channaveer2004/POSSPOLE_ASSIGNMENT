import React from "react";
import { Link } from "react-router-dom";
import "./Landing.css";

export default function Landing() {
  return (
    <div className="landing-container">
      <nav className="landing-nav">
        <div className="logo">Feed⭐Forward</div>
        <div className="nav-links">
          <Link to="/login">Login</Link>
          <Link to="/signup">Sign Up</Link>
        </div>
      </nav>
      <main className="landing-main">
        <h1>Welcome to Feed⭐Forward</h1>
        <p>
          Your #1-stop solution for course management.<br />
          Empowering student feedback and analytics.
        </p>

        <div className="cta-buttons">
          <Link to="/signup" className="cta-primary">Get Started</Link>
          <Link to="/login" className="cta-secondary">Already have an account ?</Link>
        </div>
      </main>

    </div>
  );
}
