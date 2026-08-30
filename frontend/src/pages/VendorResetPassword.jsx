import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PasswordInput from "../components/PasswordInput";
import P from "../theme/colors";
import PageBackground from "../components/PageBackground";

export default function VendorResetPassword() {
  const navigate = useNavigate();

  const [email, setEmail] = useState(
    sessionStorage.getItem(
      "vendorPasswordResetEmail"
    ) || ""
  );

  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] =
    useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (!email.trim()) {
      setError(
        "Please enter your email address."
      );
      return;
    }

    if (!/^\d{6}$/.test(otp.trim())) {
      setError(
        "Verification code must be 6 digits."
      );
      return;
    }

    if (!newPassword) {
      setError(
        "Please enter a new password."
      );
      return;
    }

    if (
      newPassword !==
      confirmPassword
    ) {
      setError(
        "Passwords do not match."
      );
      return;
    }

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#]).{8,20}$/;

    if (
      !passwordRegex.test(newPassword)
    ) {
      setError(
        "Password must be 8-20 characters and contain uppercase, lowercase, number and special character."
      );
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:3000/api/vendor/reset-password",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            email: email
              .trim()
              .toLowerCase(),
            otp: otp.trim(),
            newPassword,
          }),
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            data.error ||
            "Unable to reset password."
        );
      }

      setMessage(
        data.message ||
          "Password reset successfully."
      );

      sessionStorage.removeItem(
        "vendorPasswordResetEmail"
      );

      /*
       * If an old vendor session exists,
       * remove it because password reset
       * invalidates vendor sessions.
       */

      localStorage.removeItem(
        "vendorToken"
      );

      localStorage.removeItem(
        "loginType"
      );

      localStorage.removeItem(
        "vendorId"
      );

      localStorage.removeItem(
        "vendorName"
      );

      localStorage.removeItem(
        "vendorEmail"
      );

      localStorage.removeItem(
        "vendorPhone"
      );

      localStorage.removeItem(
        "vendorRegisteredSince"
      );

      setTimeout(() => {
        navigate("/vendor-login");
      }, 1500);

    } catch (err) {
      console.error(err);

      setError(
        err.message ||
          "Unable to reset password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageBackground>
      <div
        style={{
          width: "100%",
          minHeight: "100vh",
          padding: "20px",
          paddingBottom: 110,
          boxSizing: "border-box",
          fontFamily:
            "'Inter', sans-serif",
          overflowX: "hidden",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: 420,
            margin: "0 auto",
          }}
        >
          {/* HEADER */}

          <div
            style={{
              marginBottom: 24,
            }}
          >
            <button
              type="button"
              onClick={() => navigate(-1)}
              style={{
                width: 42,
                height: 42,
                borderRadius: "50%",
                border: `1px solid ${P.border}`,
                background: P.surface,
                color: P.textSecond,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                fontSize: 22,
                boxShadow: P.shadowCard,
                marginBottom: 18,
              }}
            >
              ←
            </button>

            <div
              style={{
                fontSize: 25,
                fontWeight: 800,
                color: P.textWhite,
                fontFamily:
                  "'DM Sans', sans-serif",
                marginBottom: 6,
              }}
            >
              Vendor Reset Password
            </div>

            <div
              style={{
                fontSize: 13,
                lineHeight: 1.6,
                color: P.textWhite,
              }}
            >
              Verify your vendor account and
              create a new password.
            </div>
          </div>

          {/* CARD */}

          <div
            style={{
              width: "100%",
              background: P.surface,
              borderRadius: 22,
              border: `1px solid ${P.border}`,
              boxShadow: P.shadowCard,
              padding: "22px 20px",
              boxSizing: "border-box",
            }}
          >
            <form
              onSubmit={handleSubmit}
            >
              {/* EMAIL */}

              <div
                style={fieldContainer}
              >
                <label
                  style={labelStyle}
                >
                  Email Address
                </label>

                <input
                  type="email"
                  value={email}
                  onChange={(e) =>
                    setEmail(
                      e.target.value
                    )
                  }
                  placeholder="Enter your email"
                  autoComplete="email"
                  required
                  style={inputStyle}
                />
              </div>

              {/* OTP */}

              <div
                style={fieldContainer}
              >
                <label
                  style={labelStyle}
                >
                  Verification Code
                </label>

                <div
                  style={{
                    fontSize: 11,
                    color: P.textMuted,
                    marginBottom: 7,
                  }}
                >
                  Enter the 6-digit code sent
                  to your email.
                </div>

                <input
                  type="text"
                  value={otp}
                  onChange={(e) =>
                    setOtp(
                      e.target.value
                        .replace(/\D/g, "")
                        .slice(0, 6)
                    )
                  }
                  placeholder="Enter 6-digit code"
                  inputMode="numeric"
                  maxLength={6}
                  required
                  style={{
                    ...inputStyle,
                    letterSpacing: 4,
                    fontSize: 18,
                    fontWeight: 700,
                    textAlign: "center",
                  }}
                />
              </div>

              {/* NEW PASSWORD */}

              <div
                style={fieldContainer}
              >
                <label
                  style={labelStyle}
                >
                  New Password
                </label>

                <PasswordInput
                  value={newPassword}
                  onChange={(e) =>
                    setNewPassword(
                      e.target.value
                    )
                  }
                  placeholder="Enter new password"
                  required
                  autoComplete="new-password"
                />
              </div>

              {/* CONFIRM PASSWORD */}

              <div
                style={fieldContainer}
              >
                <label
                  style={labelStyle}
                >
                  Confirm Password
                </label>

                <PasswordInput
                  value={
                    confirmPassword
                  }
                  onChange={(e) =>
                    setConfirmPassword(
                      e.target.value
                    )
                  }
                  placeholder="Confirm new password"
                  required
                  autoComplete="new-password"
                />
              </div>

              {/* REQUIREMENTS */}

              <div
                style={{
                  background:
                    P.surfaceWarm,
                  border: `1px solid ${P.borderAmber}`,
                  borderRadius: 14,
                  padding: "14px",
                  marginBottom: 18,
                }}
              >
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color:
                      P.textAmberBright,
                    marginBottom: 8,
                  }}
                >
                  Password must contain
                </div>

                <div
                  style={
                    requirementStyle
                  }
                >
                  • 8–20 characters
                </div>

                <div
                  style={
                    requirementStyle
                  }
                >
                  • One uppercase letter
                </div>

                <div
                  style={
                    requirementStyle
                  }
                >
                  • One lowercase letter
                </div>

                <div
                  style={
                    requirementStyle
                  }
                >
                  • One number
                </div>

                <div
                  style={
                    requirementStyle
                  }
                >
                  • One special character
                </div>
              </div>

              {/* ERROR */}

              {error && (
                <div
                  style={{
                    padding:
                      "12px 14px",
                    borderRadius: 12,
                    background:
                      "#FFF1F1",
                    border:
                      "1px solid #FFD0D0",
                    color: "#C62828",
                    fontSize: 13,
                    fontWeight: 600,
                    marginBottom: 14,
                    lineHeight: 1.5,
                  }}
                >
                  {error}
                </div>
              )}

              {/* SUCCESS */}

              {message && (
                <div
                  style={{
                    padding:
                      "12px 14px",
                    borderRadius: 12,
                    background:
                      "#F0FFF4",
                    border:
                      "1px solid #B7E4C7",
                    color: "#237A3B",
                    fontSize: 13,
                    fontWeight: 600,
                    marginBottom: 14,
                    lineHeight: 1.5,
                  }}
                >
                  {message}
                </div>
              )}

              {/* BUTTON */}

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: "100%",
                  minHeight: 50,
                  padding:
                    "14px 16px",
                  borderRadius: 12,
                  border: `1px solid ${P.borderAmber}`,
                  background: loading
                    ? P.surfaceAmber
                    : P.surfaceWarm,
                  color:
                    P.textAmberBright,
                  fontSize: 15,
                  fontWeight: 700,
                  fontFamily:
                    "'DM Sans', sans-serif",
                  cursor: loading
                    ? "not-allowed"
                    : "pointer",
                  opacity: loading
                    ? 0.7
                    : 1,
                }}
              >
                {loading
                  ? "Resetting..."
                  : "Reset Password"}
              </button>
            </form>
          </div>

          {/* BACK */}

          <button
            type="button"
            onClick={() =>
              navigate("/vendor-login")
            }
            style={{
              width: "100%",
              marginTop: 16,
              padding: 12,
              background:
                "transparent",
              border: "none",
              color: P.textMuted,
              fontSize: 13,
              fontWeight: 600,
              fontFamily:
                "'Inter', sans-serif",
              cursor: "pointer",
            }}
          >
            ← Back to Vendor Login
          </button>
        </div>
      </div>
    </PageBackground>
  );
}

/* =========================================================
   STYLES
========================================================= */

const fieldContainer = {
  marginBottom: 18,
};

const labelStyle = {
  display: "block",
  fontSize: 12,
  fontWeight: 700,
  color: P.textSecond,
  marginBottom: 7,
  fontFamily: "'Inter', sans-serif",
};

const inputStyle = {
  width: "100%",
  minHeight: 48,
  padding: "12px 14px",
  boxSizing: "border-box",
  borderRadius: 12,
  border: `1px solid ${P.border}`,
  background: P.surface,
  color: P.textPrimary,
  fontSize: 14,
  fontFamily: "'Inter', sans-serif",
  outline: "none",
};

const requirementStyle = {
  fontSize: 11,
  color: P.textSecond,
  lineHeight: 1.7,
  fontFamily: "'Inter', sans-serif",
};