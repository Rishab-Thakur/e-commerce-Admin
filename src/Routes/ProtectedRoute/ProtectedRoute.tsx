import React from "react";
import { Navigate } from "react-router-dom";
import { shallowEqual, useSelector } from "react-redux";
import type { RootState } from "../../Redux/Store";
import { ROUTES } from "../../Constants/Routes";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth, shallowEqual);

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  // Otherwise, render protected content
  return <>{children}</>;
};

export default React.memo(ProtectedRoute);
