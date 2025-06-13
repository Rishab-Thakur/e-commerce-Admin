import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "../Components/Header/Header";
import Sidebar from "../Components/Sidebar/Sidebar";
import styles from "./MainLayout.module.css";

const MainLayout: React.FC = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className={styles.layout}>
      <Sidebar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div
        className={`${styles.contentArea} ${
          isSidebarOpen ? styles.sidebarOpen : styles.sidebarClosed
        }`}
      >
        <Header onToggleSidebar={toggleSidebar} />
        <main className={styles.main}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
