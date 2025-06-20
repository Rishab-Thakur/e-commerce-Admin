import React, { useState } from "react";
import styles from "./Order.module.css";
import OrderDetailsModal from "../../Modals/OrderDetails/OrderDetailsModal";
import OrderStatusModal from "../../Modals/OrderStatus/OrderStatusModal";
import Pagination from "../../Components/Pagination/Pagination";
import Loader from "../../Components/Loader/Loader";

const dummyOrders = [
  {
    id: "ORD001",
    customer: "Rishu Thakur",
    email: "rishu@gmail.com",
    total: 1999,
    status: "Pending",
    date: "2025-06-17",
    items: 3,
  },
  {
    id: "ORD002",
    customer: "Aditi Sharma",
    email: "aditi@gmail.com",
    total: 2899,
    status: "Delivered",
    date: "2025-06-15",
    items: 5,
  },
  {
    id: "ORD003",
    customer: "Manoj Yadav",
    email: "manoj@gmail.com",
    total: 999,
    status: "Cancelled",
    date: "2025-06-10",
    items: 1,
  },
];

const Orders: React.FC = () => {
  const [loading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [statusModalOrderId, setStatusModalOrderId] = useState<string | null>(
    null
  );
  const error = null;

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Orders</h2>

      {/* <div className={styles.controls}>
        <input
          type="text"
          placeholder="Search by Product Name"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={styles.searchInput}
        />
        <button onClick={handleSearchClick} className={styles.searchButton}>
          Search
        </button>
      </div> */}

      {loading ? (
        <Loader text="Loading Orders..." />
      ) : error ? (
        <p className={styles.error}>{error}</p>
      ) : (
        <>
          <table className={styles.orderTable}>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Email</th>
                <th>Total</th>
                <th>Status</th>
                <th>Date</th>
                <th>Items</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {dummyOrders?.map((order) => (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>{order.customer}</td>
                  <td>{order.email}</td>
                  <td>₹{order.total}</td>
                  <td>{order.status}</td>
                  <td>{order.date}</td>
                  <td>{order.items}</td>
                  <td className={styles.actions}>
                    <button
                      className={styles.view}
                      onClick={() => setSelectedOrder(order)}
                    >
                      View
                    </button>
                    <button
                      className={styles.update}
                      onClick={() => setStatusModalOrderId(order.id)}
                    >
                      Update Status
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <Pagination
            currentPage={currentPage}
            totalPages={1}
            onPageChange={(page) => setCurrentPage(page)}
          />

          {selectedOrder && (
            <OrderDetailsModal
              order={selectedOrder}
              onClose={() => setSelectedOrder(null)}
            />
          )}

          {statusModalOrderId && (
            <OrderStatusModal
              orderId={statusModalOrderId}
              onClose={() => setStatusModalOrderId(null)}
              currentStatus="Pending"
            />
          )}
        </>
      )}
    </div>
  );
};

export default Orders;
