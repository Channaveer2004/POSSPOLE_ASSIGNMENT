import { useEffect, useState } from "react";
import api from "../api/api";

import Navbar from "../components/Navbar";
import Modal from "../components/Modal";
import useAuthStore from "../store/authStore";

export default function Feedback() {
  const [courses, setCourses] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [form, setForm] = useState({ courseId: "", rating: 5, message: "" });
  const [detailModal, setDetailModal] = useState({ isOpen: false, feedback: null });
  const user = useAuthStore((state) => state.user);

  // Load courses and student feedbacks
  const loadData = async () => {
    const [c, f] = await Promise.all([
      api.get("/courses"),
      api.get("/feedback/mine"),
    ]);
    setCourses(c.data);
    setFeedbacks(f.data);
  };

  useEffect(() => {
    loadData();
  }, []);

  // Submit feedback
  const submitFeedback = async () => {
    if (!form.courseId) {
      alert("Please select a course");
      return;
    }
    await api.post("/feedback", form);
    setForm({ courseId: "", rating: 5, message: "" });
    loadData();
  };


  return (
    <div>
      <Navbar />
      {/* Only render feedback form if not admin, else show message */}
      {user?.role === "admin" ? (
        <div style={{ margin: "2rem 0", color: "#b91c1c", fontWeight: 600, fontSize: "1.1rem" }}>
          Feedbacks cannot be provided by admin
        </div>
      ) : (
        <>

          <h3 style={{ marginTop: "2rem" }}>My Feedbacks</h3>
          {feedbacks.length === 0 && <p>No feedbacks submitted yet.</p>}
          <h2>Submit Feedback</h2>
          {/* Course dropdown */}
          <select
            value={form.courseId}
            onChange={(e) => setForm({ ...form, courseId: e.target.value })}
            style={{ padding: "0.5rem", borderRadius: "4px", border: "1px solid #ccc", marginBottom: "1rem" }}
          >
            <option value="">Select Course</option>
            {courses.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>

          {/* Rating input */}
          <input
            type="number"
            min="1"
            max="5"
            value={form.rating}
            onChange={(e) => setForm({ ...form, rating: e.target.value })}
            style={{ marginLeft: "1rem", width: "60px" }}
          />

          {/* Message textarea */}
          <textarea
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            placeholder="Write your feedback..."
            style={{ display: "block", width: "100%", marginTop: "1rem", padding: "0.5rem", borderRadius: "4px", border: "1px solid #ccc", minHeight: "80px" }}
          />

          <button
            onClick={submitFeedback}
            style={{ marginTop: "0.5rem", padding: "0.5rem 1rem", backgroundColor: "#16a34a", color: "#fff", borderRadius: "4px", border: "none" }}
          >
            Submit
          </button>
        </>
      )}



      {feedbacks.map((f) => (
        <div
          key={f._id}
          style={{
            marginBottom: "1rem",
            padding: "1rem",
            border: "1px solid #ccc",
            borderRadius: "4px",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <p>
                <strong>{f.course.name}</strong> - {f.rating}/5 ⭐
              </p>
              <p style={{ color: "#666", fontSize: "0.9rem" }}>
                {f.message.length > 100 ? `${f.message.substring(0, 100)}...` : f.message}
              </p>
            </div>
            <button onClick={() => setDetailModal({ isOpen: true, feedback: f })}>
              View Details
            </button>
          </div>
        </div>
      ))}

      {/* Feedback Detail Modal */}
      <Modal
        isOpen={detailModal.isOpen}
        onClose={() => setDetailModal({ isOpen: false, feedback: null })}
        title="Feedback Details"
        size="medium"
      >
        {detailModal.feedback && (
          <div>
            <div style={{ marginBottom: "1rem" }}>
              <h4 style={{ margin: "0 0 0.5rem 0", color: "#646cff" }}>
                {detailModal.feedback.course.name} {/* updated */}
              </h4>
              <p style={{ margin: "0", fontSize: "0.9rem", color: "#666" }}>
                Course Code: {detailModal.feedback.course.code}
              </p>
            </div>

            <div style={{ marginBottom: "1rem" }}>
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>
                Rating
              </label>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <span style={{ fontSize: "1.2rem" }}>
                  {Array.from({ length: 5 }, (_, i) => (
                    <span key={i} style={{ color: i < detailModal.feedback.rating ? "#fbbf24" : "#d1d5db" }}>
                      ⭐
                    </span>
                  ))}
                </span>
                <span style={{ fontWeight: "500" }}>
                  {detailModal.feedback.rating}/5
                </span>
              </div>
            </div>

            <div style={{ marginBottom: "1rem" }}>
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>
                Feedback Message
              </label>
              <div
                style={{
                  padding: "1rem",
                  backgroundColor: "#f9fafb",
                  borderRadius: "4px",
                  border: "1px solid #e5e7eb",
                  minHeight: "100px",
                }}
              >
                {detailModal.feedback.message}
              </div>
            </div>

            <div style={{ marginBottom: "1rem" }}>
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>
                Submitted On
              </label>
              <p style={{ margin: "0", color: "#666" }}>
                {new Date(detailModal.feedback.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button onClick={() => setDetailModal({ isOpen: false, feedback: null })}>
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
