// src/pages/Teacher/TeacherNotes.jsx
import React, { useEffect, useState } from "react";
import { db, auth } from "../../firebase";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const TeacherNotes = () => {
  const [courseId, setCourseId] = useState("");
  const [link, setLink] = useState("");
  const [notes, setNotes] = useState([]);
  const [teacherName, setTeacherName] = useState("");
  const navigate = useNavigate();

  const fetchTeacher = async () => {
    const user = auth.currentUser;
    if (!user) return;

    const userQuery = query(
      collection(db, "users"),
      where("email", "==", user.email)
    );

    const userSnapshot = await getDocs(userQuery);
    const teacher = userSnapshot.docs[0]?.data();
    if (!teacher) return;

    setTeacherName(teacher.name);

    const notesQuery = query(
      collection(db, "notes"),
      where("teacher", "==", teacher.name)
    );

    const notesSnapshot = await getDocs(notesQuery);
    const notesData = notesSnapshot.docs.map((doc) => doc.data());
    setNotes(notesData);
  };

  useEffect(() => {
    fetchTeacher();
  }, []);

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!courseId || !link) return alert("Please fill in all fields.");

    await addDoc(collection(db, "notes"), {
      courseId,
      link,
      teacher: teacherName,
      timestamp: Date.now(),
    });

    setCourseId("");
    setLink("");
    fetchTeacher();
  };

  const handleLogout = () => signOut(auth).then(() => navigate("/login"));

  return (
    <div className="admin-container">
      <h2>📘 Teacher Notes</h2>
      <div className="logout-button" onClick={handleLogout}>
        Logout
      </div>

      <form onSubmit={handleAddNote} className="form-section">
        <input
          type="text"
          placeholder="Course ID"
          value={courseId}
          onChange={(e) => setCourseId(e.target.value)}
          required
        />
        <input
          type="url"
          placeholder="Public Link (Google Drive, etc)"
          value={link}
          onChange={(e) => setLink(e.target.value)}
          required
        />
        <button type="submit">Upload Note</button>
      </form>

      <h3>🗂 Uploaded Notes</h3>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Course ID</th>
              <th>Link</th>
            </tr>
          </thead>
          <tbody>
            {notes.map((note, idx) => (
              <tr key={idx}>
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
                  No notes uploaded yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TeacherNotes;
