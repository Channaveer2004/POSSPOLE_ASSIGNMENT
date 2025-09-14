// import { useState } from "react";
import Navbar from "../components/Navbar";
import Modal from "../components/Modal";
import useAuthStore from "../store/authStore";

export default function Dashboard() {
  const { user } = useAuthStore();
  // const [isModalOpen, setIsModalOpen] = useState(false);

  const quickActions = [
    {
      title: "View Courses",
      description: "Browse available courses",
      icon: "📚",
      action: () => window.location.href = "/courses",
      color: "blue"
    },
    // Only show Give Feedback if not admin
    ...((!user || user.role !== "admin") ? [{
      title: "Give Feedback",
      description: "Share your feedback",
      icon: "💬",
      action: () => window.location.href = "/feedback",
      color: "green"
    }] : []),
    {
      title: "Update Profile",
      description: "Manage your profile",
      icon: "👤",
      action: () => window.location.href = "/profile",
      color: "purple"
    },
    {
      title: "Admin Panel",
      description: "Manage system settings",
      icon: "⚙️",
      action: () => window.location.href = "/admin",
      color: "orange",
      adminOnly: true
    },
     // Only show View Feedbacks if admin
    ...((user && user.role === "admin") ? [{
      title: "View Feedbacks",
      description: "See all feedbacks and filter",
      icon: "📝",
      action: () => window.location.href = "/admin-feedbacks",
      color: "teal",
      adminOnly: true
    }] : [])
    
  ];

 

  const filteredActions = user?.role === "admin" 
    ? quickActions 
    : quickActions.filter(action => !action.adminOnly);

  return (
    <div className="page">
      <Navbar />
      <div className="container">
        <div className="page-header"><br />
          <h1 className="page-title">Welcome , {user?.name}! 👋</h1>
          <p className="page-subtitle">
            Here's what's happening with your account today.
          </p>
        </div>

        

        {/* Quick Actions */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-xl font-semibold text-gray-900">Quick Actions</h3>
            <p className="text-gray-600">Get things done quickly</p>
          </div>
          <div className="card-body">
            <div className="grid grid-cols-2 gap-4">
              {filteredActions.map((action, index) => (
                <button
                  key={index}
                  onClick={action.action}
                  className={`action-card action-card-${action.color}`}
                >
                  <div className="action-icon">{action.icon}</div>
                  <div className="action-content">
                    <h4 className="action-title">{action.title}</h4>
                    <p className="action-description">{action.description}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        
      </div>
    </div>
  );
}
