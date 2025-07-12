// src/pages/StudentDashboard.jsx
import React, { useEffect, useState } from "react";
import { auth, db } from "../../firebase";
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  getDoc,
} from "firebase/firestore";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const StudentDashboard = () => {
  const [studentName, setStudentName] = useState("");
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStudentCourses = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const userDoc = await getDoc(doc(db, "users", user.uid));
      const name = userDoc.data().name;
      setStudentName(name);

      const enrollmentRef = collection(db, "enrollments");
      const q = query(enrollmentRef, where("student", "==", name));
      const snapshot = await getDocs(q);

      const courseIds = snapshot.docs.map((doc) => doc.data().courseId);

      if (courseIds.length > 0) {
        const coursesSnapshot = await getDocs(collection(db, "courses"));
        const allCourses = coursesSnapshot.docs.map((doc) => doc.data());
        const matchedCourses = allCourses.filter((c) =>
          courseIds.includes(c.courseId)
        );
        setEnrolledCourses(matchedCourses);
      }
    };

    fetchStudentCourses();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      window.location.href = "/login";
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  return (
    <div className="admin-container">
      <h2>Welcome, {studentName}</h2>
      <div className="logout-button" onClick={handleLogout}>
        Logout
      </div>

      <h3>Your Enrolled Courses</h3>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Course ID</th>
              <th>Name</th>
              <th>Credits</th>
            </tr>
          </thead>
          <tbody>
            {enrolledCourses.map((course, index) => (
              <tr key={index}>
                <td>{course.courseId}</td>
                <td>{course.name}</td>
                <td>{course.credits}</td>
              </tr>
            ))}
            {enrolledCourses.length === 0 && (
              <tr>
                <td colSpan="3" style={{ textAlign: "center" }}>
                  No enrolled courses found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <button onClick={() => navigate("/student/notes")}>
          📘 View Notes
        </button>
      </div>
    </div>
  );
};

export default StudentDashboard;
