// src/App.jsx — Route Definitions
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Login    from './pages/Login';
import Register from './pages/Register';
import ChatPage from './pages/ChatPage';

// ── ProtectedRoute: redirect to /login if not authed
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <FullPageLoader />;
  return user ? children : <Navigate to="/login" replace />;
};

// ── PublicRoute: redirect to /chat if already authed
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <FullPageLoader />;
  return !user ? children : <Navigate to="/chat" replace />;
};

// ── Full-page loader (shown during auth check) ──
const FullPageLoader = () => (
  <div className="h-screen w-screen bg-surface-950 flex items-center justify-center">
    <div className="flex flex-col items-center gap-4">
      <div className="w-10 h-10 rounded-xl bg-brand-500 flex items-center justify-center animate-pulse-slow">
        <span className="text-white font-bold text-lg">A</span>
      </div>
      <div className="flex gap-1.5">
        <div className="typing-dot" />
        <div className="typing-dot" />
        <div className="typing-dot" />
      </div>
    </div>
  </div>
);

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/chat" replace />} />
      <Route path="/login"    element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
      <Route path="/chat"     element={<ProtectedRoute><ChatPage /></ProtectedRoute>} />
      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/chat" replace />} />
    </Routes>
  );
}
