import React from "react";
import { Navigate } from "react-router-dom";
import { shallowEqual, useSelector } from "react-redux";
import type { RootState } from "../../Redux/Store";
import { ROUTES } from "../../Constants/Routes";

interface PublicRouteProps {
    children: React.ReactNode;
}

const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
    const isAuthenticated = useSelector(
        (state: RootState) => state.auth.isAuthenticated, shallowEqual
    );

    // If user is already authenticated, redirect to dashboard
    if (isAuthenticated) {
        return <Navigate to={ROUTES.DASHBOARD} replace />;
    }

    return <>{children}</>;
};

export default React.memo(PublicRoute);
