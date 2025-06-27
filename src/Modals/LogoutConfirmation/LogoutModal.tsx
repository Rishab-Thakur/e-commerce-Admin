import React from 'react';
import { LogOut, X } from 'lucide-react';
import styles from './LogoutModal.module.css';

interface LogoutModalProps {
  isOpen: boolean;
  isLoggingOut: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const LogoutModal: React.FC<LogoutModalProps> = ({
  isOpen,
  isLoggingOut,
  onConfirm,
  onCancel
}) => {
  if (!isOpen) return null;

  return (
    <div
      className={styles.modalOverlay}
      onClick={(e) => e.target === e.currentTarget && onCancel()}
      onKeyDown={(e) => e.key === 'Escape' && onCancel()}
      tabIndex={-1}
    >
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <div className={styles.iconContainer}>
            <LogOut size={24} className={styles.logoutIcon} />
          </div>
          <button
            className={styles.closeButton}
            onClick={onCancel}
            disabled={isLoggingOut}
          >
            <X size={20} />
          </button>
        </div>

        <div className={styles.modalBody}>
          <h2 className={styles.title}>Confirm Logout</h2>
          <p className={styles.message}>
            Are you sure you want to log out? You'll need to sign in again to access your account.
          </p>
        </div>

        <div className={styles.modalFooter}>
          <button
            className={styles.cancelButton}
            onClick={onCancel}
            disabled={isLoggingOut}
          >
            Cancel
          </button>
          <button
            className={styles.confirmButton}
            onClick={onConfirm}
            disabled={isLoggingOut}
          >
            {isLoggingOut ? (
              <>
                <div className={styles.spinner}></div> Logging out...
              </>
            ) : (
              'Yes, Log out'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogoutModal;