import React from "react";
import styles from "./Header.module.css";
import { useSelector } from "react-redux";
import type { RootState } from "../../Redux/Store";

interface HeaderProps {
  onToggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ onToggleSidebar }) => {
  const user = useSelector((state: RootState) => state.auth.user);

  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <button className={styles.menuIcon} onClick={onToggleSidebar}>
          ☰
        </button>
        <div className={styles.logo}>🛍️ Admin Panel</div>
      </div>

      {user && <div className={styles.username}>Welcome, Admin</div>}
    </header>
  );
};

export default Header;
