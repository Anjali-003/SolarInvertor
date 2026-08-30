import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import P from "../theme/colors";
import logo from "../assets/logo.png";

export default function VerifyEmail() {

  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email || "";

  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerify = async (e) => {

    e.preventDefault();

    setError("");
    setSuccess("");

    if (!email) {
      setError("Email information is missing. Please register again.");
      return;
    }

    if (!/^\d{6}$/.test(otp)) {
      setError("Please enter the 6-digit verification code.");
      return;
    }

    setLoading(true);

    try {

      const res = await fetch(
        // "http://localhost:3000/api/auth/verify-email",
        // VPSCHANGE
                "/api/auth/verify-email",

        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            otp,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {

        setError(
          data.message ||
          "Email verification failed"
        );

        setLoading(false);
        return;
      }

      setSuccess(
        "Email verified successfully. Redirecting to login..."
      );

      setTimeout(() => {
        navigate("/login");
      }, 1500);

    } catch (err) {

      console.error(err);

      setError(
        "Unable to connect to the server"
      );

    } finally {

      setLoading(false);

    }
  };


  const handleResend = async () => {

    setError("");
    setSuccess("");

    if (!email) {
      setError("Email information is missing.");
      return;
    }

    setLoading(true);

    try {

      const res = await fetch(
        // "http://localhost:3000/api/auth/resend-verification",
                "/api/auth/resend-verification",
                //VPSCHANGE

        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {

        setError(
          data.message ||
          "Failed to resend verification code"
        );

        return;
      }

      setSuccess(
        "A new verification code has been sent to your email."
      );

    } catch (err) {

      console.error(err);

      setError(
        "Unable to connect to the server"
      );

    } finally {

      setLoading(false);

    }
  };


  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: P.bgGradient,
        padding: "24px 16px",
        fontFamily: "'Inter', sans-serif",
      }}
    >

      <div
        style={{
          width: "95%",
          maxWidth: 400,
          padding: "36px 28px",
          background: P.surface,
          borderRadius: 24,
          border: `1px solid ${P.border}`,
          boxShadow: P.shadowCardLg,
        }}
      >

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: 25,
          }}
        >
          <img
            src={logo}
            alt="Logo"
            style={{
              width: 220,
              height: 90,
              objectFit: "contain",
            }}
          />
        </div>

        <h2
          style={{
            textAlign: "center",
            color: P.textPrimary,
            marginBottom: 10,
          }}
        >
          Verify Your Email
        </h2>

        <p
          style={{
            textAlign: "center",
            fontSize: 13,
            color: P.textHint,
            marginBottom: 24,
          }}
        >
          Enter the 6-digit verification code sent to
          <br />
          <strong>{email}</strong>
        </p>

        {error && (
          <div
            style={{
              color: "#c62828",
              background: "#ffebee",
              padding: 10,
              borderRadius: 10,
              marginBottom: 15,
              fontSize: 13,
            }}
          >
            {error}
          </div>
        )}

        {success && (
          <div
            style={{
              color: P.textSuccessMsg,
              background: P.surfaceSuccess,
              padding: 10,
              borderRadius: 10,
              marginBottom: 15,
              fontSize: 13,
            }}
          >
            {success}
          </div>
        )}

        <form onSubmit={handleVerify}>

          <input
            type="text"
            inputMode="numeric"
            maxLength={6}
            placeholder="Enter 6-digit code"
            value={otp}
            onChange={(e) =>
              setOtp(
                e.target.value.replace(/\D/g, "")
              )
            }
            style={{
              width: "100%",
              padding: "15px 20px",
              border: "none",
              background: P.surfaceForm,
              borderRadius: 10,
              boxSizing: "border-box",
              fontSize: 20,
              textAlign: "center",
              letterSpacing: 5,
              outline: "none",
            }}
          />

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "15px",
              marginTop: 15,
              background: P.btnPrimary,
              border: "none",
              color: P.textWhite,
              fontSize: 16,
              fontWeight: 700,
              borderRadius: 50,
              cursor: "pointer",
            }}
          >
            {loading
              ? "Verifying..."
              : "Verify Email"}
          </button>

        </form>

        <button
          onClick={handleResend}
          disabled={loading}
          style={{
            width: "100%",
            marginTop: 12,
            padding: "12px",
            background: "transparent",
            border: "none",
            color: P.textAmberBright,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Resend Verification Code
        </button>

        <button
          onClick={() => navigate("/login")}
          style={{
            width: "100%",
            background: "transparent",
            border: "none",
            color: P.textHint,
            cursor: "pointer",
            fontSize: 13,
          }}
        >
          Back to Login
        </button>

      </div>
    </div>
  );
}