import { useEffect, useState } from "react";
import api from "../api/api";

import Navbar from "../components/Navbar";
import Modal from "../components/Modal";
import useAuthStore from "../store/authStore";


export default function Feedback() {
  const [courses, setCourses] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [form, setForm] = useState({ courseId: "", rating: 0, message: "" });
  const [hoverRating, setHoverRating] = useState(0);
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
    <div style={{ minHeight: "100vh", background: "#f3f4f6" }}>
      <Navbar />
      <div style={{ maxWidth: 700, margin: "2rem auto", background: "#fff", borderRadius: 12, boxShadow: "0 2px 16px #0001", padding: "2rem 2.5rem" }}>
        {user?.role === "admin" ? (
          <div style={{ margin: "2rem 0", color: "#b91c1c", fontWeight: 600, fontSize: "1.1rem", textAlign: "center" }}>
            Feedbacks cannot be provided by admin
          </div>
        ) : (
          <>
            <h2 style={{ color: "#2563eb", fontWeight: 700, marginBottom: 8 }}>Submit Feedback</h2>
            <form
              onSubmit={e => { e.preventDefault(); submitFeedback(); }}
              style={{ display: "flex", flexDirection: "column", gap: 18, marginBottom: 32, background: "#f9fafb", borderRadius: 8, padding: 24, boxShadow: "0 1px 4px #0001" }}
            >
              <div>
                <label style={{ fontWeight: 500, marginBottom: 6, display: "block" }}>Course</label>
                <div style={{ position: "relative", width: "100%" }}>
                  <select
                    value={form.courseId}
                    onChange={e => setForm({ ...form, courseId: e.target.value })}
                    style={{
                      padding: "0.7rem 1.2rem",
                      borderRadius: 8,
                      border: "1.5px solid #2563eb",
                      width: "100%",
                      fontSize: 17,
                      background: "#fff url('data:image/svg+xml;utf8,<svg fill=\'none\' stroke=\'%232563eb\' stroke-width=\'2\' viewBox=\'0 0 24 24\' xmlns=\'http://www.w3.org/2000/svg\'><path stroke-linecap=\'round\' stroke-linejoin=\'round\' d=\'M19 9l-7 7-7-7\'></path></svg>') no-repeat right 1rem center/1.2em 1.2em",
                      appearance: "none",
                      WebkitAppearance: "none",
                      MozAppearance: "none",
                      outline: "none",
                      boxShadow: form.courseId ? "0 0 0 2px #2563eb22" : "none",
                      transition: "box-shadow 0.2s"
                    }}
                  >
                    <option value="">Select Course</option>
                    {courses.map((c) => (
                      <option key={c._id} value={c._id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label style={{ fontWeight: 500, marginBottom: 6, display: "block" }}>Rating</label>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 2 }}>
                  {Array.from({ length: 5 }, (_, i) => (
                    <span
                      key={i}
                      style={{
                        cursor: "pointer",
                        fontSize: 28,
                        color: (hoverRating || form.rating) > i ? "#fbbf24" : "#d1d5db",
                        transition: "color 0.15s"
                      }}
                      onMouseEnter={() => setHoverRating(i + 1)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setForm({ ...form, rating: i + 1 })}
                      aria-label={`Rate ${i + 1} star${i === 0 ? '' : 's'}`}
                    >
                      ★
                    </span>
                  ))}
                  <span style={{ marginLeft: 8, fontWeight: 500, color: "#2563eb", fontSize: 17 }}>{form.rating}/5</span>
                </div>
              </div>
              <div>
                <label style={{ fontWeight: 500, marginBottom: 6, display: "block" }}>Feedback Message</label>
                <textarea
                  value={form.message}
                  onChange={e => setForm({ ...form, message: e.target.value })}
                  placeholder="Write your feedback..."
                  style={{
                    padding: "0.9rem 1.2rem",
                    borderRadius: 8,
                    border: "1.5px solid #2563eb",
                    width: "100%",
                    fontSize: 17,
                    minHeight: 100,
                    background: "#fff",
                    boxShadow: form.message ? "0 0 0 2px #2563eb22" : "none",
                    outline: "none",
                    transition: "box-shadow 0.2s"
                  }}
                />
              </div>
              <button
                type="submit"
                style={{ background: "linear-gradient(90deg,#16a34a,#22d3ee)", color: "#fff", fontWeight: 600, border: "none", borderRadius: 8, padding: "0.8rem 0", fontSize: 18, cursor: "pointer", boxShadow: "0 1px 4px #0001", transition: "background 0.2s" }}
              >
                Submit
              </button>
            </form>

            <h3 style={{ color: "#2563eb", fontWeight: 700, marginBottom: 12 }}>My Feedbacks</h3>
            {feedbacks.length === 0 && <p style={{ color: "#888", fontStyle: "italic", marginBottom: 24 }}>No feedbacks submitted yet.</p>}
          </>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          {feedbacks.map((f) => (
            <div
              key={f._id}
              style={{
                background: "#f9fafb",
                border: "1px solid #e5e7eb",
                borderRadius: 8,
                padding: "1.2rem 1.5rem",
                boxShadow: "0 1px 4px #0001",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 16,
              }}
            >
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: 600, color: "#0f172a", marginBottom: 4 }}>
                  {f.course.name} <span style={{ color: "#fbbf24", fontWeight: 500 }}>&nbsp;{f.rating}/5 ⭐</span>
                </p>
                <p style={{ color: "#666", fontSize: "0.97rem", margin: 0 }}>
                  {f.message.length > 100 ? `${f.message.substring(0, 100)}...` : f.message}
                </p>
              </div>
              <button
                onClick={() => setDetailModal({ isOpen: true, feedback: f })}
                style={{ background: "#2563eb", color: "#fff", border: "none", borderRadius: 6, padding: "0.5rem 1.2rem", fontWeight: 500, cursor: "pointer", fontSize: 15, boxShadow: "0 1px 4px #0001", transition: "background 0.2s" }}
              >
                View Details
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Feedback Detail Modal */}
      <Modal
        isOpen={detailModal.isOpen}
        onClose={() => setDetailModal({ isOpen: false, feedback: null })}
        title="Feedback Details"
        size="medium"
      >
        {detailModal.feedback && (
          <div>
            <div style={{ marginBottom: "1.2rem" }}>
              <h4 style={{ margin: "0 0 0.5rem 0", color: "#2563eb", fontWeight: 700 }}>
                {detailModal.feedback.course.name}
              </h4>
              <p style={{ margin: 0, fontSize: "0.97rem", color: "#666" }}>
                Course Code: {detailModal.feedback.course.code}
              </p>
            </div>
            <div style={{ marginBottom: "1.2rem" }}>
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
            <div style={{ marginBottom: "1.2rem" }}>
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>
                Feedback Message
              </label>
              <div
                style={{
                  padding: "1rem",
                  backgroundColor: "#f3f4f6",
                  borderRadius: "4px",
                  border: "1px solid #e5e7eb",
                  minHeight: "100px",
                  fontSize: 16,
                }}
              >
                {detailModal.feedback.message}
              </div>
            </div>
            <div style={{ marginBottom: "1.2rem" }}>
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>
                Submitted On
              </label>
              <p style={{ margin: 0, color: "#666" }}>
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
              <button
                onClick={() => setDetailModal({ isOpen: false, feedback: null })}
                style={{ background: "#2563eb", color: "#fff", border: "none", borderRadius: 6, padding: "0.5rem 1.2rem", fontWeight: 500, cursor: "pointer", fontSize: 15, boxShadow: "0 1px 4px #0001", transition: "background 0.2s" }}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
