import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ROUTES } from "../../Constants/Routes";

import Login from "../../Pages/Login/Login";
import Dashboard from "../../Pages/Dashboard/Dashboard";
import Products from "../../Pages/Products/Prdoducts";
import Orders from "../../Pages/Orders/Orders";
import Users from "../../Pages/Users/Users";
import NotFound from "../../Pages/NotFound/NotFound";
import MainLayout from "../../Layouts/MainLayout";

import ProtectedRoute from "../ProtectedRoute/ProtectedRoute";
import PublicRoute from "../PublicRoutes/PublicRoutes";
import ForgotPassword from "../../Pages/ForgetPassword/ForgetPassword";

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route
        path={ROUTES.LOGIN}
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
       <Route
          path={ROUTES.FORGOT_PASSWORD}
          element={
            <PublicRoute>
              <ForgotPassword />
            </PublicRoute>
          }
        />

      <Route element={<MainLayout />}>
        <Route
          path={ROUTES.DASHBOARD}
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.PRODUCTS}
          element={
            <ProtectedRoute>
              <Products />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.ORDERS}
          element={
            <ProtectedRoute>
              <Orders />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.USERS}
          element={
            <ProtectedRoute>
              <Users />
            </ProtectedRoute>
          }
        />

        {/* Default redirect to dashboard */}
        <Route path="/" element={<Navigate to={ROUTES.DASHBOARD} replace />} />
      </Route>

      {/* 404 Route */}
      <Route path={ROUTES.NOT_FOUND} element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
