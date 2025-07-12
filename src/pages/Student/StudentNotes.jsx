// src/pages/Student/StudentNotes.jsx
import React, { useEffect, useState } from "react";
import { db, auth } from "../../firebase";
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

const StudentNotes = () => {
  const [notes, setNotes] = useState([]);
  const [studentName, setStudentName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNotes = async () => {
      const user = auth.currentUser;
      if (!user) return;

      // Get student name
      const userDoc = await getDoc(doc(db, "users", user.uid));
      const name = userDoc.data().name;
      setStudentName(name);

      // Get enrolled course IDs
      const enrollmentRef = collection(db, "enrollments");
      const enrollmentQuery = query(
        enrollmentRef,
        where("student", "==", name)
      );
      const enrollmentSnapshot = await getDocs(enrollmentQuery);
      const courseIds = enrollmentSnapshot.docs.map(
        (doc) => doc.data().courseId
      );

      if (courseIds.length === 0) return;

      // Fetch all notes, then filter
      const notesSnapshot = await getDocs(collection(db, "notes"));
      const allNotes = notesSnapshot.docs.map((doc) => doc.data());
      const filtered = allNotes.filter((note) =>
        courseIds.includes(note.courseId)
      );

      setNotes(filtered);
    };

    fetchNotes();
  }, []);

  const handleLogout = () => signOut(auth).then(() => navigate("/login"));

  return (
    <div className="admin-container">
      <h2>📘 Notes for {studentName}</h2>
      <div className="logout-button" onClick={handleLogout}>
        Logout
      </div>

      <h3>🗂 Available Notes</h3>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Course ID</th>
              <th>Note Link</th>
            </tr>
          </thead>
          <tbody>
            {notes.map((note, index) => (
              <tr key={index}>
                <td>{note.courseId}</td>
                <td>
                  <a href={note.link} target="_blank" rel="noopener noreferrer">
                    View Note
                  </a>
                </td>
              </tr>
            ))}
            {notes.length === 0 && (
              <tr>
                <td colSpan="2" style={{ textAlign: "center" }}>
                  No notes found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentNotes;
