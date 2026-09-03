import { useState } from "react";
import { useNavigate } from "react-router-dom";
import P from "../theme/colors";
import PageBackground from "../components/PageBackground";

export default function VendorForgotPassword() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail) {
      setError("Please enter your email address.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:3000/api/vendor/forgot-password",
                // "http://213.210.21.49:3001/api/vendor/forgot-password",

        // VPSCHANGE:
        // "/api/vendor/forgot-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: normalizedEmail,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            data.error ||
            "Unable to process password reset request."
        );
      }

      setMessage(
        data.message ||
          "If the email exists, a password reset code has been sent."
      );

      /*
       * Store vendor email separately from user
       * password reset flow.
       */
      sessionStorage.setItem(
        "vendorPasswordResetEmail",
        normalizedEmail
      );

      /*
       * Give the user a moment to see the success
       * message before moving to the OTP page.
       */
      setTimeout(() => {
        navigate("/vendor/reset-password");
      }, 1500);
    } catch (err) {
      setError(
        err.message ||
          "Unable to process password reset request."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageBackground>
      <div
        style={{
          minHeight: "100vh",
          width: "100%",
          padding: "20px",
          paddingBottom: 110,
          boxSizing: "border-box",
          fontFamily: "'Inter', sans-serif",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: 420,
          }}
        >
          {/* HEADER CARD */}
          <div
            style={{
              background: P.profileGradient,
              border: `4px solid ${P.borderOld}`,
              borderRadius: 24,
              padding: "30px 24px",
              boxSizing: "border-box",
              textAlign: "center",
              boxShadow:
                "0 10px 30px rgba(0,0,0,0.12)",
              marginBottom: 20,
            }}
          >
            {/* LOCK ICON */}
            <div
              style={{
                width: 72,
                height: 72,
                borderRadius: "50%",
                background: P.surface,
                margin: "0 auto 16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow:
                  "0 8px 24px rgba(0,0,0,0.18)",
              }}
            >
              <svg
                width="34"
                height="34"
                viewBox="0 0 24 24"
                fill="none"
                stroke={P.textAmberBright}
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect
                  x="4"
                  y="10"
                  width="16"
                  height="11"
                  rx="2"
                />

                <path d="M8 10V7a4 4 0 0 1 8 0v3" />

                <circle
                  cx="12"
                  cy="15"
                  r="1"
                />
              </svg>
            </div>

            <div
              style={{
                fontSize: 25,
                fontWeight: 800,
                color: P.surface,
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              Forgot Password?
            </div>

            <div
              style={{
                marginTop: 8,
                fontSize: 13,
                lineHeight: 1.5,
                color:
                  "rgba(255,255,255,0.82)",
              }}
            >
              Enter your registered vendor email
              address and we'll send you a
              verification code.
            </div>
          </div>

          {/* FORM CARD */}
          <div
            style={{
              background: P.surface,
              borderRadius: 22,
              border: `1px solid ${P.border}`,
              boxShadow: P.shadowCard,
              padding: "24px 20px",
              boxSizing: "border-box",
            }}
          >
            <form onSubmit={handleSubmit}>
              {/* EMAIL */}
              <div
                style={{
                  marginBottom: 18,
                }}
              >
                <label
                  style={{
                    display: "block",
                    fontSize: 12,
                    fontWeight: 700,
                    color: P.textSecond,
                    marginBottom: 7,
                    fontFamily:
                      "'Inter', sans-serif",
                  }}
                >
                  VENDOR EMAIL ADDRESS
                </label>

                <div
                  style={{
                    position: "relative",
                  }}
                >
                  {/* EMAIL ICON */}
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke={P.textAmber}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{
                      position: "absolute",
                      left: 14,
                      top: "50%",
                      transform:
                        "translateY(-50%)",
                      pointerEvents: "none",
                    }}
                  >
                    <rect
                      x="3"
                      y="5"
                      width="18"
                      height="14"
                      rx="2"
                    />

                    <polyline points="3 7 12 13 21 7" />
                  </svg>

                  <input
                    type="email"
                    value={email}
                    onChange={(e) =>
                      setEmail(e.target.value)
                    }
                    placeholder="Enter your vendor email"
                    autoComplete="email"
                    required
                    disabled={loading}
                    style={{
                      width: "100%",
                      height: 50,
                      padding:
                        "0 14px 0 44px",
                      boxSizing: "border-box",
                      borderRadius: 12,
                      border: `1px solid ${P.border}`,
                      background:
                        P.surfaceWarm,
                      color: P.textPrimary,
                      fontSize: 14,
                      fontFamily:
                        "'Inter', sans-serif",
                      outline: "none",
                    }}
                  />
                </div>
              </div>

              {/* ERROR */}
              {error && (
                <div
                  style={{
                    padding: "11px 13px",
                    marginBottom: 14,
                    borderRadius: 10,
                    background:
                      "rgba(220, 38, 38, 0.08)",
                    border:
                      "1px solid rgba(220, 38, 38, 0.18)",
                    color: "#DC2626",
                    fontSize: 13,
                    lineHeight: 1.4,
                  }}
                >
                  {error}
                </div>
              )}

              {/* SUCCESS */}
              {message && (
                <div
                  style={{
                    padding: "11px 13px",
                    marginBottom: 14,
                    borderRadius: 10,
                    background:
                      "rgba(22, 163, 74, 0.08)",
                    border:
                      "1px solid rgba(22, 163, 74, 0.18)",
                    color: "#16A34A",
                    fontSize: 13,
                    lineHeight: 1.4,
                  }}
                >
                  {message}
                </div>
              )}

              {/* SEND BUTTON */}
              <button
                type="submit"
                disabled={loading}
                style={{
                  width: "100%",
                  minHeight: 50,
                  padding: "14px 16px",
                  borderRadius: 12,
                  border: `1px solid ${P.borderAmber}`,
                  background: P.surfaceWarm,
                  color: P.textAmberBright,
                  fontSize: 15,
                  fontWeight: 700,
                  fontFamily:
                    "'DM Sans', sans-serif",
                  cursor: loading
                    ? "not-allowed"
                    : "pointer",
                  opacity: loading ? 0.7 : 1,
                  boxSizing: "border-box",
                }}
              >
                {loading
                  ? "Sending..."
                  : "Send Reset Code"}
              </button>
            </form>
          </div>

          {/* BACK TO VENDOR LOGIN */}
          <div
            style={{
              position: "fixed",
              left: 35,
              bottom:
                "calc(36px + env(safe-area-inset-bottom))",
              zIndex: 1000,
            }}
          >
            <button
              type="button"
              onClick={() => navigate("/vendor-login")}
              aria-label="Back to vendor login"
              style={{
                width: 44,
                height: 44,
                borderRadius: "50%",

                border: `1px solid ${P.border}`,
                background: P.surface,

                display: "flex",
                alignItems: "center",
                justifyContent: "center",

                padding: 0,
                cursor: "pointer",

                color: P.textSecond,
                fontSize: 22,
                fontWeight: 500,
                lineHeight: 1,
                fontFamily:
                  "'Inter', sans-serif",

                boxShadow:
                  "0 4px 14px rgba(0, 0, 0, 0.16)",

                WebkitTapHighlightColor:
                  "transparent",
              }}
            >
              ←
            </button>
          </div>
        </div>
      </div>
    </PageBackground>
  );
}