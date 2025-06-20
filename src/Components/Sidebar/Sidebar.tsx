import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import styles from "./Sidebar.module.css";
import {
  MdDashboard,
  MdInventory2,
  MdPeople,
  MdShoppingCart,
  MdClose,
  MdLogout,
} from "react-icons/md";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../Redux/Store";
import { logoutUser } from "../../Redux/Slices/AuthSlice";
import { ROUTES } from "../../Constants/Routes";

export interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const handleLogout = async() => {
    dispatch(logoutUser());
    navigate(ROUTES.LOGIN);
  };

  return (
    <aside className={`${styles.sidebar} ${isOpen ? styles.open : styles.closed}`}>
      <div className={styles.closeButtonWrapper}>
        <MdClose className={styles.closeIcon} onClick={onClose} />
      </div>

      <nav className={styles.nav}>
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            isActive ? `${styles.link} ${styles.active}` : styles.link
          }
        >
          <MdDashboard className={styles.icon} />
          Dashboard
        </NavLink>
        <NavLink
          to="/products"
          className={({ isActive }) =>
            isActive ? `${styles.link} ${styles.active}` : styles.link
          }
        >
          <MdInventory2 className={styles.icon} />
          Products
        </NavLink>
        <NavLink
          to="/orders"
          className={({ isActive }) =>
            isActive ? `${styles.link} ${styles.active}` : styles.link
          }
        >
          <MdShoppingCart className={styles.icon} />
          Orders
        </NavLink>
        <NavLink
          to="/users"
          className={({ isActive }) =>
            isActive ? `${styles.link} ${styles.active}` : styles.link
          }
        >
          <MdPeople className={styles.icon} />
          Users
        </NavLink>

        <button onClick={handleLogout} className={styles.link}>
          <MdLogout className={styles.icon} />
          Logout
        </button>
      </nav>
    </aside>
  );
};

export default Sidebar;
