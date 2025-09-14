import { Link, useLocation } from "react-router-dom";
import useAuthStore from "../store/authStore";

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const navItems = [
    { path: "/dashboard", label: "Dashboard", icon: "📊" },
    { path: "/profile", label: "Profile", icon: "👤" },
    // { path: "/feedback", label: "Feedback", icon: "💬" },
  ];

  const adminItems = [
    { path: "/courses", label: "Courses", icon: "📚" },
    { path: "/admin", label: "Admin", icon: "⚙️" },
    // { path: "/admin-feedbacks", label: "Feedbacks", icon: "📝" },
  ];

  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar-content">
          <div className="navbar-brand">
            <Link to="/dashboard" className="brand-link">
              <span className="brand-icon">🎓</span>
              <span className="brand-text">EduPlatform</span>
            </Link>
          </div>

          <div className="navbar-menu">
            <div className="navbar-nav">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`nav-link ${isActive(item.path) ? 'active' : ''}`}
                >
                  <span className="nav-icon">{item.icon}</span>
                  <span className="nav-text">{item.label}</span>
                </Link>
              ))}
              
              {user?.role === "admin" && adminItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`nav-link ${isActive(item.path) ? 'active' : ''}`}
                >
                  <span className="nav-icon">{item.icon}</span>
                  <span className="nav-text">{item.label}</span>
                </Link>
              ))}
            </div>

            <div className="navbar-user">
              <div className="user-info">
                <span className="user-name">{user?.name}</span>
                <span className="user-role">{user?.role}</span>
              </div>
              <button onClick={logout} className="btn-secondary btn-sm">
                <span>🚪</span>
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
