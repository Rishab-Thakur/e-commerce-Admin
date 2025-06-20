import React, { useCallback } from "react";
import styles from "./DeleteConfirm.module.css";
import { toast } from "react-toastify";

interface DeleteConfirmModalProps {
  isOpen: boolean;
  message: string;
  onCancel: () => void;
  onConfirm: () => Promise<void> | void;
}

const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  message,
  onCancel,
  onConfirm,
}) => {
  if (!isOpen) return null;

  const handleConfirm = useCallback(async () => {
    try {
      await onConfirm();
      toast.success("Deleted successfully.");
    } catch (error) {
      toast.error("Failed to delete. Please try again.");
    }
  }, [onConfirm]);

  return (
    <div className={styles.backdrop}>
      <div className={styles.modal}>
        <h2 className={styles.title}>Confirm Deletion</h2>
        <p className={styles.message}>{message}</p>
        <div className={styles.actions}>
          <button className={styles.cancelButton} onClick={onCancel}>
            Cancel
          </button>
          <button className={styles.confirmButton} onClick={handleConfirm}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default React.memo(DeleteConfirmModal);
