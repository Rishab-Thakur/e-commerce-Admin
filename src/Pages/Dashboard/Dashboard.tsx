import React, { useEffect } from "react";
import styles from "./Dashboard.module.css";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../Redux/Store";
import { fetchDashboardStats } from "../../Redux/Slices/DashboardSlice";
import Loader from "../../Components/Loader/Loader";

const Dashboard: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { accessToken, isAuthenticated } = useSelector((state: RootState) => state.auth);

//   useEffect(() => {
//   dispatch(fetchDashboardStats());
// }, [dispatch]);
  useEffect(() => {
    if (isAuthenticated && accessToken) {
      dispatch(fetchDashboardStats());
    }
  }, [dispatch, isAuthenticated]);

  const { totalOrders, totalProducts, totalUsers, totalRevenue, loading, error } = useSelector(
    (state: RootState) => state.dashboard
  );

  return (
    <div className={styles.dashboard}>
      {loading ? (
        <Loader text="Loading Dashboard..." />
      ) : error ? (
        <div className={styles.error}>{error}</div>
      ) : (
        <>
          <h1 className={styles.title}>Admin Dashboard</h1>
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
        </>
      )}
    </div>
  );
};

export default Dashboard;
