import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import { SessionProvider } from './contexts/SessionContext';
import HomePage from './pages/HomePage';
import StudentDashboard from './pages/StudentDashboard';
import TeacherDashboard from './pages/TeacherDashboard';
import SessionSetup from './pages/SessionSetup';
import JoinSession from './pages/JoinSession';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/setup" element={<SessionSetup />} />
        <Route path="/join" element={<JoinSession />} />
        <Route path="/student/:sessionId" element={<StudentDashboard />} />
        <Route path="/teacher/:sessionId" element={<TeacherDashboard />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;