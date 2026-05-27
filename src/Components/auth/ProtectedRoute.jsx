import { Navigate, useLocation } from "react-router-dom";
import RouteSkeleton from "../RouteSkeleton";
import useAuth from "../../hooks/useAuth";

function ProtectedRoute({ children }) {
  const location = useLocation();
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <RouteSkeleton compact />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return children;
}

export default ProtectedRoute;
