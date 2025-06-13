import React, { useState } from "react";
import styles from "./Login.module.css";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../Redux/Slices/AuthSlice";
import { useNavigate } from "react-router-dom";
import type { AppDispatch, RootState } from "../../Redux/Store";

const Login: React.FC = () => {
  const [email, setEmail] = useState("mahi.rajput@appinventiv.com");
  const [password, setPassword] = useState("12345678");
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state: RootState) => state.auth);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const deviceId = navigator.userAgent;
    const result = await dispatch(loginUser({ email, password, deviceId }));
    if (loginUser.fulfilled.match(result)) {
      navigate("/dashboard");
    }
  };

  return (
    <div className={styles.loginContainer}>
      <form className={styles.loginForm} onSubmit={handleLogin}>
        <h2>Admin Login</h2>

        {error && <p className={styles.error}>{error}</p>}

        <div className={styles.formGroup}>
          <label>Email</label>
          <input
            type="email"
            placeholder="admin@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label>Password</label>
          <input
            type="password"
            placeholder="********"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" className={styles.loginButton} disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default Login;
