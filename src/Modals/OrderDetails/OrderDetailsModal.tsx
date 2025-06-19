import React from "react";
import styles from "./OrderDetailsModal.module.css";

interface OrderDetailsModalProps {
  order: any;
  onClose: () => void;
}

const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({ order, onClose }) => {
  return (
    <div className={styles.backdrop}>
      <div className={styles.modal}>
        <h2>Order Details</h2>
        <p><strong>ID:</strong> {order.id}</p>
        <p><strong>Customer:</strong> {order.customer}</p>
        <p><strong>Email:</strong> {order.email}</p>
        <p><strong>Total:</strong> ₹{order.total}</p>
        <p><strong>Status:</strong> {order.status}</p>
        <p><strong>Items:</strong> {order.items}</p>
        <p><strong>Date:</strong> {order.date}</p>
        <button className={styles.closeBtn} onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default OrderDetailsModal;
