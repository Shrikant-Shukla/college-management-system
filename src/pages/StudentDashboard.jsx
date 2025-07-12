import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import "../App.css";

const StudentDashboard = () => {
  const [userData, setUserData] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStudent = async () => {
      const user = auth.currentUser;
      if (user) {
        const ref = doc(db, "users", user.uid);
        const snap = await getDoc(ref);
        if (snap.exists()) setUserData(snap.data());
      }
    };

    fetchStudent();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  return (
    <div className="dashboard-container">
      <h2>Student Dashboard</h2>
      <button className="logout-button" onClick={handleLogout}>
        Logout
      </button>
      <div className="dashboard-card">
        <p>
          <strong>Name:</strong> {userData.name}
        </p>
        <p>
          <strong>Email:</strong> {userData.email}
        </p>
        <p>
          <strong>Role:</strong> Student
        </p>
        <p>
          <strong>Enrolled Course:</strong> {userData.course || "Not Assigned"}
        </p>
      </div>
    </div>
  );
};

export default StudentDashboard;
