import React, { useState, useCallback } from "react";
import { Outlet } from "react-router-dom";
import Header from "../Components/Header/Header";
import Sidebar from "../Components/Sidebar/Sidebar";
import styles from "./MainLayout.module.css";

const MainLayout: React.FC = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  // Toggle sidebar visibility
  const toggleSidebar = useCallback(() => {
    setSidebarOpen((prev) => !prev);
  }, []);

  // Close sidebar
  const handleCloseSidebar = useCallback(() => {
    setSidebarOpen(false);
  }, []);

  return (
    <div className={styles.layout}>
      <Sidebar isOpen={isSidebarOpen} onClose={handleCloseSidebar} />
      <div
        className={`${styles.contentArea} ${isSidebarOpen ? styles.sidebarOpen : styles.sidebarClosed
          }`}
      >
        <Header onToggleSidebar={toggleSidebar} isOpen={isSidebarOpen} />
        <main className={styles.main}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default React.memo(MainLayout);
