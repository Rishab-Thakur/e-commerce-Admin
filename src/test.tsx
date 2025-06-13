import React from "react";
import styles from "../styles/Dashboard.module.css";
import { useAuth } from "./Context/AuthContext";

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className={styles.dashboard}>
      <h2 className={styles.title}>Welcome back, {user?.name || "Admin"}!</h2>

      <div className={styles.cards}>
        <div className={styles.card}>
          <h3>Total Products</h3>
          <p>158</p>
        </div>

        <div className={styles.card}>
          <h3>Total Orders</h3>
          <p>342</p>
        </div>

        <div className={styles.card}>
          <h3>Total Users</h3>
          <p>85</p>
        </div>

        <div className={styles.card}>
          <h3>Total Revenue</h3>
          <p>₹1,82,000</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
