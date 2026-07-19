import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ErrorMessage from "../components/ErrorMessage";
import ImeiInput from "../components/ImeiInput";
import P from "../theme/colors";
import PasswordInput from "../components/PasswordInput";
import logo from "../assets/logo.png";


export default function Login() {
  const navigate = useNavigate();
  const [mode, setMode] = useState("login");

  // Login fields
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");

  // Setup device fields
  const [imei, setImei] = useState("");
  //const [serialNumber, setSerialNumber] = useState("");
  const [clientName, setClientName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [setupPassword, setSetupPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  // const [role, setRole] = useState("viewer");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      // navigate("/");
      navigate("/");
    }
  }, [navigate]);

  const loginUser = (data) => {
  localStorage.setItem("token", data.token);
  localStorage.setItem("loginType", "user");
  localStorage.setItem("imei", data.user.imei);
  localStorage.setItem("username", data.user.name);
  localStorage.setItem("email", data.user.email);
  localStorage.setItem("phone", data.user.phone);

    setLoading(false);


  navigate("/");
};

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(
        // "http://localhost:3000/api/auth/login",
                "/api/auth/login",

        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            identifier,
            password,
          }),
        }
      );

      const data =
        await res.json();

      if (!res.ok) {
        setError(
          data.error ||
          "Login failed"
        );

        setLoading(false);
        return;
      }


      // SAVE USER DATA
      console.log("👤 User data from response:", data.user);
      loginUser(data);

    } catch (err) {

      console.log(err);

      setError(
        "Server error"
      );

      setLoading(false);
    }
  };

  const handleSetupDevice = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (setupPassword !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

if (!/^\d{15}$/.test(imei)) {
      setError("IMEI must be exactly 15 digits with no letters or symbols");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(
        // "http://localhost:3000/api/auth/setup-device",
        "/api/auth/setup-device",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            //serial_number: serialNumber,
            imei,
            name: clientName,
            phone,
            email,
            password: setupPassword,
            confirm_password: confirmPassword,
            //role,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Setup failed");
        setLoading(false);
        return;
      }

      setMode("login");
      setError("");
      setSuccess("Device setup successful! Please login.");

// Signup successful, now automatically login

const loginRes = await fetch(
  // "http://localhost:3000/api/auth/login",
  "/api/auth/login",
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      identifier: email,
      password: setupPassword,
    }),
  }
);

const loginData = await loginRes.json();

if (!loginRes.ok) {
  setError(loginData.error || "Automatic login failed");
  setLoading(false);
  return;
}

loginUser(loginData);



    } catch (err) {
      console.log(err);
      setError("Server error");
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        background: P.bgGradient,
        fontFamily: "'Inter', sans-serif",
        padding: "24px 16px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 400,
          padding: "36px 28px 32px",
          background: P.surface,
          borderRadius: 24,
          border: `1px solid ${P.border}`,
          boxShadow: `P.shadowCardLg, ${P.shadowCard}`,
        }}
      >
        {/* HEADING */}
        {/* <h1
          style={{
            fontSize: 28,
            fontWeight: 600,
            color: "#333",
            marginBottom: 35,
            letterSpacing: "-0.5px",
            textAlign: "center",
          }}
        >
          {mode === "login" ? "Login" : "Register Device"}
        </h1> */}


        {/* BRAND HEADER */}
        <div
          style={{
            background: P.surfaceFaded,
            borderRadius: 16,
            padding: "20px 16px",
            marginBottom: 24,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <img
            src={logo}
            alt="Logo"
            style={{
              width: 120,
              height: 72,
              objectFit: "contain",
            }}
          />
        </div>

        {/* PAGE MODE */}
        <div
          style={{
            fontSize: 22,
            fontWeight: 700,
            color: P.textPrimary,
            marginBottom: 24,
            textAlign: "center",
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          {mode === "login" ? "User Login" : "User Registration"}
        </div>

{/* ERROR MESSAGE */}
        <ErrorMessage message={error} />
        {success && (
          <div
            style={{
              background: P.surfaceSuccess,
              border: `1px solid ${P.borderSuccess}`,
              color: P.textSuccessMsg,
              padding: "10px 14px",
              borderRadius: 8,
              marginBottom: 20,
              fontSize: 13,
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={P.textSuccessMsg} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            {success}
          </div>
        )}

        {/* LOGIN FORM */}
        {mode === "login" && (
          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: 12 }}>
              <input
                type="text"
                placeholder="Email"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                style={{
                  width: "100%",
                  padding: "15px 20px",
                  border: "none",
                  background: P.surfaceForm,
                  borderRadius: 10,
                  fontSize: 14,
                  fontFamily: "'Inter', sans-serif",
                  color: P.textPrimary,
                  boxSizing: "border-box",
                  outline: "none",
                }}
                required
              />
            </div>

            <div style={{ marginBottom: 20 }}>

    <PasswordInput
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    placeholder="Password"
    required
    inputStyle={{
        width: "100%",
        padding: "15px 20px",
        border: "none",
        background: P.surfaceForm,
        borderRadius: 10,
        fontSize: 14,
        fontFamily: "'Inter', sans-serif",
        color: P.textPrimary,
    }}
/>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                padding: "14px 16px",
                background: P.btnPrimary,
                border: "none",
                color: P.textWhite,
                fontSize: 15,
                fontWeight: 600,
                borderRadius: 50,
                cursor: loading ? "not-allowed" : "pointer",
                marginBottom: 18,
                opacity: loading ? 0.7 : 1,
                transition: "opacity 0.2s",
              }}
            >
              {loading ? "LOGGING IN..." : "LOG IN"}
            </button>

            {/* <div style={{ marginBottom: 24, textAlign: "center" }}>
              <a
                href="#"
                style={{
                  fontSize: 13,
                  color: "#999",
                  textDecoration: "none",
                }}
              >
                Forgot Password
              </a>
            </div> */}

            <div style={{ fontSize: 13, color: P.textHint, textAlign: "center", fontFamily: "'Inter', sans-serif" }}>
              Don't have an Account?{" "}
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setMode("signup");
                  setError("");
                  setSuccess("");
                }}
                style={{
                  color: P.amber,
                  textDecoration: "none",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Sign Up
              </a>
            </div>
          </form>
        )}

        {/* SIGN UP FORM */}
        {mode === "signup" && (
          <form onSubmit={handleSetupDevice}>
            <div style={{ marginBottom: 12 }}>
              <ImeiInput
                value={imei}
                onChange={(e) => setImei(e.target.value)}
                placeholder="IMEI Number"
                required
                inputStyle={{
                  width: "100%",
                  padding: "15px 20px",
                  border: "none",
                  background: P.surfaceForm,
                  borderRadius: 10,
                  fontSize: 14,
                  fontFamily: "'Inter', sans-serif",
                  color: P.textPrimary,
                  boxSizing: "border-box",
                  outline: "none",
                }}
              />
            </div>

            <div style={{ marginBottom: 12 }}>
              <input
                type="text"
                placeholder="Client Name"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                style={{
                  width: "100%",
                  padding: "15px 20px",
                  border: "none",
                  background: P.surfaceForm,
                  borderRadius: 10,
                  fontSize: 14,
                  fontFamily: "'Inter', sans-serif",
                  color: P.textPrimary,
                  boxSizing: "border-box",
                  outline: "none",
                }}
                required
              />
            </div>

            <div style={{ marginBottom: 12 }}>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: "100%",
                  padding: "15px 20px",
                  border: "none",
                  background: P.surfaceForm,
                  borderRadius: 10,
                  fontSize: 14,
                  fontFamily: "'Inter', sans-serif",
                  color: P.textPrimary,
                  boxSizing: "border-box",
                  outline: "none",
                }}
                required
              />
            </div>

            <div style={{ marginBottom: 12 }}>
              <input
                type="tel"
                placeholder="Phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                style={{
                  width: "100%",
                  padding: "15px 20px",
                  border: "none",
                  background: P.surfaceForm,
                  borderRadius: 10,
                  fontSize: 14,
                  fontFamily: "'Inter', sans-serif",
                  color: P.textPrimary,
                  boxSizing: "border-box",
                  outline: "none",
                }}
                required
              />
            </div>
{/* 
            <div className="form-group">
  <label>Role</label>
  <select
    value={role}
    onChange={(e) => setRole(e.target.value)}
    required
  >
    <option value="vendor">vendor</option>
    <option value="viewer">Viewer</option>
  </select>
</div> */}

            <div style={{ marginBottom: 20 }}>
              <PasswordInput
                value={setupPassword}
                onChange={(e) => setSetupPassword(e.target.value)}
                placeholder="Password"
                required
                inputStyle={{
                  width: "100%",
                  padding: "15px 20px",
                  border: "none",
                  background: P.surfaceForm,
                  borderRadius: 10,
                  fontSize: 14,
                  fontFamily: "'Inter', sans-serif",
                  color: P.textPrimary,
                }}
              />
            </div>

              <div style={{ marginBottom: 20 }}>
  <PasswordInput
    value={confirmPassword}
    onChange={(e) => setConfirmPassword(e.target.value)}
    placeholder="Confirm Password"
    required
    inputStyle={{
      width: "100%",
      padding: "15px 20px",
      border: "none",
      background: P.surfaceForm,
      borderRadius: 10,
      fontSize: 14,
      fontFamily: "'Inter', sans-serif",
      color: P.textPrimary,
    }}
  />
</div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                padding: "15px 16px",
                background: P.btnPrimary,
                border: "none",
                color: P.textWhite,
                fontSize: 16,
                fontWeight: 700,
                borderRadius: 50,
                cursor: loading ? "not-allowed" : "pointer",
                marginBottom: 16,
                opacity: loading ? 0.7 : 1,
                transition: "opacity 0.2s",
                boxShadow: P.shadowBtn,
                fontFamily: "'DM Sans', sans-serif",
                letterSpacing: 0.3,
              }}
            >
              {loading ? "Signing up..." : "Sign Up"}
            </button>

            <div style={{ fontSize: 13, color: P.textHint, textAlign: "center", fontFamily: "'Inter', sans-serif" }}>
              Already have an account?{" "}
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setMode("login");
                  setError("");
                }}
                style={{
                  color: P.amber,
                  textDecoration: "none",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Login here
              </a>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}