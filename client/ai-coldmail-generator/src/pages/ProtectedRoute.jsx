import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {

  // Get JWT token from localStorage
  const token = localStorage.getItem("token");

  // No token = not logged in
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Token exists = allow access
  return children;
}

export default ProtectedRoute;