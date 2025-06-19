import React, { useState } from "react";
import styles from "./OrderStatusModal.module.css";

interface OrderStatusModalProps {
  orderId: string;
  currentStatus: string;
  onClose: () => void;
}

const OrderStatusModal: React.FC<OrderStatusModalProps> = ({
  currentStatus,
  onClose,
}) => {
  const [status, setStatus] = useState(currentStatus);

  const handleUpdate = () => {
    onClose();
  };

  return (
    <div className={styles.backdrop}>
      <div className={styles.modal}>
        <h2>Update Order Status</h2>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className={styles.select}
        >
          <option value="Pending">Pending</option>
          <option value="Processing">Processing</option>
          <option value="Delivered">Delivered</option>
          <option value="Cancelled">Cancelled</option>
        </select>
        <div className={styles.actions}>
          <button className={styles.cancelBtn} onClick={onClose}>Cancel</button>
          <button className={styles.updateBtn} onClick={handleUpdate}>Update</button>
        </div>
      </div>
    </div>
  );
};

export default OrderStatusModal;
