// src/pages/Admin/CourseManagement.jsx
import React, { useState, useEffect } from "react";
import { db } from "../../firebase";
import {
  collection,
  getDocs,
  setDoc,
  doc,
  deleteDoc,
  query,
  where,
} from "firebase/firestore";
import "../../App.css";

const CourseManagement = () => {
  const [courses, setCourses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [form, setForm] = useState({
    courseId: "",
    name: "",
    credits: "",
    teacher: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchCourses();
    fetchTeachers();
  }, []);

  const fetchCourses = async () => {
    const querySnapshot = await getDocs(collection(db, "courses"));
    const data = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setCourses(data);
  };

  const fetchTeachers = async () => {
    const q = query(collection(db, "users"), where("role", "==", "teacher"));
    const snapshot = await getDocs(q);
    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setTeachers(data);
  };

  const handleAddOrUpdate = async () => {
    if (!form.courseId || !form.name || !form.credits || !form.teacher) return;

    const courseRef = doc(db, "courses", editingId || form.courseId);
    await setDoc(courseRef, form);

    setForm({ courseId: "", name: "", credits: "", teacher: "" });
    setEditingId(null);
    fetchCourses();
  };

  const handleEdit = (course) => {
    setForm({
      courseId: course.courseId,
      name: course.name,
      credits: course.credits,
      teacher: course.teacher,
    });
    setEditingId(course.courseId);
  };

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "courses", id));
    fetchCourses();
  };

  const filteredCourses = courses.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="admin-container">
      <h2>Course Management</h2>

      <div className="form-section">
        <input
          type="text"
          placeholder="Course ID"
          value={form.courseId}
          onChange={(e) => setForm({ ...form, courseId: e.target.value })}
        />
        <input
          type="text"
          placeholder="Course Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          type="number"
          placeholder="Credits"
          value={form.credits}
          onChange={(e) => setForm({ ...form, credits: e.target.value })}
        />
        <select
          value={form.teacher}
          onChange={(e) => setForm({ ...form, teacher: e.target.value })}
        >
          <option value="">Assign Teacher</option>
          {teachers.map((t) => (
            <option key={t.id} value={t.name}>
              {t.name}
            </option>
          ))}
        </select>
        <button onClick={handleAddOrUpdate}>
          {editingId ? "Update" : "Add"}
        </button>
      </div>

      <input
        className="search-bar"
        placeholder="Search courses..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="table-container">
        <h3>All Courses</h3>
        <table>
          <thead>
            <tr>
              <th>Course ID</th>
              <th>Name</th>
              <th>Credits</th>
              <th>Teacher</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCourses.map((course) => (
              <tr key={course.courseId}>
                <td>{course.courseId}</td>
                <td>{course.name}</td>
                <td>{course.credits}</td>
                <td>{course.teacher}</td>
                <td>
                  <button onClick={() => handleEdit(course)}>Edit</button>
                  <button onClick={() => handleDelete(course.courseId)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {filteredCourses.length === 0 && (
              <tr>
                <td colSpan="5" style={{ textAlign: "center" }}>
                  No matching courses
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CourseManagement;
