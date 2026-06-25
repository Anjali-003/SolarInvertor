import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

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

      console.log("✅ Login Response:", data);

      localStorage.setItem(
        "token",
        data.token
      );
localStorage.setItem(
  "loginType",
  "user"
);
      // SAVE USER DATA
      console.log("👤 User data from response:", data.user);
      console.log("🔑 Role value:", data.user.role);

      // localStorage.setItem(
      //   "serial_number",
      //   data.user.serial_number
      // );

      //console.log("✅ Stored serial_number:", data.user.serial_number);

      localStorage.setItem("imei", data.user.imei);

      localStorage.setItem(
        "username",
        data.user.client_name
      );

      localStorage.setItem(
        "email",
        data.user.email
      );

      localStorage.setItem(
        "phone",
        data.user.phone
      );

      // localStorage.setItem(
      //   "role",
      //   data.user.role
      // );

      //console.log("✅ Stored role:", localStorage.getItem("role"));

      // navigate("/");
      navigate("/");

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
            client_name: clientName,
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

      alert("Device setup successful! Please login.");
      setMode("login");
      //setSerialNumber("");
      setClientName("");
      setPhone("");
      setEmail("");
      setSetupPassword("");
      setConfirmPassword("");
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
        //background: "#f5f5f5",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      <div
        style={{
          width: "100%",
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
            alignItems: "center",
            justifyContent: "center",
            gap: 18,
            marginBottom: 14,
          }}
        >
          {/* LOGO */}
          <div
            style={{
              width: 90,
              height: 90,
              overflow: "hidden",

              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <img
              src="src/assets/logo.png"
              alt="Logo"
              style={{
                width: 95,
                height: 95,
                objectFit: "cover",

                transform: "scale(1.18)",
              }}
            />
          </div>

          {/* TITLE */}
          <div>
            <div
              style={{
                fontSize: 24,
                fontWeight: 900,
                color: "#1F2937",

                lineHeight: 1,
                letterSpacing: -0.8,

                fontFamily:
                  "'Source Sans Pro', sans-serif",
              }}
            >
              SOLAR INVERTER
            </div>

            <div
              style={{
                fontSize: 34,
                fontWeight: 900,

                background:
                  "linear-gradient(135deg,#FFB84D,#FF6B6B)",

                WebkitBackgroundClip: "text",
                WebkitTextFillColor:
                  "transparent",

                lineHeight: 1.1,
                letterSpacing: -0.8,

                fontFamily:
                  "'Source Sans Pro', sans-serif",
              }}
            >
              Monitor
            </div>

            {/* SUBTITLE */}
            <div
              style={{
                marginTop: 4,

                fontSize: 13,
                fontWeight: 700,

                color: "#6B7280",

                letterSpacing: 1,

                textTransform: "uppercase",

                fontFamily:
                  "'Source Sans Pro', sans-serif",
              }}
            >
              SunPower. Simplified.
            </div>


          </div>

        </div>

        {/* ERROR MESSAGE */}
        {error && (
          <div
            style={{
              background: "#fee",
              border: "1px solid #fcc",
              color: "#c33",
              padding: "10px 12px",
              borderRadius: 4,
              marginBottom: 20,
              fontSize: 13,
            }}
          >
            {error}
          </div>
        )}
        {/* PAGE MODE */}
        <div
          style={{
            marginTop: 20,
            fontSize: 20,
            fontWeight: 600,
            color: "#4b4e54",
            marginBottom: 28,
            textAlign: "center",
          }}
        >
          {mode === "login"
            ? "Login to your dashboard"
            : "Sign Up"}
        </div>

        {/* LOGIN FORM */}
        {mode === "login" && (
          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: 16 }}>
              <input
                type="text"
                placeholder="Username"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                style={{
                  width: "100%",
                  padding: "14px 16px",
                  border: "none",
                  background: "#f0f0f0",
                  borderRadius: 6,
                  fontSize: 14,
                  boxSizing: "border-box",
                }}
                required
              />
            </div>

            <div style={{ marginBottom: 24 }}>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: "100%",
                  padding: "14px 16px",
                  border: "none",
                  background: "#f0f0f0",
                  borderRadius: 6,
                  fontSize: 14,
                  boxSizing: "border-box",
                }}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                padding: "14px 16px",
                background: "linear-gradient(135deg, #FFB84D 0%, #FF6B6B 100%)",
                border: "none",
                color: "white",
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

            <div style={{ fontSize: 18, color: "#999", textAlign: "center" }}>
              Not a member?{" "}
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setMode("signup");
                  setError("");
                }}
                style={{
                  color: "#5B9BD5",
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
              <input
                type="text"
                // placeholder="Serial Number"
                // value={serialNumber}
                // onChange={(e) => setSerialNumber(e.target.value)}
                placeholder="IMEI Number"
                value={imei}
                onChange={(e) => setImei(e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px 14px",
                  border: "none",
                  background: "#f0f0f0",
                  borderRadius: 6,
                  fontSize: 13,
                  boxSizing: "border-box",
                }}
                required
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
                  background: "#f0f0f0",
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
                  background: "#f0f0f0",
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
                  background: "#f0f0f0",
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
              <input
                type="password"
                placeholder="Password"
                value={setupPassword}
                onChange={(e) => setSetupPassword(e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px 14px",
                  border: "none",
                  background: "#f0f0f0",
                  borderRadius: 6,
                  fontSize: 13,
                  boxSizing: "border-box",
                }}
                required
              />
            </div>

            <div style={{ marginBottom: 20 }}>
              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px 14px",
                  border: "none",
                  background: "#f0f0f0",
                  borderRadius: 6,
                  fontSize: 13,
                  boxSizing: "border-box",
                }}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                padding: "14px 16px",
                background: "linear-gradient(135deg, #FFB84D 0%, #FF6B6B 100%)",
                border: "none",
                color: "white",
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

            <div style={{ fontSize: 13, color: "#999", textAlign: "center" }}>
              Already have an account?{" "}
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setMode("login");
                  setError("");
                }}
                style={{
                  color: "#5B9BD5",
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