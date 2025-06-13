import React, { useEffect } from "react";
import styles from "./Dashboard.module.css";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../Redux/Store";
import { fetchDashboardStats } from "../../Redux/Slices/DashboardSlice";
import Loader from "../../Components/Loader/Loader"

const Dashboard: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  const {
    totalOrders,
    totalProducts,
    totalUsers,
    totalRevenue,
    loading,
    error,
  } = useSelector((state: RootState) => state.dashboard);  

  useEffect(() => {
    dispatch(fetchDashboardStats());
  }, [dispatch]);

  // if (loading) return <Loader text={"Loading Data..."} />;
  // if (error) return <div className={styles.error}>{error}</div>;

  return (
    loading ? <Loader text={"Loading Data..."} /> : error ? <div className={styles.error}>{error}</div> :
      <div className={styles.dashboard}>
        <h1>Admin Dashboard</h1>
        <div className={styles.cards}>
          <div className={styles.card}>
            <h3>Products</h3>
            <p>{totalProducts}</p>
          </div>
          <div className={styles.card}>
            <h3>Orders</h3>
            <p>{totalOrders}</p>
          </div>
          <div className={styles.card}>
            <h3>Users</h3>
            <p>{totalUsers}</p>
          </div>
          <div className={styles.card}>
            <h3>Revenue</h3>
            <p>₹{totalRevenue}</p>
          </div>
        </div>
      </div>
  );
};

export default Dashboard;
