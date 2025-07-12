// src/routes/Router.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import Register from "../pages/Register";
import AdminDashboard from "../pages/AdminDashboard";
import StudentDashboard from "../pages/Student/StudentDashboard";
import TeacherDashboard from "../pages/Teacher/TeacherDashboard";
import NotFound from "../pages/NotFound";
import CourseManagement from "../pages/Admin/CourseManagement";
import NotesAdmin from "../pages/Admin/NotesAdmin";
import TeacherNotes from "../pages/Teacher/TeacherNotes";
import StudentNotes from "../pages/Student/StudentNotes";
import StudentEnrollment from "../pages/StudentEnrollment";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/admin/courses" element={<CourseManagement />} />
      <Route path="/admin/notes" element={<NotesAdmin />} />
      <Route path="/admin/enrollments" element={<StudentEnrollment />} />
      <Route path="/student" element={<StudentDashboard />} />
      <Route path="/student/notes" element={<StudentNotes />} />
      <Route path="/teacher" element={<TeacherDashboard />} />
      <Route path="/teacher/notes" element={<TeacherNotes />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default AppRoutes;
