import React, { useCallback, useState } from "react";
import styles from "./ForgetPassword.module.css";
import { AuthAPI } from "../../API/AuthAPI";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { ROUTES } from "../../Constants/Routes";
import { Lock, Mail, KeyRound, Eye, EyeOff, Loader2, Check, AlertCircle } from "lucide-react";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const ForgotPassword: React.FC = () => {
  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState("bansalakshit0460@gmail.com");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showSuccess, setShowSuccess] = useState(false);

  const navigate = useNavigate();


  function validateStep1() {
    const newErrors: Record<string, string> = {};
    if (!email) {
      newErrors.email = "Email is required.";
    } else if (!emailRegex.test(email)) {
      newErrors.email = "Please enter a valid email address.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function validateStep2() {
    const newErrors: Record<string, string> = {};
    if (!otp) {
      newErrors.otp = "OTP is required.";
    } else if (!/^\d{6}$/.test(otp)) {
      newErrors.otp = "OTP must be a 6-digit number.";
    }
    if (!newPassword) {
      newErrors.newPassword = "New password is required.";
    } else {
      if (newPassword.length < 8) {
        newErrors.newPassword = "Password must be at least 8 characters.";
      } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(newPassword)) {
        newErrors.newPassword =
          "Password must contain uppercase, lowercase, and a number.";
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  // --- Handlers ---
  const handleSendOtp = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setErrors({});
      if (!validateStep1()) return;
      setLoading(true);
      try {
        const res = await AuthAPI.sendOtp({ email });
        setResetToken(res.data.resetToken);
        setStep(2);
        setShowSuccess(true);
        toast.success("OTP sent to your email.");
        setTimeout(() => setShowSuccess(false), 2500);
      } catch (err: any) {
        setErrors({ general: err?.response?.data?.message || "Failed to send OTP" });
        toast.error(err?.response?.data?.message || "Failed to send OTP");
      } finally {
        setLoading(false);
      }
    },
    [email]
  );

  const handleResetPassword = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setErrors({});
      if (!validateStep2()) return;
      setLoading(true);
      try {
        await AuthAPI.resetPassword({ otp, newPassword, token: resetToken });
        toast.success("Password reset successful. Please login.");
        navigate(ROUTES.LOGIN);
      } catch (err: any) {
        setErrors({ general: err?.response?.data?.message || "Failed to reset password" });
        toast.error(err?.response?.data?.message || "Failed to reset password");
      } finally {
        setLoading(false);
      }
    },
    [otp, newPassword, resetToken, navigate]
  );

  return (
    <div className={styles.outerContainer}>
      <div className={styles.forgotPasswordContainer}>
        {showSuccess && (
          <div className={styles.successMessage}>
            <Check size={20} />
            <span>OTP sent to your email!</span>
          </div>
        )}

        <div className={styles.header}>
          <div className={styles.headerIcon}>
            <Lock size={32} />
          </div>
          <h2 className={styles.title}>
            {step === 1 ? "Forgot Password" : "Reset Password"}
          </h2>
          <p className={styles.subtitle}>
            {step === 1
              ? "Enter your email to receive a verification OTP."
              : "Enter the OTP sent to your email and set a new password."}
          </p>
        </div>

        <form
          className={styles.form}
          onSubmit={step === 1 ? handleSendOtp : handleResetPassword}
          autoComplete="off"
        >
          {step === 1 && (
            <div className={styles.formGroup}>
              <label htmlFor="email">Email Address</label>
              <div className={styles.inputRow}>
                <input
                  id="email"
                  type="email"
                  required
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={errors.email ? styles.error : ""}
                  disabled={loading}
                />
                <Mail size={18} style={{ position: "absolute", right: 10, color: "#888" }} />
              </div>
              {errors.email && (
                <div className={styles.errorMessage}>
                  <AlertCircle size={14} />
                  {errors.email}
                </div>
              )}
            </div>
          )}

          {step === 2 && (
            <>
              <div className={styles.formGroup}>
                <label htmlFor="otp">OTP</label>
                <div className={styles.inputRow}>
                  <input
                    id="otp"
                    type="number"
                    maxLength={6}
                    placeholder="6-digit OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                    className={errors.otp ? styles.error : ""}
                    disabled={loading}
                  />
                  <KeyRound size={18} style={{ position: "absolute", right: 10, color: "#888" }} />
                </div>
                {errors.otp && (
                  <div className={styles.errorMessage}>
                    <AlertCircle size={14} />
                    {errors.otp}
                  </div>
                )}
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="newPassword">New Password</label>
                <div className={styles.inputRow}>
                  <input
                    id="newPassword"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    className={errors.newPassword ? styles.error : ""}
                    disabled={loading}
                  />
                  <button
                    type="button"
                    className={styles.togglePassword}
                    onClick={() => setShowPassword((v) => !v)}
                    disabled={loading}
                    tabIndex={-1}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.newPassword && (
                  <div className={styles.errorMessage}>
                    <AlertCircle size={14} />
                    {errors.newPassword}
                  </div>
                )}
              </div>
            </>
          )}

          <button type="submit" className={styles.button} disabled={loading}>
            {loading ? (
              <>
                <Loader2 className={styles.loader} size={16} />
                &nbsp;Processing...
              </>
            ) : step === 1 ? "Send OTP" : "Reset Password"}
          </button>

          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <button
              type="button"
              className={styles.backButton}
              onClick={() => navigate(ROUTES.LOGIN)}
              disabled={loading}
            >
              Back to Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default React.memo(ForgotPassword);
