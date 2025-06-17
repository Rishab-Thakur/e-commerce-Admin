import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../../Redux/Store";
import { ROUTES } from "../../Constants/Routes";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, accessToken } = useSelector((state: RootState) => state.auth);

  const token = localStorage.getItem("accessToken") || accessToken;

  if (!isAuthenticated || !token) {
    return <Navigate to= {ROUTES.LOGIN} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
