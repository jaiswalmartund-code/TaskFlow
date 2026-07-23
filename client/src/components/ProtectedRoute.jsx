import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-bone">
        <p className="font-mono text-sm text-graphite/50">Loading TaskFlow…</p>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;
  return children;
}
