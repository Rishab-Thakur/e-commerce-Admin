import React, { useState, useRef, useEffect } from "react";
import styles from "./ActionModal.module.css";
import { MoreVertical } from "lucide-react";

export interface MenuOption {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
}

interface Props {
  actions: MenuOption[];
}

const ActionModal: React.FC<Props> = ({ actions }) => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => setOpen((prev) => !prev);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={styles.dropdown} ref={menuRef}>
      <button className={styles.iconButton} onClick={toggleMenu} aria-label="Actions">
        <MoreVertical size={18} color="#004d40" />
      </button>

      {open && (
        <div className={styles.menu}>
          {actions.map((action, idx) => (
            <button key={idx} onClick={() => { action.onClick(); setOpen(false); }}>
              {action.icon}
              {action.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ActionModal;
