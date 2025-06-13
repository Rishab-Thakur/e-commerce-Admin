import React from "react";
import AppRoutes from "./Routes/AppRoutes/AppRoutes";
import { ToastContainer } from "react-toastify";
import styles from "./App.module.css";
import "react-toastify/dist/ReactToastify.css";

const App: React.FC = () => {
  return (
    <div className={styles.appContainer}>
      <ToastContainer position="top-right" autoClose={3000} />
      <AppRoutes />
    </div>
  );
};

export default App;
