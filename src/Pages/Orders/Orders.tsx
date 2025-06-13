import React, { useEffect, useState } from "react";
import styles from "./Order.module.css";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../Redux/Store";
import { fetchOrders } from "../../Redux/Slices/OrderSlice";
import type { Order } from "../../Interface/Order";
import Loader from "../../Components/Loader/Loader";

const Orders: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { orders, loading, error } = useSelector((state: RootState) => state.orders);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  const filteredOrders = orders.filter(
    (order) =>
      order.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={styles.container}>
      <h2>Order Management</h2>

      <input
        type="text"
        placeholder="Search by Order ID or Status"
        className={styles.searchInput}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {loading && <Loader />}
      {error && <p className={styles.error}>{error}</p>}

      {!loading && !error && (
        <table className={styles.orderTable}>
          <thead>
            <tr>
              <th>ID</th>
              <th>User</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Created At</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order: Order) => (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>{order.user.name}</td>
                  <td>₹{order.totalAmount}</td>
                  <td>{order.status}</td>
                  <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5}>No orders found</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Orders;
