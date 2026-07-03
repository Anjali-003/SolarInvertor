import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ErrorMessage from "../components/ErrorMessage";
import ImeiInput from "../components/ImeiInput";
import P from "../theme/colors";
import PasswordInput from "../components/PasswordInput";

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

  // const handleLogin = async (e) => {
  //   e.preventDefault();
  //   setError("");
  //   setLoading(true);

  //   try {
  //     const res = await fetch(
  //       "http://localhost:3000/api/auth/login",
  //       {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify({
  //           identifier,
  //           password,
  //         }),
  //       }
  //     );

  //     const data = await res.json();

  //     if (!res.ok) {
  //       setError(data.error || "Login failed");
  //       setLoading(false);
  //       return;
  //     }

  //     localStorage.setItem("token", data.token);
  //     navigate("/");
  //   } catch (err) {
  //     console.log(err);
  //     setError("Server error");
  //     setLoading(false);
  //   }
  // };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(
        "http://localhost:3000/api/auth/login",
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

//       console.log("✅ Login Response:", data);

//       localStorage.setItem(
//         "token",
//         data.token
//       );
// localStorage.setItem(
//   "loginType",
//   "user"
// );
      // SAVE USER DATA
      console.log("👤 User data from response:", data.user);
      // console.log("🔑 Role value:", data.user.role);

      // localStorage.setItem(
      //   "serial_number",
      //   data.user.serial_number
      // );

      //console.log("✅ Stored serial_number:", data.user.serial_number);

      // localStorage.setItem("imei", data.user.imei);

      // localStorage.setItem(
      //   "username",
      //   data.user.name
      // );

      // localStorage.setItem(
      //   "email",
      //   data.user.email
      // );

      // localStorage.setItem(
      //   "phone",
      //   data.user.phone
      // );
      // navigate("/");
      loginUser(data);

      // localStorage.setItem(
      //   "role",
      //   data.user.role
      // );

      //console.log("✅ Stored role:", localStorage.getItem("role"));

      // navigate("/");
      

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
        "http://localhost:3000/api/auth/setup-device",
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

      // alert("Device setup successful! Please login.");
      // setMode("login");
      //setSerialNumber("");

//       localStorage.setItem("token", data.token);
// localStorage.setItem("loginType", "user");

// localStorage.setItem("imei", data.user.imei);
// localStorage.setItem("username", data.user.name);
// localStorage.setItem("email", data.user.email);
// localStorage.setItem("phone", data.user.phone);

// setLoading(false);

// navigate("/");
//  loginUser(data);


//       setClientName("");
//       setPhone("");
//       setEmail("");
//       setSetupPassword("");
//       setConfirmPassword("");
// Signup successful, now automatically login

const loginRes = await fetch(
  "http://localhost:3000/api/auth/login",
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
        justifyContent: "center",
        alignItems: "center",
        //background: P.surfaceLight,
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      <div
        style={{
          width: "95%",
          // maxWidth: 380,
          // padding: "50px 40px",
          // background: "#ffffff",
          // borderRadius: 8,
          // boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
          maxWidth: 460,
          padding: "55px 42px",
          background: "rgba(255,255,255,0.75)",
          backdropFilter: "blur(20px)",
          borderRadius: 28,

          border: "1px solid rgba(255,184,77,0.12)",

          boxShadow:
            "0 18px 45px rgba(255,184,77,0.12)",
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
    display: "flex",
    justifyContent: "center",
    marginBottom: 14,
  }}
>
  {/* LOGO */}
  <img
    src="/src/assets/logo.png"
    alt="Logo"
    style={{
      width: 400,
      height: 120,
      objectFit: "contain",
      justifyContent: "center",
      alignItems: "center",

    }}
  />
</div>

        {/* PAGE MODE */}
        <div
          style={{
            marginTop: 20,
            fontSize: 20,
            fontWeight: 600,
            color: P.textBlue,
            marginBottom: 28,
            textAlign: "center",
          }}
        >
          {mode === "login"
            ? "Login to your dashboard"
            : "Sign Up"}
        </div>

{/* ERROR MESSAGE */}
        <ErrorMessage message={error} />

        {/* LOGIN FORM */}
        {mode === "login" && (
          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: 16 }}>
              <input
                type="text"
                placeholder="Email"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                style={{
                  width: "100%",
                  padding: "14px 16px",
                  border: "none",
                  background: P.surfaceForm,
                  borderRadius: 6,
                  fontSize: 14,
                  boxSizing: "border-box",
                }}
                required
              />
            </div>

            <div style={{ marginBottom: 24 }}>
              <PasswordInput
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
                inputStyle={{
                  padding: "14px 16px",
                  border: "none",
                  background: P.surfaceForm,
                  borderRadius: 6,
                  fontSize: 14,
                }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                padding: "14px 16px",
                background:`linear-gradient(135deg, ${P.amber} 0%, ${P.orange} 100%)`,
                border: "none",
                color: P.surface,
                fontSize: 15,
                fontWeight: 600,
                borderRadius: 6,
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

            <div style={{ fontSize: 18, color: P.textHint, textAlign: "center" }}>
              Not a member?{" "}
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setMode("signup");
                  setError("");
                }}
                style={{
                  color: P.blueLight,
                  textDecoration: "none",
                  fontWeight: 500,
                  cursor: "pointer",
                }}
              >
                Sign Up now
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
                  padding: "12px 14px",
                  border: "none",
                  background: P.surfaceForm,
                  borderRadius: 6,
                  fontSize: 13,
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
                  padding: "12px 14px",
                  border: "none",
                  background: P.surfaceForm,
                  borderRadius: 6,
                  fontSize: 13,
                  boxSizing: "border-box",
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
                  padding: "12px 14px",
                  border: "none",
                  background: P.surfaceForm,
                  borderRadius: 6,
                  fontSize: 13,
                  boxSizing: "border-box",
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
                  padding: "12px 14px",
                  border: "none",
                  background: P.surfaceForm,
                  borderRadius: 6,
                  fontSize: 13,
                  boxSizing: "border-box",
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

            <div style={{ marginBottom: 12 }}>
              <PasswordInput
                value={setupPassword}
                onChange={(e) => setSetupPassword(e.target.value)}
                placeholder="Password"
                required
                inputStyle={{
                  padding: "12px 14px",
                  border: "none",
                  background: P.surfaceForm,
                  borderRadius: 6,
                  fontSize: 13,
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
                  padding: "12px 14px",
                  border: "none",
                  background: P.surfaceForm,
                  borderRadius: 6,
                  fontSize: 13,
                }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                padding: "14px 16px",
                background: `linear-gradient(135deg, ${P.amber} 0%, ${P.orange} 100%)`,
                border: "none",
                color: P.surface,
                fontSize: 15,
                fontWeight: 600,
                borderRadius: 6,
                cursor: loading ? "not-allowed" : "pointer",
                marginBottom: 18,
                opacity: loading ? 0.7 : 1,
                transition: "opacity 0.2s",
              }}
            >
              {loading ? "SIGNING..." : "SIGN UP"}
            </button>

            <div style={{ fontSize: 13, color: P.textHint, textAlign: "center" }}>
              Already have an account?{" "}
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setMode("login");
                  setError("");
                }}
                style={{
                  color: P.blueLight,
                  textDecoration: "none",
                  fontWeight: 500,
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