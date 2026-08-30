import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ErrorMessage from "../components/ErrorMessage";
import ImeiInput from "../components/ImeiInput";
import P from "../theme/colors";
import PasswordInput from "../components/PasswordInput";
import logo from "../assets/logo.png";

async function getResponseError(response, fallbackMessage) {
  try {
    const contentType = response?.headers?.get("content-type") || "";

    if (contentType.includes("application/json")) {
      const data = await response.json();
      return data?.error || data?.message || fallbackMessage;
    }

    const text = await response.text();
    return text || fallbackMessage;
  } catch {
    return fallbackMessage;
  }
}

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
  const [location, setLocation] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      // navigate("/");
      navigate("/");
    }
  }, [navigate]);

//   const loginUser = (data) => {
//   localStorage.setItem("token", data.token);
//   localStorage.setItem("loginType", "user");
//   // localStorage.setItem("imei", data.user.imei);
//   localStorage.setItem("username", data.user.name);
//   localStorage.setItem("email", data.user.email);
//   localStorage.setItem("phone", data.user.phone);
//   localStorage.setItem(
// "registeredSince",
//     data.user.created_at
// );

//     setLoading(false);


//   navigate("/");
// };

const loginUser = async (data) => {

  try {

    // =====================================================
    // SAVE LOGIN TOKEN
    // =====================================================

    const token = data.token;

    localStorage.setItem(
      "token",
      token
    );

    localStorage.setItem(
      "loginType",
      "user"
    );

    localStorage.setItem(
      "username",
      data.user.name
    );

    localStorage.setItem(
      "email",
      data.user.email
    );

    localStorage.setItem(
      "phone",
      data.user.phone
    );

    localStorage.setItem(
      "registeredSince",
      data.user.created_at
    );


    // =====================================================
    // GET USER'S DEVICES
    // =====================================================

    const devicesRes = await fetch(
      //VPSCHANGE
      // "http://localhost:3000/api/user/devices",
      "http://213.210.21.49:3000/api/user/devices",

      // "/api/user/devices",

      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    let devicesData = {};

    try {
      const contentType = devicesRes.headers.get("content-type") || "";

      if (contentType.includes("application/json")) {
        devicesData = await devicesRes.json();
      } else {
        const text = await devicesRes.text();
        devicesData = text ? { error: text } : {};
      }
    } catch (parseError) {
      console.error("Device response parse error:", parseError);
      throw new Error("The server returned an invalid response while loading your devices.");
    }

    if (!devicesRes.ok) {
      console.log("Failed to fetch user devices:", devicesData);

      const message = devicesData.error || devicesData.message || "Failed to load devices";
      setError(message);
      setLoading(false);
      return;
    }


    console.log(
      "📱 User devices:",
      devicesData.devices
    );


    // =====================================================
    // SAVE DEVICES
    // =====================================================

    localStorage.setItem(
      "userDevices",
      JSON.stringify(
        devicesData.devices || []
      )
    );


    // =====================================================
    // SELECT FIRST DEVICE
    // =====================================================

    if (
      devicesData.devices &&
      devicesData.devices.length > 0
    ) {

      const firstDevice =
        devicesData.devices[0];

      localStorage.setItem(
        "selectedDeviceId",
        firstDevice.id
      );

      console.log(
        "✅ Selected device:",
        firstDevice
      );

    } else {

      console.log(
        "⚠️ User has no devices"
      );

    }


    // =====================================================
    // FINISH LOGIN
    // =====================================================

    setLoading(false);

    navigate("/");

  } catch (err) {
    console.error("Device loading error:", err);

    const message =
      err?.message ||
      "Failed to load user devices. Please check your connection or server status.";

    setError(message);
    setLoading(false);
  }
};


  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(
        // "http://localhost:3000/api/auth/login",
        "http://192.168.1.29:3000/api/auth/login",

        //VPSCHANGE
        // "/api/auth/login",

        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            identifier,
            password,
          }),
        }
      );

      let data = {};

      try {
        const contentType = res.headers.get("content-type") || "";

        if (contentType.includes("application/json")) {
          data = await res.json();
        } else {
          const text = await res.text();
          data = text ? { error: text } : {};
        }
      } catch (parseError) {
        console.error("Login response parse error:", parseError);
        throw new Error("The server returned an invalid login response.");
      }

      if (!res.ok) {
        const message = data?.error || data?.message || `Login failed (${res.status})`;
        setError(message);
        setLoading(false);
        return;
      }

      // SAVE USER DATA
      console.log("👤 User data from response:", data.user);
      await loginUser(data);
    } catch (err) {
      console.error("Login request failed:", err);

      let message = "Unable to reach the server. Please check your internet connection or server URL.";

      if (err instanceof TypeError) {
        message = "Network error: the app could not connect to the server.";
      } else if (err?.message) {
        message = err.message;
      }

      setError(message);
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
                "http://192.168.1.29:3000/api/auth/setup-device",

        //VPSCHANGE
        // "/api/auth/setup-device",
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
            location,
            password: setupPassword,
            confirm_password: confirmPassword,
            //role,
          }),
        }
      );

      const data = await res.json();

      // if (!res.ok) {
      //   setError(data.error || "Setup failed");
      //   setLoading(false);
      //   return;
      // }

//       setMode("login");
//       setError("");
//       setSuccess("Device setup successful! Please login.");

// // Signup successful, now automatically login

// const loginRes = await fetch(
//   "http://localhost:3000/api/auth/login",
//   //VPSCHANGE
//   // "/api/auth/login",
//   {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({
//       identifier: email,
//       password: setupPassword,
//     }),
//   }
// );

// const loginData = await loginRes.json();

// if (!loginRes.ok) {
//   setError(loginData.error || "Automatic login failed");
//   setLoading(false);
//   return;
// }

// loginUser(loginData);

if (!res.ok) {
  setError(data.error || "Setup failed");
  setLoading(false);
  return;
}

setLoading(false);

navigate("/verify-email", {
  state: {
    email: email
  }
});


    } catch (err) {
      console.error("Device setup request failed:", err);

      const message =
        err?.message ||
        "Unable to finish device setup. Please check the server and try again.";

      setError(message);
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

{/* ERROR MESSAGE */}
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
              fontFamily: "'Inter', sans-serif",
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

        {/* LOGIN FORM */}
        {mode === "login" && (
          <form
  onSubmit={handleLogin}
  style={{
    display: "flex",
    flexDirection: "column",
  }}
>
            <div style={{ marginBottom: 14 }}>
              <input
                type="text"
                placeholder="Email"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                style={inputStyle}
                required
              />
            </div>

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

            <div
  style={{
    marginBottom: 20,
    textAlign: "center",
  }}
>
  <span
    onClick={() => {
      navigate("/forgot-password");
      setError("");
      setSuccess("");
    }}
    style={{
      fontSize: 13,
      color: P.textAmberBright,
      cursor: "pointer",
      fontWeight: 600,
    }}
  >
    Forgot Password?
  </span>
</div>

            <p
  style={{
    margin: 0,
    fontSize: 13,
    color: P.textHint,
    textAlign: "center",
    fontFamily: "'Inter', sans-serif",
  }}
>
  Don't have an account?{" "}
  <span
    onClick={() => {
      setMode("signup");
      setError("");
      setSuccess("");
    }}
    style={{
      color: P.textAmberBright,
      fontWeight: 600,
      cursor: "pointer",
    }}
  >
    Sign Up
  </span>
</p>
          </form>
        )}

        {/* SIGN UP FORM */}
        {mode === "signup" && (
          <form
  // onSubmit={handleLogin}

    onSubmit={handleSetupDevice}

  style={{
    display: "flex",
    flexDirection: "column",
  }}
>
            <div style={{ marginBottom: 14 }}>
              <ImeiInput
                value={imei}
                onChange={(e) => setImei(e.target.value)}
                placeholder="IMEI Number"
                required
                inputStyle={inputStyle}
              />
            </div>

            <div style={{ marginBottom: 14 }}>
              <input
                type="text"
                placeholder="Client Name"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                style={inputStyle}
                required
              />
            </div>

            <div style={{ marginBottom: 14 }}>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={inputStyle}
                required
              />
            </div>

            <div style={{ marginBottom: 14 }}>
              <input
                type="tel"
                placeholder="Phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                style={inputStyle}
                required
              />
            </div>

            <div style={{ marginBottom: 14 }}>
    <input
        type="text"
        placeholder="Location"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        style={inputStyle}
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

            <PasswordInput
    value={setupPassword}
    // onChange={(e) => setPassword(e.target.value)}
        onChange={(e)=>setSetupPassword(e.target.value)}
    placeholder="Password"
    required
    inputStyle={{
        ...inputStyle,
        marginBottom: 14,
    }}
/>

              <PasswordInput
    value={confirmPassword}
    // onChange={(e) => setPassword(e.target.value)}

        onChange={(e)=>setConfirmPassword(e.target.value)}

    placeholder="Confirm Password"
    required
    inputStyle={{
        ...inputStyle,
        marginBottom: 14,
    }}
/>

            <button
              type="submit"
              disabled={loading}
              style={buttonStyle}
            >
              {loading ? "Signing up..." : "Sign Up"}
            </button>

            <p
  style={{
    margin: 0,
    fontSize: 13,
    color: P.textHint,
    textAlign: "center",
    fontFamily: "'Inter', sans-serif",
  }}
>
  Already have an account?{" "}
  <span
    onClick={() => {
      setMode("login");
      setError("");
    }}
    style={{
      color: P.textAmberBright,
      fontWeight: 600,
      cursor: "pointer",
    }}
  >
    Login here
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