import React, { useState, useEffect, useCallback } from "react";
import styles from "./Login.module.css";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { clearError, loginUser } from "../../Redux/Slices/AuthSlice";
import { useNavigate } from "react-router-dom";
import type { AppDispatch, RootState } from "../../Redux/Store";
import { v4 as uuidv4 } from "uuid";
import { ROUTES } from "../../Constants/Routes";
import { Eye, EyeOff } from "lucide-react";

const Login: React.FC = () => {
  const [email, setEmail] = useState("bansalakshit0460@gmail.com");
  const [password, setPassword] = useState("123456789");
  const [deviceId, setDeviceId] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { loading, error } = useSelector(
    (state: RootState) => state.auth,
    shallowEqual
  );

  useEffect(() => {
    let id = localStorage.getItem("deviceId");
    if (!id) {
      id = uuidv4();
      localStorage.setItem("deviceId", id);
    }
    setDeviceId(id);
  }, []);

  const handleEmailChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    dispatch(clearError());
  }, [dispatch]);

  const handlePasswordChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    dispatch(clearError());
  }, [dispatch]);

  const handleLogin = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      const result = await dispatch(loginUser({ email, password, deviceId }));
      if (loginUser.fulfilled.match(result)) {
        navigate(ROUTES.DASHBOARD);
      }
    },
    [email, password, deviceId, dispatch, navigate]
  );

  return (
    <div className={styles.loginContainer}>
      <form className={styles.loginForm} onSubmit={handleLogin}>
        <h2 className={styles.title}>Admin Login</h2>

        <div className={styles.formGroup}>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            placeholder="admin@example.com"
            value={email}
            onChange={handleEmailChange}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="password">Password</label>
          <div className={styles.passwordWrapper}>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="********"
              value={password}
              onChange={handlePasswordChange}
              required
            />
            <button
              type="button"
              className={styles.togglePassword}
              onClick={() => setShowPassword((prev) => !prev)}
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {error && <p className={styles.error}>{error}</p>}

        <button type="submit" className={styles.loginButton} disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>

        <button
          type="button"
          className={styles.forgotButton}
          onClick={() => navigate(ROUTES.FORGOT_PASSWORD)}
        >
          Forgot Password
        </button>
      </form>
    </div>
  );
};

export default Login;
