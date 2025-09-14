import { useEffect, useState } from "react";
import api from "../api/api";
import Navbar from "../components/Navbar";
import Modal from "../components/Modal";

export default function Admin() {
  const [stats, setStats] = useState({});
  const [students, setStudents] = useState([]);
  const [trends, setTrends] = useState([]);
  const [actionModal, setActionModal] = useState({ isOpen: false, action: null, student: null });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [statsRes, studentsRes, trendsRes] = await Promise.all([
        api.get("/admin/stats"),
        api.get("/admin/students"),
        api.get("/admin/feedback-trends")
      ]);
      setStats(statsRes.data);
      setStudents(studentsRes.data);
      setTrends(trendsRes.data);
    } catch (error) {
      console.error("Failed to load admin data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const block = async (id) => {
    try {
      await api.put(`/admin/students/${id}/block`);
      loadData();
    } catch {
      alert("Failed to block student");
    }
  };

  const unblock = async (id) => {
    try {
      await api.put(`/admin/students/${id}/unblock`);
      loadData();
    } catch {
      alert("Failed to unblock student");
    }
  };

  const del = async (id) => {
    try {
      await api.delete(`/admin/students/${id}`);
      loadData();
      setActionModal({ isOpen: false, action: null, student: null });
    } catch {
      alert("Failed to delete student");
    }
  };

  const handleStudentAction = (action, student) => {
    setActionModal({ isOpen: true, action, student });
  };

  const confirmAction = async () => {
    const { action, student } = actionModal;
    if (action === "block") {
      await block(student._id);
    } else if (action === "unblock") {
      await unblock(student._id);
    } else if (action === "delete") {
      await del(student._id);
    }
  };

  const getActionTitle = (action) => {
    switch (action) {
      case "block": return "Block Student";
      case "unblock": return "Unblock Student";
      case "delete": return "Delete Student";
      default: return "Confirm Action";
    }
  };

  const getActionDescription = (action, student) => {
    switch (action) {
      case "block": return `Are you sure you want to block ${student?.name}? They will not be able to access the platform.`;
      case "unblock": return `Are you sure you want to unblock ${student?.name}? They will regain access to the platform.`;
      case "delete": return `Are you sure you want to permanently delete ${student?.name}? This action cannot be undone.`;
      default: return "Please confirm this action.";
    }
  };

  return (
    <div className="page">
      <Navbar />
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">Admin Dashboard</h1>
          <p className="page-subtitle">Manage users, courses, and system settings</p>
        </div>

        {/* Stats Overview */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="flex items-center justify-between mb-4">
              <div className="stat-icon stat-icon-blue">👥</div>
              <div className="text-right">
                <div className="stat-value">{stats.totalStudents || 0}</div>
                <div className="stat-label">Total Students</div>
              </div>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="flex items-center justify-between mb-4">
              <div className="stat-icon stat-icon-green">💬</div>
              <div className="text-right">
                <div className="stat-value">{stats.totalFeedback || 0}</div>
                <div className="stat-label">Total Feedback</div>
              </div>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="flex items-center justify-between mb-4">
              <div className="stat-icon stat-icon-purple">📚</div>
              <div className="text-right">
                <div className="stat-value">{stats.totalCourses || 0}</div>
                <div className="stat-label">Total Coursesss</div>
              </div>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="flex items-center justify-between mb-4">
              <div className="stat-icon stat-icon-gray">⭐</div>
              <div className="text-right">
                <div className="stat-value">{trends.length > 0 ? (trends.reduce((acc, t) => acc + t.avgRating, 0) / trends.length).toFixed(1) : "0.0"}</div>
                <div className="stat-label">Avg Rating</div>
              </div>
            </div>
          </div>
        </div>

        {/* Students Management */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-xl font-semibold text-gray-900">Student Management</h3>
            <p className="text-gray-600">Manage student accounts and permissions</p>
          </div>
          <div className="card-body">
            {isLoading ? (
              <div className="loading">
                <div className="loading-spinner"></div>
                Loading students...
              </div>
            ) : students.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">👥</div>
                <h3 className="empty-state-title">No students found</h3>
                <p className="empty-state-description">
                  No students have registered yet.
                </p>
              </div>
            ) : (
              <div className="table-container">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Student</th>
                      <th>Email</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((student) => (
                      <tr key={student._id}>
                        <td>
                          <div className="student-info">
                            <div className="student-name">{student.name}</div>
                          </div>
                        </td>
                        <td>
                          <div className="student-email">{student.email}</div>
                        </td>
                        <td>
                          <span className={`status-badge ${student.isBlocked ? 'status-blocked' : 'status-active'}`}>
                            {student.isBlocked ? 'Blocked' : 'Active'}
                          </span>
                        </td>
                        <td>
                          <div className="flex gap-2">
                            {student.isBlocked ? (
                              <button
                                onClick={() => handleStudentAction("unblock", student)}
                                className="btn-success btn-sm"
                              >
                                <span>🔓</span>
                                <span>Unblock</span>
                              </button>
                            ) : (
                              <button
                                onClick={() => handleStudentAction("block", student)}
                                className="btn-warning btn-sm"
                              >
                                <span>🔒</span>
                                <span>Block</span>
                              </button>
                            )}
                            <button
                              onClick={() => handleStudentAction("delete", student)}
                              className="btn-danger btn-sm"
                            >
                              <span>🗑️</span>
                              <span>Delete</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Feedback Trends */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-xl font-semibold text-gray-900">Feedback Trends</h3>
            <p className="text-gray-600">Course ratings and feedback statistics</p>
          </div>
          <div className="card-body">
            {trends.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">📊</div>
                <h3 className="empty-state-title">No feedback data</h3>
                <p className="empty-state-description">
                  No feedback has been submitted yet.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {trends.map((trend, index) => (
                  <div key={index} className="trend-card">
                    <div className="trend-course">{trend.course}</div>
                    <div className="trend-rating">
                      <span className="rating-value">{trend.avgRating.toFixed(1)}</span>
                      <span className="rating-stars">⭐</span>
                    </div>
                    <div className="trend-count">{trend.count} reviews</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Action Confirmation Modal */}
        <Modal
          isOpen={actionModal.isOpen}
          onClose={() => setActionModal({ isOpen: false, action: null, student: null })}
          title={getActionTitle(actionModal.action)}
          size="small"
        >
          <div>
            <div className="mb-6">
              <p className="text-gray-700 mb-4">{getActionDescription(actionModal.action, actionModal.student)}</p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="font-semibold text-gray-900">{actionModal.student?.name}</p>
                <p className="text-sm text-gray-600">{actionModal.student?.email}</p>
              </div>
            </div>
            {actionModal.action === "delete" && (
              <p className="text-error-600 text-sm mb-6">
                ⚠️ This action cannot be undone.
              </p>
            )}
            <div className="flex gap-3 justify-end">
              <button 
                onClick={() => setActionModal({ isOpen: false, action: null, student: null })}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button 
                onClick={confirmAction}
                className={actionModal.action === "delete" ? "btn-danger" : actionModal.action === "block" ? "btn-warning" : "btn-success"}
              >
                {actionModal.action === "block" ? "Block Student" : 
                 actionModal.action === "unblock" ? "Unblock Student" : 
                 "Delete Student"}
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
}
