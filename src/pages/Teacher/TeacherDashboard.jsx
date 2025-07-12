import React, { useEffect, useState } from "react";
import { auth, db } from "../../firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { signOut } from "firebase/auth";
import "../../App.css";
import { useNavigate } from "react-router-dom";

const TeacherDashboard = () => {
  const [teacherName, setTeacherName] = useState("");
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserAndCourses = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const userDoc = await getDocs(
        query(collection(db, "users"), where("email", "==", user.email))
      );
      const userData = userDoc.docs[0]?.data();
      const name = userData?.name;

      if (!name) return;

      setTeacherName(name);

      const q = query(collection(db, "courses"), where("teacher", "==", name));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCourses(data);
    };

    fetchUserAndCourses();
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
      <h2>Welcome, {teacherName}</h2>

      <div className="logout-button" onClick={handleLogout}>
        Logout
      </div>

      <h3>Your Assigned Courses</h3>
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
            {courses.map((course) => (
              <tr key={course.id}>
                <td>{course.courseId}</td>
                <td>{course.name}</td>
                <td>{course.credits}</td>
              </tr>
            ))}
            {courses.length === 0 && (
              <tr>
                <td colSpan="3" style={{ textAlign: "center" }}>
                  No courses assigned.
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <button onClick={() => navigate("/teacher/notes")}>
          📘 Manage Notes
        </button>
      </div>
    </div>
  );
};

export default TeacherDashboard;
