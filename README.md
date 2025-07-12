# 🎓 College Management System

A fully functional **College Management System** built with **React**, **Firebase Authentication**, **Firestore**, and **Role-Based Dashboards** for Admins, Teachers, and Students. It supports user management, course handling, enrollment, and notes sharing.

---

## 🔗 Live Project

**🌐 [View Live Deployment](https://college-management-syste-3e625.web.app)**

> Hosted on Firebase Hosting

---

## ✨ Features

- 🔐 **Authentication** (Login, Register) using Firebase Auth
- 🧑‍🏫 **Role-based dashboards** for:
  - **Admin**: Manage users, courses, notes, and enrollments
  - **Teacher**: View assigned courses and upload/view notes
  - **Student**: View enrolled courses and notes
- 📚 **Course Management** by Admin
- 📎 **Notes Upload/View** via public links (Google Drive, etc.)
- 👥 **Student Enrollment** to Courses
- 🌗 **Dark Mode** toggle (globally accessible)
- 📦 **Cloud Firestore** for real-time database
- 🔥 **Firebase Hosting** and GitHub Workflow ready

---

## 📁 Project Structure (Simplified)

```
src/
│
├── components/
│   ├── DarkModeToggle.jsx
│   └── DarkModeToggle.css
│
├── context/
│   └── ThemeContext.jsx
│
├── pages/
│   ├── Admin/
│   │   ├── CourseManagement.jsx
│   │   └── NotesAdmin.jsx
│   │
│   ├── Student/
│   │   ├── StudentDashboard.jsx
│   │   └── StudentNotes.jsx
│   │
│   ├── Teacher/
│   │   ├── TeacherDashboard.jsx
│   │   └── TeacherNotes.jsx
│   │
│   ├── AdminDashboard.jsx
│   ├── StudentEnrollment.jsx
│   ├── Login.jsx
│   ├── Register.jsx
│   └── NotFound.jsx
│
├── routes/
│   └── Router.jsx
│
├── App.jsx
├── firebase.js
└── index.js
```

---

## ⚙️ Tech Stack

- **Frontend**: React
- **Backend**: Firebase Firestore
- **Authentication**: Firebase Auth
- **Hosting**: Firebase Hosting
- **CI/CD**: GitHub Actions (Workflow configured)

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/Shrikant-Shukla/college-management-system.git
cd college-management-system
```

### 2. Install dependencies

```bash
npm install
```

### 3. Firebase Setup

- Create a Firebase project at [firebase.google.com](https://firebase.google.com/)
- Enable **Authentication**, **Firestore**, and **Hosting**
- Replace your Firebase config in `firebase.js`

### 4. Start Development

```bash
npm start
```

### 5. Deploy to Firebase

```bash
npm run build
firebase deploy
```

## 🛡️ Default Login Password

- When Admin adds users, their default password is: `00000000`
- To login as Admin use
  Email: admin@college.com
  Password: 00000000

---

## 📌 Notes

- No Firebase Storage used — **notes are public links**
- Minimal CSS framework; styling done via custom `App.css` and `DarkModeToggle.css`
- Project works completely on **client-side Firebase SDK**; no backend server required

---

## 🙌 Acknowledgements

- Built as part of a full-stack college project
- Guided and tested in collaboration with OpenAI’s GPT-4o

---

## 🧠 License

This project is open source and free to use under the MIT license.
