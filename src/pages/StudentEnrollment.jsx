// src/pages/StudentEnrollment.jsx
import React, { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  query,
  where,
} from "firebase/firestore";
import { db } from "../firebase";
import "../App.css";

const StudentEnrollment = () => {
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [selectedCourseId, setSelectedCourseId] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const usersSnapshot = await getDocs(
        query(collection(db, "users"), where("role", "==", "student"))
      );
      setStudents(
        usersSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
      );

      const courseSnapshot = await getDocs(collection(db, "courses"));
      setCourses(courseSnapshot.docs.map((doc) => doc.data()));

      const enrollmentSnapshot = await getDocs(collection(db, "enrollments"));
      setEnrollments(
        enrollmentSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
      );
    };

    fetchData();
  }, []);

  const handleAssign = async () => {
    if (!selectedStudentId || !selectedCourseId) {
      alert("Select both student and course");
      return;
    }

    const student = students.find((s) => s.id === selectedStudentId);
    const course = courses.find((c) => c.courseId === selectedCourseId);

    if (!student || !course) {
      alert("Invalid selection");
      return;
    }

    await addDoc(collection(db, "enrollments"), {
      student: student.name,
      courseId: course.courseId,
      courseName: course.name,
    });

    window.location.reload(); // refresh page to update list
  };

  const handleRemove = async (enrollmentId) => {
    await deleteDoc(doc(db, "enrollments", enrollmentId));
    setEnrollments(enrollments.filter((e) => e.id !== enrollmentId));
  };

  return (
    <div className="admin-container">
      <h2>🎓 Assign/Remove Students from Courses</h2>

      <div className="form-section">
        <select
          value={selectedStudentId}
          onChange={(e) => setSelectedStudentId(e.target.value)}
        >
          <option value="">Select Student</option>
          {students.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name} ({s.email})
            </option>
          ))}
        </select>

        <select
          value={selectedCourseId}
          onChange={(e) => setSelectedCourseId(e.target.value)}
        >
          <option value="">Select Course</option>
          {courses.map((c, i) => (
            <option key={i} value={c.courseId}>
              {c.name} ({c.courseId})
            </option>
          ))}
        </select>

        <button onClick={handleAssign}>➕ Assign</button>
      </div>

      <div className="table-container">
        <h3>Current Enrollments</h3>
        <table>
          <thead>
            <tr>
              <th>Student</th>
              <th>Course ID</th>
              <th>Course Name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {enrollments.map((enroll) => (
              <tr key={enroll.id}>
                <td>{enroll.student}</td>
                <td>{enroll.courseId}</td>
                <td>{enroll.courseName}</td>
                <td>
                  <button onClick={() => handleRemove(enroll.id)}>
                    🗑 Remove
                  </button>
                </td>
              </tr>
            ))}
            {enrollments.length === 0 && (
              <tr>
                <td colSpan="4" style={{ textAlign: "center" }}>
                  No enrollments yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentEnrollment;
