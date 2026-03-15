import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import API_URL from "../../api";
import BlockedUserPopup from "../users/BlockedUserPopup";

const ProtectedRoute = ({ children, allowedRole }) => {
  const [isBlocked, setIsBlocked] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);
  const [checking, setChecking] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const checkStatus = async () => {
      if (!token) {
        setChecking(false);
        return;
      }

      try {
        const res = await axios.get(`${API_URL}/api/auth/check-status`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data.status === "blocked") {
          setIsBlocked(true);
        } else if (res.data.status === "deleted") {
          setIsDeleted(true);
        }
      } catch {
        // If check fails, allow through (login block check is the fallback)
      } finally {
        setChecking(false);
      }
    };

    checkStatus();

    // Poll every 5 seconds so admin deletion / blocking is caught promptly
    const interval = setInterval(checkStatus, 5000);
    return () => clearInterval(interval);
  }, [token]);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  try {
    const decoded = jwtDecode(token);

    if (decoded.role !== allowedRole) {
      if (decoded.role === "consumer") {
        return <Navigate to="/user-dashboard" replace />;
      }

      if (decoded.role === "legalExpert") {
        return <Navigate to="/legal-expert-dashboard" replace />;
      }

      if (decoded.role === "admin") {
        return <Navigate to="/admin-dashboard" replace />;
      }
    }

    if (checking) {
      return null;
    }

    if (isBlocked) {
      return <BlockedUserPopup />;
    }

    if (isDeleted) {
      return <BlockedUserPopup reason="deleted" />;
    }

    return children;
  } catch (error) {
    return <Navigate to="/login" replace />;
  }
};

export default ProtectedRoute;
