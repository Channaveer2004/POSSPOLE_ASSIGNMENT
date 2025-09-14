import { useEffect, useState } from "react";
import api from "../api/api";
import Navbar from "../components/Navbar";
import Modal from "../components/Modal";
import useAuthStore from "../store/authStore";

export default function Courses() {
  const { user } = useAuthStore();
  const [courses, setCourses] = useState([]);
  const [form, setForm] = useState({ code: "", name: "", description: "" });
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, course: null });
  const [addModal, setAddModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const load = async () => {
    try {
      setIsLoading(true);
      const res = await api.get("/courses");
      setCourses(res.data);
    } catch (error) {
      console.error("Failed to load courses:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const addCourse = async () => {
    try {
      await api.post("/courses", form);
      load();
      setAddModal(false);
      setForm({ code: "", name: "", description: "" });
    } catch (error) {
      alert(error.response?.data?.message || "Failed to add course");
    }
  };

  const deleteCourse = async (id) => {
    try {
      await api.delete(`/courses/${id}`);
      load();
      setDeleteModal({ isOpen: false, course: null });
    } catch (error) {
      alert(error.response?.data?.message || "Failed to delete course");
    }
  };

  const handleDeleteClick = (course) => {
    setDeleteModal({ isOpen: true, course });
  };

  // Check if user is admin
  const isAdmin = user?.role === "admin";

  return (
    <div className="page">
      <Navbar />
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">
            {isAdmin ? "Course Management" : "Available Courses"}
          </h1>
          <p className="page-subtitle">
            {isAdmin ? "Manage and organize your courses" : "Browse and explore available courses"}
          </p>
        </div>

        <div className="card">
          <div className="card-header">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">
                  {isAdmin ? "All Courses" : "Course Catalog"}
                </h3>
                <p className="text-gray-600">
                  {isAdmin ? "View and manage all available courses" : "Discover courses you can enroll in"}
                </p>
              </div>
              {isAdmin && (
                <button 
                  onClick={() => setAddModal(true)}
                  className="btn-primary"
                >
                  <span>➕</span>
                  <span>Add New Course</span>
                </button>
              )}
            </div>
          </div>

          <div className="card-body">
            {isLoading ? (
              <div className="loading">
                <div className="loading-spinner"></div>
                Loading courses...
              </div>
            ) : courses.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">📚</div>
                <h3 className="empty-state-title">No courses available</h3>
                <p className="empty-state-description">
                  {isAdmin 
                    ? "Get started by adding your first course to the system."
                    : "No courses are currently available. Check back later for new courses."
                  }
                </p>
                {isAdmin && (
                  <button 
                    onClick={() => setAddModal(true)}
                    className="btn-primary"
                  >
                    Add First Course
                  </button>
                )}
              </div>
            ) : (
              <div className="table-container">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Course Code</th>
                      <th>Course Name</th>
                      <th>Description</th>
                      {isAdmin && <th>Actions</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {courses.map((course) => (
                      <tr key={course._id}>
                        <td>
                          <span className="course-code">{course.code}</span>
                        </td>
                        <td>
                          <div className="course-name">{course.name}</div>
                        </td>
                        <td>
                          <div className="course-description">
                            {course.description || "No description provided"}
                          </div>
                        </td>
                        {isAdmin && (
                          <td>
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleDeleteClick(course)}
                                className="btn-danger btn-sm"
                              >
                                <span>🗑️</span>
                                <span>Delete</span>
                              </button>
                            </div>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Admin-only Modals */}
        {isAdmin && (
          <>
            {/* Delete Confirmation Modal */}
            <Modal
              isOpen={deleteModal.isOpen}
              onClose={() => setDeleteModal({ isOpen: false, course: null })}
              title="Confirm Delete"
              size="small"
            >
              <div>
                <div className="mb-6">
                  <p className="text-gray-700 mb-2">Are you sure you want to delete this course?</p>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="font-semibold text-gray-900">{deleteModal.course?.name}</p>
                    <p className="text-sm text-gray-600">({deleteModal.course?.code})</p>
                  </div>
                </div>
                <p className="text-error-600 text-sm mb-6">
                  ⚠️ This action cannot be undone.
                </p>
                <div className="flex gap-3 justify-end">
                  <button 
                    onClick={() => setDeleteModal({ isOpen: false, course: null })}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={() => deleteCourse(deleteModal.course?._id)}
                    className="btn-danger"
                  >
                    Delete Course
                  </button>
                </div>
              </div>
            </Modal>

            {/* Add Course Modal */}
            <Modal
              isOpen={addModal}
              onClose={() => {
                setAddModal(false);
                setForm({ code: "", name: "", description: "" });
              }}
              title="Add New Course"
              size="medium"
            >
              <div>
                <div className="form-group">
                  <label htmlFor="course-code">Course Code</label>
                  <input
                    id="course-code"
                    placeholder="e.g., CS101"
                    value={form.code}
                    onChange={(e) => setForm({ ...form, code: e.target.value })}
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="course-name">Course Name</label>
                  <input
                    id="course-name"
                    placeholder="e.g., Introduction to Computer Science"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="course-description">Description</label>
                  <textarea
                    id="course-description"
                    placeholder="Course description..."
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    rows="4"
                    style={{ resize: "vertical" }}
                  />
                </div>
                
                <div className="flex gap-3 justify-end">
                  <button 
                    onClick={() => {
                      setAddModal(false);
                      setForm({ code: "", name: "", description: "" });
                    }}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={addCourse}
                    disabled={!form.code || !form.name}
                    className="btn-success"
                  >
                    Add Course
                  </button>
                </div>
              </div>
            </Modal>
          </>
        )}
      </div>
    </div>
  );
}