import React, { useEffect, useState } from "react";
import api from "../api/api";
import "../pages/Landing.css";

const AdminFeedbacks = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [courses, setCourses] = useState([]);
  const [filters, setFilters] = useState({ course: "", rating: "", student: "" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeedbacks();
    fetchCourses();
  }, []);

  const fetchFeedbacks = async () => {
    setLoading(true);
    try {
      // Only send student filter if not empty
      const params = { ...filters };
      if (params.student) {
        params.student = params.student.trim();
      }
      const res = await api.get("/feedback", { params });
      let data = res.data;
      // If student filter is present, filter by name or email (case-insensitive)
      if (filters.student) {
        const search = filters.student.trim().toLowerCase();
        data = data.filter(fb =>
          (fb.user?.name && fb.user.name.toLowerCase().includes(search)) ||
          (fb.user?.email && fb.user.email.toLowerCase().includes(search))
        );
      }
      setFeedbacks(data);
    } catch (err) {
      setFeedbacks([]);
    }
    setLoading(false);
  };

  const fetchCourses = async () => {
    try {
      const res = await api.get("/courses");
      setCourses(res.data);
    } catch (err) {
      setCourses([]);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    fetchFeedbacks();
    // eslint-disable-next-line
  }, [filters]);

  return (
    <div className="admin-feedbacks-page" style={{ maxWidth: 1000, margin: "40px auto", background: "#fff", borderRadius: 12, boxShadow: "0 2px 16px #0001", padding: 32 }}>
      <h2 style={{ fontSize: 28, fontWeight: 700, marginBottom: 24, color: "#1a237e", letterSpacing: 1 }}>All Feedbacks</h2>
      <div className="filters" style={{ display: "flex", gap: 20, marginBottom: 32, alignItems: "center" }}>
        <div>
          <label style={{ fontWeight: 500, color: "#333" }}>Course:</label><br />
          <select name="course" value={filters.course} onChange={handleFilterChange} style={{ padding: 8, borderRadius: 6, border: "1px solid #bbb", minWidth: 160 }}>
            <option value="">All Courses</option>
            {courses.map((c) => (
              <option key={c._id} value={c._id}>{c.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label style={{ fontWeight: 500, color: "#333" }}>Rating:</label><br />
          <select name="rating" value={filters.rating} onChange={handleFilterChange} style={{ padding: 8, borderRadius: 6, border: "1px solid #bbb", minWidth: 120 }}>
            <option value="">All Ratings</option>
            {[5,4,3,2,1].map((r) => (
              <option key={r} value={r}>{r} Stars</option>
            ))}
          </select>
        </div>
        <div>
          <label style={{ fontWeight: 500, color: "#333" }}>Student:</label><br />
          <input
            type="text"
            name="student"
            placeholder="Name or Email"
            value={filters.student}
            onChange={handleFilterChange}
            style={{ padding: 8, borderRadius: 6, border: "1px solid #bbb", minWidth: 180 }}
          />
        </div>
        <button onClick={fetchFeedbacks} style={{ marginTop: 22, padding: "8px 18px", background: "#1976d2", color: "#fff", border: 0, borderRadius: 6, fontWeight: 600, cursor: "pointer" }}>Search</button>
        <button onClick={() => setFilters({ course: "", rating: "", student: "" })} style={{ marginTop: 22, padding: "8px 14px", background: "#eee", color: "#333", border: 0, borderRadius: 6, fontWeight: 500, cursor: "pointer" }}>Reset</button>
      </div>
      {loading ? (
        <div style={{ textAlign: "center", margin: "40px 0" }}>
          <span className="loader" style={{ display: "inline-block", width: 32, height: 32, border: "4px solid #1976d2", borderTop: "4px solid #fff", borderRadius: "50%", animation: "spin 1s linear infinite" }}></span>
        </div>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table className="feedback-table" style={{ width: "100%", borderCollapse: "collapse", background: "#fafbfc" }}>
            <thead>
              <tr style={{ background: "#e3eafc" }}>
                <th style={{ padding: 12, fontWeight: 700, color: "#1a237e" }}>Course</th>
                <th style={{ padding: 12, fontWeight: 700, color: "#1a237e" }}>Student</th>
                <th style={{ padding: 12, fontWeight: 700, color: "#1a237e" }}>Rating</th>
                <th style={{ padding: 12, fontWeight: 700, color: "#1a237e" }}>Comment</th>
                <th style={{ padding: 12, fontWeight: 700, color: "#1a237e" }}>Date</th>
              </tr>
            </thead>
            <tbody>
              {feedbacks.length === 0 ? (
                <tr><td colSpan="5" style={{ textAlign: "center", padding: 24, color: "#888" }}>No feedbacks found.</td></tr>
              ) : (
                feedbacks.map((fb) => (
                  <tr key={fb._id} style={{ borderBottom: "1px solid #e0e0e0" }}>
                    <td style={{ padding: 10 }}>{fb.course?.name || fb.course}</td>
                    <td style={{ padding: 10 }}>{fb.user?.name || fb.user?.email || fb.user}</td>
                    <td style={{ padding: 10 }}>
                      <span style={{ color: "#ffb300", fontWeight: 600 }}>{"★".repeat(fb.rating)}</span>
                    </td>
                    <td style={{ padding: 10 }}>{fb.message}</td>
                    <td style={{ padding: 10, color: "#555" }}>{new Date(fb.createdAt).toLocaleString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
      {/* Loader animation */}
      <style>{`
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default AdminFeedbacks;
