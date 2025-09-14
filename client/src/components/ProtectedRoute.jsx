
import { Navigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import useAuthStore from "../store/authStore";

export default function ProtectedRoute({ children }) {
  const token = useAuthStore((s) => s.accessToken);
  const user = useAuthStore((s) => s.user);
  const fetchUser = useAuthStore((s) => s.fetchUser);
  const location = useLocation();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let ignore = false;
    if (token && !user) {
      setLoading(true);
      fetchUser().finally(() => { if (!ignore) setLoading(false); });
    }
    return () => { ignore = true; };
  }, [token, user, fetchUser]);

  if (!token) return <Navigate to="/login" replace />;

  if (token && !user) return null; // or a spinner/loading indicator
  // If trying to access /admin, only allow admin users
  if (location.pathname.startsWith("/admin") && user?.role !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
