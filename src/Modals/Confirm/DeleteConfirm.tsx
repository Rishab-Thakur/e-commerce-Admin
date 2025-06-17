import React from "react";
import styles from "./DeleteConfirm.module.css";
import { toast } from "react-toastify";

interface DeleteConfirmModalProps {
  isOpen: boolean;
  message: string;
  onCancel: () => void;
  onConfirm: () => void;
}

const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  message,
  onCancel,
  onConfirm,
}) => {
  if (!isOpen) return null;

  const handleConfirm = () => {
    try {
      onConfirm();
      toast.success("Item deleted successfully.");
    } catch (error) {
      toast.error("Failed to delete. Please try again.");
    }
  };

  return (
    <div className={styles.backdrop}>
      <div className={styles.modal}>
        <h2 className={styles.title}>Confirm Deletion</h2>
        <p className={styles.message}>
          <strong>{message}</strong>
        </p>
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

export default DeleteConfirmModal;
