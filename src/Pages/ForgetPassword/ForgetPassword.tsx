import React, { useState } from "react";
import styles from "./ForgetPassword.module.css";
import { AuthAPI } from "../../API/AuthAPI";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { ROUTES } from "../../Constants/Routes";

const ForgotPassword: React.FC = () => {
  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState("bansalakshit0460@gmail.com");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await AuthAPI.sendOtp({ email });
      setResetToken(res.data.resetToken);
      setStep(2);
      toast.success("OTP sent to your email.");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await AuthAPI.resetPassword({ otp, newPassword, token: resetToken });
      toast.success("Password reset successful. Please login.");
      navigate(ROUTES.LOGIN);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <form
        className={styles.form}
        onSubmit={step === 1 ? handleSendOtp : handleResetPassword}
      >
        <h2 className={styles.title}>
          {step === 1 ? "Forgot Password" : "Reset Password"}
        </h2>

        {step === 1 && (
          <div className={styles.formGroup}>
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              required
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        )}

        {step === 2 && (
          <>
            <div className={styles.formGroup}>
              <label htmlFor="otp">OTP</label>
              <input
                id="otp"
                type="text"
                maxLength={6}
                placeholder="6-digit OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="newPassword">New Password</label>
              <input
                id="newPassword"
                type="password"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>
          </>
        )}

        <button type="submit" className={styles.button} disabled={loading}>
          {loading
            ? "Processing..."
            : step === 1
            ? "Send OTP"
            : "Reset Password"}
        </button>

        <button
          type="button"
          className={styles.backButton}
          onClick={() => navigate(ROUTES.LOGIN)}
        >
          Back to Login
        </button>
      </form>
    </div>
  );
};

export default ForgotPassword;
