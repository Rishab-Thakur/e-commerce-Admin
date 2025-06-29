import React, { useCallback } from "react";
import styles from "./Header.module.css";
import { useSelector } from "react-redux";
import type { RootState } from "../../Redux/Store";

interface HeaderProps {
  onToggleSidebar: () => void;
  isOpen: boolean;
}

const Header: React.FC<HeaderProps> = ({ onToggleSidebar, isOpen }) => {
  const user = useSelector((state: RootState) => state.auth.user);

  const handleToggleSidebar = useCallback(() => {
    onToggleSidebar();
  }, [onToggleSidebar]);

  return (
    <header className={styles.header}>
      <div className={styles.left}>
        {!isOpen && (
          <button className={styles.menuIcon} onClick={handleToggleSidebar}>
            ☰
          </button>
        )}
        <div className={styles.logo}>🛍️ Wyntra Admin Panel</div>
      </div>

      {user && <div className={styles.username}>Welcome Admin</div>}
    </header>
  );
};

export default React.memo(Header);
