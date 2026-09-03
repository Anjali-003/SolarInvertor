import { useEffect, useState } from "react";
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
const [loginPassword, setLoginPassword] = useState("");

// Signup fields
const [signupPassword, setSignupPassword] = useState("");
const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const resetForm = () => {
  // Login fields
  setLogin("");
  setLoginPassword("");

  // Signup fields
  setName("");
  setEmail("");
  setPhone("");
  setSignupPassword("");
  setConfirmPassword("");

  // Messages
  setError("");
  setSuccess("");
};

useEffect(() => {
  resetForm();
}, []);

  const handleLogin = async (e) => {

    e.preventDefault();

    try {

      setLoading(true);
      setError("");

      const res = await fetch(
        "http://localhost:3000/api/vendor/login",
                // "http://213.210.21.49:3001/api/vendor/login",

        //VPSCHANGE
        // "/api/vendor/login",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json"
          },
          body: JSON.stringify({
            login,
            password: loginPassword
          })
        }
      );

      const data =
        await res.json();
        

      // if (!res.ok) {

      //   setError(
      //     data.error ||
      //     "Login failed"
      //   );

      //   return;
      // }


      if (!res.ok) {
  if (data.requiresEmailVerification) {
    const verificationEmail =
      data.email || login;

    sessionStorage.setItem(
      "vendorVerificationEmail",
      verificationEmail
    );

    navigate("/vendor/verify-email", {
      state: {
        email: verificationEmail,
      },
    });

    return;
  }

  setError(data.error || "Login failed");
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

      localStorage.setItem(
"vendorPhone",
data.vendor.phone
);

localStorage.setItem(
"vendorRegisteredSince",
    data.vendor.created_at
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

  if (signupPassword !== confirmPassword) {
    setError("Passwords do not match");
    return;
  }

  try {
    setLoading(true);
    setError("");

    // Register
    const res = await fetch(
      "http://localhost:3000/api/vendor/register",
            // "http://213.210.21.49:3001/api/vendor/register",

      //VPSCHANGE
            // "/api/vendor/register", 
 
      {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({name, email, phone, password: signupPassword,}),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Registration failed");
      return;
    }

    // Auto-login after successful registration
//     resetForm();
// setMode("login");
// setSuccess("Registration submitted! Please wait for admin approval before logging in.");

if (!res.ok) {
  setError(data.error || "Registration failed");
  return;
}

// if (data.requiresEmailVerification) {
//   resetForm();

//   navigate("/vendor/verify-email", {
//     state: {
//       email: data.email || data.vendor?.email || email,
//     },
//   });

//   return;
// }


if (data.requiresEmailVerification) {
  const verificationEmail =
    data.email ||
    data.vendor?.email ||
    email;

  sessionStorage.setItem(
    "vendorVerificationEmail",
    verificationEmail
  );

  resetForm();

  navigate("/vendor/verify-email", {
    state: {
      email: verificationEmail,
    },
  });

  return;
}

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
          width: "95%",
          maxWidth: 400,
          padding: "36px 28px 32px",
          background: P.surface,
          borderRadius: 24,
          border: `1px solid ${P.border}`,
          boxShadow: P.shadowCardLg,
        }}
      >

{/* BRAND */}
        <div
  style={{
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
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

        <ErrorMessage message={error} />
        {success && (
          <div
            style={{
              background: P.surfaceSuccess,
              border: `1px solid ${P.borderSuccess}`,
              color: P.textSuccessMsg,
              padding: "10px 14px",
              borderRadius: 12,
              marginBottom: 14,
              fontSize: 13,
              display: "flex",
              alignItems: "center",
              gap: 8,
              fontFamily: "'Inter', sans-serif",
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={P.textSuccessMsg} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            {success}
          </div>
        )}

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
          {mode === "login" ? "Vendor Login" : "Vendor Registration"}
        </div>

        {mode === "login" ? (

          <form onSubmit={handleLogin}>

            <div style={{ marginBottom: 14 }}>
  <input
    type="email"
    placeholder="Email"
    value={login}
    onChange={(e) => setLogin(e.target.value)}
    required
    style={inputStyle}
  />
</div>

           <div style={{ marginBottom: 14 }}>
            <PasswordInput
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
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

            
<div
  style={{
    textAlign: "center",
    marginBottom: 16,
  }}
>
  <span
    onClick={() => navigate("/vendor/forgot-password")}
    style={{
      color: P.textAmberBright,
      fontSize: 13,
      fontWeight: 600,
      cursor: "pointer",
      fontFamily: "'Inter', sans-serif",
    }}
  >
    Forgot Password?
  </span>
</div>

            <p style={{ fontSize: 13, color: P.textHint, textAlign: "center", fontFamily: "'Inter', sans-serif" }}>
              Don't have an account?{" "}
              <span
                style={{ color: P.textAmberBright, fontWeight: 600, cursor: "pointer" }}
                onClick={() => { resetForm(); setMode("signup"); }}
              >
                Sign Up
              </span>
            </p>

          </form>

        ) : (

          <form onSubmit={handleSignup}>

            <div style={{ marginBottom: 14 }}>
  <input
    type="text"
    placeholder="Vendor Name"
    value={name}
    onChange={(e) => setName(e.target.value)}
    required
    style={inputStyle}
  />
</div>

<div style={{ marginBottom: 14 }}>
  <input
    type="email"
    placeholder="Email"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
    required
    style={inputStyle}
  />
</div>

<div style={{ marginBottom: 14 }}>
  <input
    type="text"
    placeholder="Phone"
    value={phone}
    onChange={(e) => setPhone(e.target.value)}
    required
    style={inputStyle}
  />
</div>

<div style={{ marginBottom: 14 }}>
  <PasswordInput
    value={signupPassword}
    onChange={(e) => setSignupPassword(e.target.value)}
    placeholder="Password"
    autoComplete="new-password"
    required
    inputStyle={inputStyle}
  />
</div>

<div style={{ marginBottom: 14 }}>
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

            <p style={{ fontSize: 13, color: P.textHint, textAlign: "center", fontFamily: "'Inter', sans-serif" }}>
              Already have an account?{" "}
              <span
                style={{ color: P.textAmberBright, fontWeight: 600, cursor: "pointer" }}
                onClick={() => { resetForm(); setMode("login");}}
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
  padding: "15px 20px",
  border: "none",
  background: P.surfaceForm,
  borderRadius: 10,
  boxSizing: "border-box",
  fontSize: 14,
  fontFamily: "'Inter', sans-serif",
  color: P.textPrimary,
  outline: "none",
};

const buttonStyle = {
  width: "100%",
  padding: "15px 16px",
  background: P.btnPrimary,
  border: "none",
  color: P.textWhite,
  fontSize: 16,
  fontWeight: 700,
  borderRadius: 50,
  cursor: "pointer",
  marginBottom: 14,
  boxShadow: P.shadowBtn,
  fontFamily: "'DM Sans', sans-serif",
  letterSpacing: 0.3,
};