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
      const res = await api.get("/feedback", { params: filters });
      setFeedbacks(res.data);
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
    <div className="container">
      <h2>All Feedbacks</h2>
      <div className="filters" style={{ display: "flex", gap: 16, marginBottom: 24 }}>
        <select name="course" value={filters.course} onChange={handleFilterChange}>
          <option value="">All Courses</option>
          {courses.map((c) => (
            <option key={c._id} value={c._id}>{c.title}</option>
          ))}
        </select>
        <select name="rating" value={filters.rating} onChange={handleFilterChange}>
          <option value="">All Ratings</option>
          {[5,4,3,2,1].map((r) => (
            <option key={r} value={r}>{r} Stars</option>
          ))}
        </select>
        <input
          type="text"
          name="student"
          placeholder="Student Name or Email"
          value={filters.student}
          onChange={handleFilterChange}
        />
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="feedback-table">
          <thead>
            <tr>
              <th>Course</th>
              <th>Student</th>
              <th>Rating</th>
              <th>Comment</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {feedbacks.length === 0 ? (
              <tr><td colSpan="5">No feedbacks found.</td></tr>
            ) : (
              feedbacks.map((fb) => (
                <tr key={fb._id}>
                  <td>{fb.course?.title || fb.course}</td>
                  <td>{fb.student?.name || fb.student?.email || fb.student}</td>
                  <td>{fb.rating}</td>
                  <td>{fb.comment}</td>
                  <td>{new Date(fb.createdAt).toLocaleString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminFeedbacks;
