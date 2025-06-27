import React, { useState, useCallback } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Header from "../Components/Header/Header";
import Sidebar from "../Components/Sidebar/Sidebar";
import LogoutModal from "../Modals/LogoutConfirmation/LogoutModal";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../Redux/Store";
import { logoutUser } from "../Redux/Slices/AuthSlice";
import { ROUTES } from "../Constants/Routes";
import styles from "./MainLayout.module.css";

const MainLayout: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const toggleSidebar = useCallback(() => {
    setSidebarOpen((prev) => !prev);
  }, []);

  const handleCloseSidebar = useCallback(() => {
    setSidebarOpen(false);
  }, []);

  const handleLogoutConfirm = useCallback(async () => {
    setIsLoggingOut(true);
    await dispatch(logoutUser());
    navigate(ROUTES.LOGIN);
    setIsLoggingOut(false);
    setShowLogoutModal(false);
  }, [dispatch, navigate]);

  return (
    <div className={styles.layout}>
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={handleCloseSidebar}
        onLogoutClick={() => setShowLogoutModal(true)}
      />

      <div
        className={`${styles.contentArea} ${isSidebarOpen ? styles.sidebarOpen : styles.sidebarClosed
          }`}
      >
        <Header onToggleSidebar={toggleSidebar} isOpen={isSidebarOpen} />
        <main className={styles.main}>
          <Outlet />
        </main>
      </div>

      <LogoutModal
        isOpen={showLogoutModal}
        isLoggingOut={isLoggingOut}
        onConfirm={handleLogoutConfirm}
        onCancel={() => !isLoggingOut && setShowLogoutModal(false)}
      />
    </div>
  );
};

export default React.memo(MainLayout);
