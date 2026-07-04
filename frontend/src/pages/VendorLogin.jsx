import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ErrorMessage from "../components/ErrorMessage";
import P from "../theme/colors";
import PasswordInput from "../components/PasswordInput";
import logo from "../assets/logo.png";


export default function VendorLogin() {

  const navigate = useNavigate();

  const [mode, setMode] = useState("login");

  const [name, setName] = useState("");

  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");

  const [confirmPassword,
    setConfirmPassword] = useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleLogin = async (e) => {

    e.preventDefault();

    try {

      setLoading(true);
      setError("");

      const res = await fetch(
        // "http://localhost:3000/api/vendor/login",
        "/api/vendor/login",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json"
          },
          body: JSON.stringify({
            login,
            password
          })
        }
      );

      const data =
        await res.json();

      if (!res.ok) {

        setError(
          data.error ||
          "Login failed"
        );

        return;
      }

      localStorage.setItem(
        "vendorToken",
        data.token
      );

      localStorage.setItem(
  "loginType",
  "vendor"
);

      localStorage.setItem(
        "vendorId",
        data.vendor.id
      );

      localStorage.setItem(
        "vendorName",
        data.vendor.name
      );

      localStorage.setItem(
        "vendorEmail",
        data.vendor.email
      );

      navigate("/devices");

    } catch {

      setError("Server error");

    } finally {

      setLoading(false);
    }
  };

  const handleSignup = async (e) => {
  e.preventDefault();

  if (password !== confirmPassword) {
    setError("Passwords do not match");
    return;
  }

  try {
    setLoading(true);
    setError("");

    // Register
    const res = await fetch(
      // "http://localhost:3000/api/vendor/register",
            "/api/vendor/register", 
 
      {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, phone, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Registration failed");
      return;
    }

    // Auto-login after successful registration
    setMode("login");
    setName("");
    setEmail("");
    setPhone("");
    setPassword("");
    setConfirmPassword("");
    setError("");
    setSuccess("Registration submitted! Please wait for admin approval before logging in.");

  } catch {
    setError("Server error");
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
        fontFamily:
          "'Segoe UI', sans-serif",
      }}
    >

      <div
        style={{
          width: "95%",
          maxWidth: 460,
          padding: "55px 42px",
          background:
            "rgba(255,255,255,0.75)",
          backdropFilter:
            "blur(20px)",
          borderRadius: 28,
          border:
            "1px solid rgba(255,184,77,0.12)",
          boxShadow:
            "0 18px 45px rgba(255,184,77,0.12)",
        }}
      >

{/* BRAND */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: 14,
          }}
        >
          <img
            src={logo}
            alt="Logo"
            style={{
              width: 400,
              height: 120,
              objectFit: "contain",
            }}
          />
        </div>

        <ErrorMessage message={error} />
        {success && (
          <div
            style={{
              background: "#DCFCE7",
              border: "1px solid #BBF7D0",
              color: "#166534",
              padding: "10px 14px",
              borderRadius: 8,
              marginBottom: 20,
              fontSize: 13,
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#166534" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            {success}
          </div>
        )}

        <div
          style={{
            textAlign: "center",
            fontSize: 20,
            fontWeight: 600,
            marginBottom: 10
          }}
        >
          {
            mode === "login"
              ? "Login"
              : "Registration"
          }
        </div>

        {mode === "login" ? (

          <form onSubmit={handleLogin}>

            <input
              type="text"
              placeholder="Email or Phone Number"
              value={login}
              onChange={(e) =>
                setLogin(
                  e.target.value
                )
              }
              required
              style={inputStyle}
            />

           <div style={{ marginBottom: 14 }}>
            <PasswordInput
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
              inputStyle={inputStyle}
            />
          </div>

            <button
              type="submit"
              disabled={loading}
              style={buttonStyle}
            >
              {loading ? "Logging In..." : "Login"}
            </button>

            <p
              style={{
                textAlign: "center"
              }}
            >
              Don't have an account?{" "}

              <span
                style={{
                  color: P.blueAccent,
                  cursor: "pointer"
                }}
                onClick={() => { setMode("signup"); setSuccess(""); setError(""); }}
              >
                Sign Up
              </span>
            </p>

          </form>

        ) : (

          <form onSubmit={handleSignup}>

            <input
              type="text"
              placeholder="Vendor Name"
              value={name}
              onChange={(e) =>
                setName(
                  e.target.value
                )
              }
              required
              style={inputStyle}
            />

            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) =>
                setEmail(
                  e.target.value
                )
              }
              required
              style={inputStyle}
            />

            <input
              type="text"
              placeholder="Phone"
              value={phone}
              onChange={(e) =>
                setPhone(
                  e.target.value
                )
              }
              required
              style={inputStyle}
            />

          <div style={{ marginTop: 14, marginBottom: 14 }}>
            <PasswordInput
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              autoComplete="new-password"
              required
              inputStyle={inputStyle}
            />
          </div>

          <div style={{ marginTop: 14, marginBottom: 14 }}>
            <PasswordInput
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm Password"
              autoComplete="new-password"
              required
              inputStyle={inputStyle}
            />
          </div>

            <button
              type="submit"
              disabled={loading}
              style={buttonStyle}
            >
              {
                loading
                  ? "Creating..."
                  : "Create Account"
              }
            </button>

            <p
              style={{
                textAlign: "center"
              }}
            >
              Already have an account?{" "}

              <span
                style={{
                  color: P.blueAccent,
                  cursor: "pointer"
                }}
                onClick={() => { setMode("login"); setSuccess(""); setError(""); }}
              >
                Login
              </span>
            </p>

          </form>
        )}

      </div>

    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "14px 16px",
  marginBottom: 14,
  border: "none",
  background: P.surfaceLight,
  borderRadius: 8,
  boxSizing: "border-box"
};

const buttonStyle = {
  width: "100%",
  padding: 14,

  background:
    `linear-gradient(135deg, ${P.amber}, ${P.orange})`,

  border: "none",

  color: P.surface,

  fontWeight: 700,

  borderRadius: 8,

  cursor: "pointer",

  marginBottom: 20
};