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
    }
  ];

  // const stats = [
  //   { label: "Total Courses", value: "12", icon: "📚", color: "blue" },
  //   { label: "Feedback Given", value: "8", icon: "💬", color: "green" },
  //   { label: "Profile Complete", value: "100%", icon: "✅", color: "purple" },
  //   { label: "Last Login", value: "Today", icon: "🕒", color: "gray" }
  // ];

  const filteredActions = user?.role === "admin" 
    ? quickActions 
    : quickActions.filter(action => !action.adminOnly);

  return (
    <div className="page">
      <Navbar />
      <div className="container">
        <div className="page-header"><br />
          <h1 className="page-title">Welcome back, {user?.name}! 👋</h1>
          <p className="page-subtitle">
            Here's what's happening with your account today.
          </p>
        </div>

        {/* Stats Grid */}
        {/* <div className="stats-grid">
          {stats.map((stat, index) => (
            <div key={index} className="stat-card">
              <div className="flex items-center justify-between mb-4">
                <div className={`stat-icon stat-icon-${stat.color}`}>
                  {stat.icon}
                </div>
                <div className="text-right">
                  <div className="stat-value">{stat.value}</div>
                  <div className="stat-label">{stat.label}</div>
                </div>
              </div>
            </div>
          ))}
        </div> */}

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

        {/* Recent Activity */}
        {/* <div className="card">
          <div className="card-header">
            <h3 className="text-xl font-semibold text-gray-900">Recent Activity</h3>
            <p className="text-gray-600">Your latest actions</p>
          </div>
          <div className="card-body">
            <div className="space-y-4">
              <div className="activity-item">
                <div className="activity-icon">📚</div>
                <div className="activity-content">
                  <p className="activity-title">Enrolled in new course</p>
                  <p className="activity-time">2 hours ago</p>
                </div>
              </div>
              <div className="activity-item">
                <div className="activity-icon">💬</div>
                <div className="activity-content">
                  <p className="activity-title">Submitted feedback</p>
                  <p className="activity-time">1 day ago</p>
                </div>
              </div>
              <div className="activity-item">
                <div className="activity-icon">👤</div>
                <div className="activity-content">
                  <p className="activity-title">Updated profile</p>
                  <p className="activity-time">3 days ago</p>
                </div>
              </div>
            </div>
          </div>
        </div> */}

        {/* Example Modal */}
        {/* <div className="mt-8">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="btn-primary"
          >
            Open Example Modal
          </button>
          
          <Modal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            title="Example Modal"
            size="medium"
          >
            <div>
              <p className="mb-4">This is an example modal component!</p>
              <p className="mb-6">You can put any content here - forms, text, images, etc.</p>
              <div className="flex gap-3 justify-end">
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="btn-secondary"
                >
                  Close Modal
                </button>
                <button 
                  onClick={() => alert("Action performed!")}
                  className="btn-primary"
                >
                  Perform Action
                </button>
              </div>
            </div>
          </Modal>
        </div> */}
      </div>
    </div>
  );
}
