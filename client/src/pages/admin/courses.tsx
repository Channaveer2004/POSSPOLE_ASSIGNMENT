"use client"
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Course {
  _id: string;
  title: string;
  code: string;
  description: string;
}

const AdminCoursesPage = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editCourse, setEditCourse] = useState<Course | null>(null);
  const [form, setForm] = useState({ title: "", code: "", description: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  // Role protection
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user || JSON.parse(user).role !== "admin") {
      router.push("/login");
    }
  }, [router]);

  // Fetch courses
  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      setError("");
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:5000/api/courses", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch courses");
        const data = await res.json();
        setCourses(Array.isArray(data) ? data : []);
      } catch (err: any) {
        setError(err.message || "Error fetching courses");
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  // Handlers for Add/Edit/Delete
  const handleAdd = async () => {
    setError("");
    setSuccess("");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/courses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Failed to add course");
      }
      const newCourse = await res.json();
      setCourses((prev) => [...prev, newCourse]);
      setShowAddModal(false);
      setForm({ title: "", code: "", description: "" });
      setSuccess("Course added successfully!");
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleEdit = async () => {
    if (!editCourse) return;
    setError("");
    setSuccess("");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/api/courses/${editCourse._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Failed to update course");
      }
      const updated = await res.json();
      setCourses((prev) => prev.map((c) => (c._id === updated._id ? updated : c)));
      setShowEditModal(false);
      setEditCourse(null);
      setForm({ title: "", code: "", description: "" });
      setSuccess("Course updated successfully!");
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;
    setError("");
    setSuccess("");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/api/courses/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Failed to delete course");
      }
      setCourses((prev) => prev.filter((c) => c._id !== id));
      setSuccess("Course deleted successfully!");
    } catch (err: any) {
      setError(err.message);
    }
  };

  // UI for Add/Edit Modal
  const renderModal = (isEdit = false) => (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-red-300 p-6 rounded shadow w-96">
        <h2 className="text-lg font-bold mb-4">{isEdit ? "Edit Course" : "Add Course"}</h2>
        <input
          className="border p-2 mb-2 w-full"
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />
        <input
          className="border p-2 mb-2 w-full"
          placeholder="Code"
          value={form.code}
          onChange={(e) => setForm({ ...form, code: e.target.value })}
          disabled={isEdit}
        />
        <textarea
          className="border p-2 mb-2 w-full"
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        <div className="flex gap-2 mt-2">
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded"
            onClick={isEdit ? handleEdit : handleAdd}
          >
            {isEdit ? "Save" : "Add"}
          </button>
          <button
            className="bg-gray-300 px-4 py-2 rounded"
            onClick={() => {
              setShowAddModal(false);
              setShowEditModal(false);
              setEditCourse(null);
              setForm({ title: "", code: "", description: "" });
            }}
          >
            Cancel
          </button>
        </div>
        {error && <div className="text-red-600 mt-2">{error}</div>}
      </div>
    </div>
  );

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Courses Management</h1>
      <button
        className="bg-green-600 text-white px-4 py-2 rounded mb-4"
        onClick={() => setShowAddModal(true)}
      >
        Add Courseee
      </button>
      {loading ? (
        <div>Loading courses...</div>
      ) : error ? (
        <div className="text-red-600">{error}</div>
      ) : (
        <table className="min-w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2">Title</th>
              <th className="border px-4 py-2">Code</th>
              <th className="border px-4 py-2">Description</th>
              <th className="border px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course) => (
              <tr key={course._id}>
                <td className="border px-4 py-2">{course.title}</td>
                <td className="border px-4 py-2">{course.code}</td>
                <td className="border px-4 py-2">{course.description}</td>
                <td className="border px-4 py-2 flex gap-2">
                  <button
                    className="bg-blue-500 text-white px-2 py-1 rounded"
                    onClick={() => {
                      setEditCourse(course);
                      setForm({
                        title: course.title,
                        code: course.code,
                        description: course.description,
                      });
                      setShowEditModal(true);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-500 text-white px-2 py-1 rounded"
                    onClick={() => handleDelete(course._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {showAddModal && renderModal(false)}
      {showEditModal && renderModal(true)}
      {success && <div className="text-green-600 mt-4">{success}</div>}
    </div>
  );
};

export default AdminCoursesPage;
