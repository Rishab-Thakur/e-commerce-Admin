import React, { useEffect, useMemo } from "react";
import styles from "./Dashboard.module.css";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import type { AppDispatch, RootState } from "../../Redux/Store";
import { fetchDashboardStats } from "../../Redux/Slices/DashboardSlice";
import Loader from "../../Components/Loader/Loader";

const Dashboard: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { totalOrders, totalProducts, totalUsers, totalRevenue, loading, error } = useSelector(
    (state: RootState) => state.dashboard,
    shallowEqual
  );

  useEffect(() => {
    dispatch(fetchDashboardStats());
  }, [dispatch]);

  const cards = useMemo(
    () => [
      { title: "Products", value: totalProducts },
      { title: "Orders", value: totalOrders },
      { title: "Users", value: totalUsers },
      { title: "Revenue", value: `₹${totalRevenue}` },
    ],
    [totalOrders, totalProducts, totalUsers, totalRevenue]
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
            {cards.map((card, index) => (
              <div className={styles.card} key={index}>
                <h3>{card.title}</h3>
                <p>{card.value}</p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
