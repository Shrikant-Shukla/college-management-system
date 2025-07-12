import React, { useEffect, useState } from "react";
import { db, auth } from "../firebase";
import {
  collection,
  getDocs,
  setDoc,
  doc,
  deleteDoc,
  query,
  where,
} from "firebase/firestore";
import { signOut, createUserWithEmailAndPassword } from "firebase/auth";
import { toast } from "react-toastify";
import "../App.css";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [form, setForm] = useState({ name: "", email: "", role: "student" });
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const fetchUsers = async () => {
    const querySnapshot = await getDocs(collection(db, "users"));
    const data = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setUsers(data);
    setFilteredUsers(data.filter((user) => user.role !== "Admin"));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    const term = searchTerm.toLowerCase();
    setFilteredUsers(
      users.filter(
        (u) =>
          u.role !== "Admin" &&
          (u.name?.toLowerCase().includes(term) ||
            u.email?.toLowerCase().includes(term))
      )
    );
  }, [searchTerm, users]);

  const handleAddOrUpdate = async () => {
    try {
      if (editingId) {
        await setDoc(doc(db, "users", editingId), form);
        toast.success("User updated");
      } else {
        const q = query(
          collection(db, "users"),
          where("email", "==", form.email)
        );
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
          toast.error("Email already exists in Firestore");
          return;
        }

        const cred = await createUserWithEmailAndPassword(
          auth,
          form.email,
          "00000000"
        );

        await setDoc(doc(db, "users", cred.user.uid), form);
        toast.success("User added with default password: 00000000");
      }

      setForm({ name: "", email: "", role: "student" });
      setEditingId(null);
      fetchUsers();
    } catch (err) {
      console.error("Error adding/updating user", err);
      toast.error("Operation failed. Email might already exist.");
    }
  };

  const handleEdit = (user) => {
    setForm({ name: user.name, email: user.email, role: user.role });
    setEditingId(user.id);
  };

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "users", id));
      fetchUsers();
      toast.success("User deleted");
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      window.location.href = "/login";
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  const studentCount = users.filter((u) => u.role === "student").length;
  const teacherCount = users.filter((u) => u.role === "teacher").length;

  return (
    <div className="admin-container">
      <h2>Admin Dashboard</h2>

      <div className="logout-button" onClick={handleLogout}>
        Logout
      </div>

      <div className="stats">
        <p>📘 Students: {studentCount}</p>
        <p>📗 Teachers: {teacherCount}</p>
      </div>

      <div className="form-section">
        <input
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <select
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
        >
          <option>student</option>
          <option>teacher</option>
        </select>
        <button onClick={handleAddOrUpdate}>
          {editingId ? "Update User" : "Add User"}
        </button>
      </div>

      <input
        className="search-bar"
        placeholder="Search users..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <div className="table-container">
        <h3>Registered Users</h3>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id}>
                <td>{user.name || "—"}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>
                  <button onClick={() => handleEdit(user)}>Edit</button>
                  <button onClick={() => handleDelete(user.id)}>Delete</button>
                </td>
              </tr>
            ))}
            {filteredUsers.length === 0 && (
              <tr>
                <td colSpan="4" style={{ textAlign: "center" }}>
                  No matching users
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <div className="admin-nav-buttons">
          <button onClick={() => navigate("/admin/courses")}>
            📘 Manage Courses
          </button>
          <button onClick={() => navigate("/admin/notes")}>📎 Notes</button>
          <button onClick={() => navigate("/admin/enrollments")}>
            🎓 Enrollments
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
