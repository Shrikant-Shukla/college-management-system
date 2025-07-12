import React, { useEffect, useState } from "react";
import { db } from "../../firebase";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
import "../../App.css";

const NotesAdmin = () => {
  const [notes, setNotes] = useState([]);
  const [form, setForm] = useState({
    title: "",
    courseId: "",
    link: "",
  });

  const fetchNotes = async () => {
    const snapshot = await getDocs(collection(db, "notes"));
    const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setNotes(data);
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.courseId || !form.link) return;
    await addDoc(collection(db, "notes"), {
      ...form,
      uploadedBy: "admin",
    });
    setForm({ title: "", courseId: "", link: "" });
    fetchNotes();
  };

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "notes", id));
    fetchNotes();
  };

  return (
    <div className="admin-container">
      <h2>📚 Admin - Upload Notes</h2>

      <form className="form-section" onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          placeholder="Note Title"
          value={form.title}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="courseId"
          placeholder="Course ID"
          value={form.courseId}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="link"
          placeholder="Public Link (Google Drive, etc)"
          value={form.link}
          onChange={handleChange}
          required
        />
        <button type="submit">Upload</button>
      </form>

      <div className="table-container">
        <h3>Uploaded Notes</h3>
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Course ID</th>
              <th>Link</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {notes.map((note) => (
              <tr key={note.id}>
                <td>{note.title}</td>
                <td>{note.courseId}</td>
                <td>
                  <a href={note.link} target="_blank" rel="noreferrer">
                    View
                  </a>
                </td>
                <td>
                  <button onClick={() => handleDelete(note.id)}>Delete</button>
                </td>
              </tr>
            ))}
            {notes.length === 0 && (
              <tr>
                <td colSpan="4" style={{ textAlign: "center" }}>
                  No notes available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default NotesAdmin;
