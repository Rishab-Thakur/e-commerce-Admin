import React from "react";
import { NavLink } from "react-router-dom";
import styles from "./Sidebar.module.css";
import {
  MdDashboard,
  MdInventory2,
  MdPeople,
  MdShoppingCart,
  MdClose,
  MdLogout,
} from "react-icons/md";
import { ROUTES } from "../../Constants/Routes";
import { IoMdKey } from "react-icons/io";

export interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onLogoutClick: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, onLogoutClick }) => {
  return (
    <aside className={`${styles.sidebar} ${isOpen ? styles.open : styles.closed}`}>
      <div className={styles.closeButtonWrapper}>
        <MdClose className={styles.closeIcon} onClick={onClose} />
      </div>

      <nav className={styles.nav}>
        <NavLink
          to={ROUTES.DASHBOARD}
          className={({ isActive }) =>
            isActive ? `${styles.link} ${styles.active}` : styles.link
          }
        >
          <MdDashboard className={styles.icon} />
          Dashboard
        </NavLink>

        <NavLink
          to={ROUTES.PRODUCTS}
          className={({ isActive }) =>
            isActive ? `${styles.link} ${styles.active}` : styles.link
          }
        >
          <MdInventory2 className={styles.icon} />
          Products
        </NavLink>

        <NavLink
          to={ROUTES.ORDERS}
          className={({ isActive }) =>
            isActive ? `${styles.link} ${styles.active}` : styles.link
          }
        >
          <MdShoppingCart className={styles.icon} />
          Orders
        </NavLink>

        <NavLink
          to={ROUTES.USERS}
          className={({ isActive }) =>
            isActive ? `${styles.link} ${styles.active}` : styles.link
          }
        >
          <MdPeople className={styles.icon} />
          Users
        </NavLink>

        <NavLink
          to={ROUTES.CHANGE_PASSWORD}
          className={({ isActive }) =>
            isActive ? `${styles.link} ${styles.active}` : styles.link
          }
        >
          <IoMdKey className={styles.icon} />
          Change Password
        </NavLink>

        <button onClick={onLogoutClick} className={styles.link}>
          <MdLogout className={styles.icon} />
          Logout
        </button>

      </nav>


    </aside>
  );
};

export default React.memo(Sidebar);
