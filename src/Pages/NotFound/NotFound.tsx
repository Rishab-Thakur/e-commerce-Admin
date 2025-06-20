import React, { useMemo } from "react";
import styles from "./NotFound.module.css";
import { Link } from "react-router-dom";
import { ROUTES } from "../../Constants/Routes";

const NotFound: React.FC = React.memo(() => {

  const content = useMemo(() => (
    <div className={styles.container}>
      <h1 className={styles.errorCode}>404</h1>
      <p className={styles.message}>Oops! The page you're looking for doesn't exist.</p>
      <Link to={ROUTES.DASHBOARD} className={styles.homeLink}>
        Go Back to Dashboard
      </Link>
    </div>
  ), []);

  return content;
});

export default NotFound;
