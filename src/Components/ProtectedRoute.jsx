import React from "react";
import { Navigate } from "react-router-dom";

/** Guards routes by checking a token in localStorage (replace with your auth). */
export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem("sb_auth_token");
  if (!token) return <Navigate to="/login" replace />;
  return children;
}
