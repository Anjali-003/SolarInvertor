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

    const [debugInfo, setDebugInfo] = useState({
    url: "",
    host: "",
    port: "",
    identifier: "",
    password: "",
    status: "",
    response: "",
    error: "",
  });

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
      "http://localhost:3000/api/user/devices",
      // "http://213.210.21.49:3001/api/user/devices",

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

// const handleLogin = async (e) => {
//   e.preventDefault();

//   setError("");
//   setLoading(true);

//   const loginUrl =
//     "http://213.210.21.49:3001/api/auth/login";

//   // Parse URL so we can display host + port separately
//   const parsedUrl = new URL(loginUrl);

//   setDebugInfo({
//     url: loginUrl,
//     host: parsedUrl.hostname,
//     port: parsedUrl.port,
//     identifier: identifier,
//     password: password, // DEBUG ONLY - remove later
//     status: "Sending request...",
//     response: "",
//     error: "",
//   });

//   try {
//     console.log("=================================");
//     console.log("LOGIN DEBUG");
//     console.log("URL:", loginUrl);
//     console.log("HOST:", parsedUrl.hostname);
//     console.log("PORT:", parsedUrl.port);
//     console.log("IDENTIFIER:", identifier);
//     console.log("PASSWORD:", password);
//     console.log("=================================");

//     const res = await fetch(loginUrl, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },

//       body: JSON.stringify({
//         identifier,
//         password,
//       }),
//     });

//     console.log("LOGIN STATUS:", res.status);
//     console.log("LOGIN OK:", res.ok);

//     let data = {};

//     const contentType =
//       res.headers.get("content-type") || "";

//     if (contentType.includes("application/json")) {
//       data = await res.json();
//     } else {
//       const text = await res.text();

//       data = text
//         ? { error: text }
//         : {};
//     }

//     console.log("LOGIN RESPONSE:", data);

//     setDebugInfo((old) => ({
//       ...old,
//       status: `HTTP ${res.status}`,
//       response: JSON.stringify(data, null, 2),
//     }));

//     if (!res.ok) {
//       const message =
//         data?.error ||
//         data?.message ||
//         `Login failed (${res.status})`;

//       setError(message);
//       setLoading(false);

//       return;
//     }

//     console.log(
//       "👤 User data from response:",
//       data.user
//     );

//     await loginUser(data);

//   } catch (err) {
//     console.error("LOGIN REQUEST FAILED:", err);

//     setDebugInfo((old) => ({
//       ...old,
//       status: "NETWORK ERROR",
//       error: `${err?.name || "Error"}: ${
//         err?.message || "Unknown error"
//       }`,
//     }));

//     let message =
//       "Unable to reach the server.";

//     if (err instanceof TypeError) {
//       message =
//         "Network error: the app could not connect to the server.";
//     } else if (err?.message) {
//       message = err.message;
//     }

//     setError(message);
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
        // "http://213.210.21.49:3001/api/auth/login",

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
        "http://localhost:3000/api/auth/setup-device",
                // "http://213.210.21.49:3001/api/auth/setup-device",

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
        {/* <ErrorMessage message={error} /> */}

        <ErrorMessage message={error} />

{debugInfo.url && (
  <div
    style={{
      width: "100%",
      marginBottom: 20,
      padding: 12,
      background: "#111",
      color: "#00ff88",
      borderRadius: 8,
      fontSize: 11,
      fontFamily: "monospace",
      wordBreak: "break-all",
      boxSizing: "border-box",
    }}
  >
    <div>
      <strong>LOGIN DEBUG</strong>
    </div>

    <div>
      URL: {debugInfo.url}
    </div>

    <div>
      Host: {debugInfo.host}
    </div>

    <div>
      Port: {debugInfo.port}
    </div>

    <div>
      Username/Email: {debugInfo.identifier}
    </div>

    <div>
      Password: {debugInfo.password}
    </div>

    <div>
      Status: {debugInfo.status}
    </div>

    {debugInfo.error && (
      <div>
        Error: {debugInfo.error}
      </div>
    )}

    {debugInfo.response && (
      <pre
        style={{
          whiteSpace: "pre-wrap",
          marginTop: 8,
        }}
      >
        {debugInfo.response}
      </pre>
    )}
  </div>
)}
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
{/* 
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
/> */}


<div
  style={{
    marginBottom: 10,
    padding: "10px 12px",
    background: P.surfaceForm,
    borderRadius: 10,
    fontFamily: "'Inter', sans-serif",
  }}
>
  <div
    style={{
      fontSize: 12,
      fontWeight: 700,
      color: P.textPrimary,
      marginBottom: 5,
    }}
  >
    Password must contain:
  </div>

  <div
    style={{
      fontSize: 11,
      color: P.textMuted,
      lineHeight: 1.6,
    }}
  >
    • 8–20 characters
    <br />
    • At least one uppercase letter (A–Z)
    <br />
    • At least one lowercase letter (a–z)
    <br />
    • At least one number (0–9)
    <br />
    • At least one special character (@ $ ! % * ? &amp; #)
  </div>
</div>


<PasswordInput
  value={setupPassword}
  onChange={(e) =>
    setSetupPassword(e.target.value)
  }
  placeholder="Password"
  required
  inputStyle={{
    ...inputStyle,
    marginBottom: 14,
  }}
/>


<PasswordInput
  value={confirmPassword}
  onChange={(e) =>
    setConfirmPassword(e.target.value)
  }
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


























// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";

// import ErrorMessage from "../components/ErrorMessage";
// import ImeiInput from "../components/ImeiInput";
// import PasswordInput from "../components/PasswordInput";

// import P from "../theme/colors";
// import logo from "../assets/logo.png";

// // =====================================================
// // API CONFIG
// // =====================================================

// const API_HOST = "213.210.21.49";
// const API_PORT = "3001";
// const API_BASE_URL = `http://${API_HOST}:${API_PORT}`;

// export default function Login() {
//   const navigate = useNavigate();

//   // =====================================================
//   // PAGE MODE
//   // =====================================================

//   const [mode, setMode] = useState("login");

//   // =====================================================
//   // LOGIN FIELDS
//   // =====================================================

//   const [identifier, setIdentifier] = useState("");
//   const [password, setPassword] = useState("");

//   // =====================================================
//   // REGISTRATION FIELDS
//   // =====================================================

//   const [imei, setImei] = useState("");
//   const [clientName, setClientName] = useState("");
//   const [phone, setPhone] = useState("");
//   const [email, setEmail] = useState("");
//   const [location, setLocation] = useState("");

//   const [setupPassword, setSetupPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");

//   // =====================================================
//   // UI STATE
//   // =====================================================

//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");
//   const [loading, setLoading] = useState(false);

//   // =====================================================
//   // DEBUG STATE
//   // =====================================================

//   const [debugInfo, setDebugInfo] = useState({
//     url: "",
//     host: "",
//     port: "",
//     identifier: "",
//     password: "",
//     status: "",
//     response: "",
//     error: "",
//   });


//   // ==========================================
//   // TEMPORARY INTERNET TEST
//   // ==========================================
//   const testInternet = async () => {
//     try {
//       const res = await fetch(
//         "https://jsonplaceholder.typicode.com/todos/1"
//       );

//       const data = await res.json();

//       console.log("Internet works:", data);

//       alert("Internet access works");
//     } catch (err) {
//       console.error("Internet test failed:", err);

//       alert("Internet access failed");
//     }
//   };



//   const testServer = async () => {
//   try {
//     const res = await fetch(
//       "http://213.210.21.49:3001/api/health"
//     );

//     if (!res.ok) {
//       throw new Error(`Server returned ${res.status}`);
//     }

//     const data = await res.json();

//     console.log("Server works:", data);

//     alert(
//       `Server connection works!\n\nResponse: ${JSON.stringify(data)}`
//     );
//   } catch (err) {
//     console.error("Server test failed:", err);

//     alert(
//       `Server connection failed!\n\n${err.message}`
//     );
//   }
// };



// const testNetworkDetails = async () => {
//   let result = "";

//   // 1. TEST GOOGLE CONNECTION
//   try {
//     const start = Date.now();

//     const response = await fetch("https://8.8.8.8", {
//       method: "HEAD",
//       mode: "no-cors",
//     });

//     const elapsed = Date.now() - start;

//     result += `Google connection: SUCCESS\n`;
//     result += `Time: ${elapsed} ms\n\n`;

//     console.log("Google connection successful");
//   } catch (err) {
//     result += `Google connection: FAILED\n`;
//     result += `Error: ${err.message}\n\n`;

//     console.error("Google connection failed:", err);
//   }

//   // 2. GET PUBLIC IPv4
//   try {
//     const response = await fetch("https://api.ipify.org?format=json");

//     const data = await response.json();

//     result += `Public IPv4: ${data.ip}\n`;

//     console.log("Public IPv4:", data.ip);
//   } catch (err) {
//     result += `Public IPv4: FAILED\n`;
//     result += `Error: ${err.message}\n`;

//     console.error("IPv4 lookup failed:", err);
//   }

//   alert(result);
// };

//   // =====================================================
//   // REDIRECT IF ALREADY LOGGED IN
//   // =====================================================

//   useEffect(() => {
//     const token = localStorage.getItem("token");

//     if (token) {
//       navigate("/");
//     }
//   }, [navigate]);

//   // =====================================================
//   // SAVE LOGIN + LOAD DEVICES
//   // =====================================================

//   const loginUser = async (data) => {
//     try {
//       if (!data?.token) {
//         throw new Error("Login response does not contain a token.");
//       }

//       if (!data?.user) {
//         throw new Error("Login response does not contain user information.");
//       }

//       const token = data.token;

//       // =====================================================
//       // SAVE USER
//       // =====================================================

//       localStorage.setItem("token", token);

//       localStorage.setItem("loginType", "user");

//       localStorage.setItem(
//         "username",
//         data.user.name || ""
//       );

//       localStorage.setItem(
//         "email",
//         data.user.email || ""
//       );

//       localStorage.setItem(
//         "phone",
//         data.user.phone || ""
//       );

//       localStorage.setItem(
//         "registeredSince",
//         data.user.created_at || ""
//       );

//       // =====================================================
//       // GET USER DEVICES
//       // =====================================================

//       const devicesUrl =
//         `${API_BASE_URL}/api/user/devices`;

//       console.log("DEVICE URL:", devicesUrl);

//       const devicesRes = await fetch(devicesUrl, {
//         method: "GET",

//         headers: {
//           Authorization: `Bearer ${token}`,
//           Accept: "application/json",
//         },
//       });

//       let devicesData = {};

//       const contentType =
//         devicesRes.headers.get("content-type") || "";

//       if (contentType.includes("application/json")) {
//         devicesData = await devicesRes.json();
//       } else {
//         const text = await devicesRes.text();

//         devicesData = text
//           ? { error: text }
//           : {};
//       }

//       console.log(
//         "DEVICE STATUS:",
//         devicesRes.status
//       );

//       console.log(
//         "DEVICE RESPONSE:",
//         devicesData
//       );

//       // =====================================================
//       // DO NOT BLOCK LOGIN IF DEVICE REQUEST FAILS
//       // =====================================================

//       if (!devicesRes.ok) {
//         console.error(
//           "Failed to load devices:",
//           devicesData
//         );

//         localStorage.setItem(
//           "userDevices",
//           JSON.stringify([])
//         );

//         setLoading(false);

//         navigate("/");

//         return;
//       }

//       // =====================================================
//       // SAVE DEVICES
//       // =====================================================

//       const devices =
//         Array.isArray(devicesData.devices)
//           ? devicesData.devices
//           : [];

//       localStorage.setItem(
//         "userDevices",
//         JSON.stringify(devices)
//       );

//       // =====================================================
//       // SELECT FIRST DEVICE
//       // =====================================================

//       if (devices.length > 0) {
//         const firstDevice = devices[0];

//         localStorage.setItem(
//           "selectedDeviceId",
//           String(firstDevice.id)
//         );

//         console.log(
//           "Selected device:",
//           firstDevice
//         );
//       } else {
//         localStorage.removeItem(
//           "selectedDeviceId"
//         );

//         console.log(
//           "User has no devices"
//         );
//       }

//       // =====================================================
//       // FINISH LOGIN
//       // =====================================================

//       setLoading(false);

//       navigate("/");
//     } 
    
//     // catch (err) {
//     //   console.error(
//     //     "Login/device loading error:",
//     //     err
//     //   );

//     //   setError(
//     //     err?.message ||
//     //       "Login succeeded but user information could not be loaded."
//     //   );

//     //   setLoading(false);
//     // }

//     catch (err) {
//   console.error("LOGIN REQUEST FAILED:", err);

//   const errorMessage =
//     `${err?.name || "Error"}: ${
//       err?.message || "Unknown network error"
//     }`;

//   setDebugInfo((old) => ({
//     ...old,
//     status: "NETWORK ERROR",
//     error: errorMessage,
//     response: JSON.stringify(
//       {
//         type: "NETWORK_ERROR",
//         message: err?.message || "Could not connect to backend",
//         name: err?.name || "Error",
//       },
//       null,
//       2
//     ),
//   }));

//   setError(
//     `Network error: ${
//       err?.message ||
//       "The app could not connect to the server."
//     }`
//   );

//   setLoading(false);
// }
//   };

//   // =====================================================
//   // HANDLE LOGIN
//   // =====================================================

//   const handleLogin = async (e) => {
//     e.preventDefault();

//     setError("");
//     setSuccess("");
//     setLoading(true);

//     const loginUrl =
//       `${API_BASE_URL}/api/auth/login`;

//     // =====================================================
//     // DISPLAY DEBUG INFO
//     // =====================================================

//     setDebugInfo({
//       url: loginUrl,
//       host: API_HOST,
//       port: API_PORT,
//       identifier,
//       password,
//       status: "Sending request...",
//       response: "",
//       error: "",
//     });

//     console.log(
//       "===================================="
//     );

//     console.log("LOGIN DEBUG");
//     console.log("URL:", loginUrl);
//     console.log("HOST:", API_HOST);
//     console.log("PORT:", API_PORT);
//     console.log("IDENTIFIER:", identifier);

//     // DEBUG ONLY
//     console.log("PASSWORD:", password);

//     console.log(
//       "===================================="
//     );

//     try {
//       const res = await fetch(loginUrl, {
//         method: "POST",

//         headers: {
//           "Content-Type":
//             "application/json",

//           Accept:
//             "application/json",
//         },

//         body: JSON.stringify({
//           identifier,
//           password,
//         }),
//       });

//       console.log(
//         "LOGIN STATUS:",
//         res.status
//       );

//       console.log(
//         "LOGIN OK:",
//         res.ok
//       );

//       let data = {};

//       const contentType =
//         res.headers.get("content-type") || "";

//       if (
//         contentType.includes(
//           "application/json"
//         )
//       ) {
//         data = await res.json();
//       } else {
//         const text = await res.text();

//         data = text
//           ? { error: text }
//           : {};
//       }

//       console.log(
//         "LOGIN RESPONSE:",
//         data
//       );

//       // =====================================================
//       // SHOW SERVER RESPONSE
//       // =====================================================

//       setDebugInfo((old) => ({
//         ...old,

//         status:
//           `HTTP ${res.status}`,

//         response:
//           JSON.stringify(
//             data,
//             null,
//             2
//           ),

//         error: "",
//       }));

//       // =====================================================
//       // LOGIN FAILED
//       // =====================================================

//       if (!res.ok) {
//         const message =
//           data?.error ||
//           data?.message ||
//           `Login failed (${res.status})`;

//         setError(message);

//         setLoading(false);

//         return;
//       }

//       // =====================================================
//       // LOGIN SUCCESS
//       // =====================================================

//       console.log(
//         "USER:",
//         data.user
//       );

//       await loginUser(data);
//     } catch (err) {
//       console.error(
//         "LOGIN REQUEST FAILED:",
//         err
//       );

//       const errorMessage =
//         `${err?.name || "Error"}: ${
//           err?.message ||
//           "Unknown network error"
//         }`;

//       setDebugInfo((old) => ({
//         ...old,

//         status:
//           "NETWORK ERROR",

//         error:
//           errorMessage,
//       }));

//       setError(
//         `Network error: ${
//           err?.message ||
//           "The app could not connect to the server."
//         }`
//       );

//       setLoading(false);
//     }
//   };

//   // =====================================================
//   // HANDLE REGISTRATION
//   // =====================================================

//   const handleSetupDevice = async (e) => {
//     e.preventDefault();

//     setError("");
//     setSuccess("");
//     setLoading(true);

//     // =====================================================
//     // PASSWORD CHECK
//     // =====================================================

//     if (
//       setupPassword !==
//       confirmPassword
//     ) {
//       setError(
//         "Passwords do not match"
//       );

//       setLoading(false);

//       return;
//     }

//     // =====================================================
//     // IMEI CHECK
//     // =====================================================

//     if (!/^\d{15}$/.test(imei)) {
//       setError(
//         "IMEI must be exactly 15 digits with no letters or symbols"
//       );

//       setLoading(false);

//       return;
//     }

//     try {
//       const setupUrl =
//         `${API_BASE_URL}/api/auth/setup-device`;

//       console.log(
//         "SETUP URL:",
//         setupUrl
//       );

//       const res = await fetch(
//         setupUrl,
//         {
//           method: "POST",

//           headers: {
//             "Content-Type":
//               "application/json",

//             Accept:
//               "application/json",
//           },

//           body: JSON.stringify({
//             imei,

//             name:
//               clientName,

//             phone,

//             email,

//             location,

//             password:
//               setupPassword,

//             confirm_password:
//               confirmPassword,
//           }),
//         }
//       );

//       let data = {};

//       const contentType =
//         res.headers.get(
//           "content-type"
//         ) || "";

//       if (
//         contentType.includes(
//           "application/json"
//         )
//       ) {
//         data = await res.json();
//       } else {
//         const text =
//           await res.text();

//         data = text
//           ? { error: text }
//           : {};
//       }

//       console.log(
//         "SETUP STATUS:",
//         res.status
//       );

//       console.log(
//         "SETUP RESPONSE:",
//         data
//       );

//       // =====================================================
//       // REGISTRATION FAILED
//       // =====================================================

//       if (!res.ok) {
//         setError(
//           data?.error ||
//           data?.message ||
//           `Setup failed (${res.status})`
//         );

//         setLoading(false);

//         return;
//       }

//       // =====================================================
//       // REGISTRATION SUCCESS
//       // =====================================================

//       setLoading(false);

//       navigate(
//         "/verify-email",
//         {
//           state: {
//             email,
//           },
//         }
//       );
//     } catch (err) {
//       console.error(
//         "Device setup request failed:",
//         err
//       );

//       setError(
//         err?.message ||
//           "Unable to finish device setup. Please check the server and try again."
//       );

//       setLoading(false);
//     }
//   };

//   // =====================================================
//   // PAGE
//   // =====================================================

//   return (
//     <div
//       style={{
//         minHeight: "100vh",
//         display: "flex",
//         flexDirection: "column",
//         justifyContent: "center",
//         alignItems: "center",
//         background: P.bgGradient,
//         fontFamily:
//           "'Inter', sans-serif",
//         padding: "24px 16px",
//         boxSizing: "border-box",
//       }}
//     >
//       <div
//         style={{
//           width: "95%",
//           maxWidth: 400,
//           padding:
//             "36px 28px 32px",
//           background:
//             P.surface,
//           borderRadius: 24,
//           border:
//             `1px solid ${P.border}`,
//           boxShadow:
//             P.shadowCardLg,
//           boxSizing:
//             "border-box",
//         }}
//       >
//         {/* ===================================================
//             LOGO
//         =================================================== */}

//         <div
//           style={{
//             display: "flex",
//             justifyContent:
//               "center",
//             alignItems:
//               "center",
//             marginBottom: 24,
//           }}
//         >
//           <img
//             src={logo}
//             alt="Logo"
//             style={{
//               width: 220,
//               height: 90,
//               objectFit:
//                 "contain",
//             }}
//           />
//         </div>

//         {/* ===================================================
//             ERROR
//         =================================================== */}

//         <ErrorMessage
//           message={error}
//         />

//         {/* ===================================================
//             DEBUG INFORMATION
//         =================================================== */}
// {debugInfo.url && (
//   <div
//     style={{
//       width: "100%",
//       marginBottom: 20,
//       padding: 12,
//       background: "#111",
//       color: "#00ff88",
//       borderRadius: 8,
//       fontSize: 11,
//       lineHeight: 1.6,
//       fontFamily: "monospace",
//       wordBreak: "break-all",
//       boxSizing: "border-box",
//       maxHeight: 350,
//       overflowY: "auto",
//     }}
//   >
//     <div
//       style={{
//         fontSize: 13,
//         fontWeight: "bold",
//         marginBottom: 8,
//       }}
//     >
//       LOGIN DEBUG
//     </div>

//     <div>
//       <strong>URL:</strong> {debugInfo.url}
//     </div>

//     <div>
//       <strong>Host:</strong> {debugInfo.host}
//     </div>

//     <div>
//       <strong>Port:</strong> {debugInfo.port}
//     </div>

//     <div>
//       <strong>Username:</strong> {debugInfo.identifier}
//     </div>

//     <div>
//       <strong>Status:</strong> {debugInfo.status}
//     </div>

//     {debugInfo.error && (
//       <div
//         style={{
//           marginTop: 8,
//         }}
//       >
//         <strong>Error:</strong> {debugInfo.error}
//       </div>
//     )}

//     {debugInfo.response && (
//       <div
//         style={{
//           marginTop: 12,
//           padding: 10,
//           background: "#1a1a1a",
//           borderRadius: 6,
//         }}
//       >
//         <div
//           style={{
//             fontWeight: "bold",
//             marginBottom: 6,
//           }}
//         >
//           BACKEND RESPONSE
//         </div>

//         <pre
//           style={{
//             margin: 0,
//             whiteSpace: "pre-wrap",
//             wordBreak: "break-word",
//             fontSize: 11,
//             color: "#00ff88",
//           }}
//         >
//           {debugInfo.response}
//         </pre>
//       </div>
//     )}
//   </div>
// )}
//         {/* {debugInfo.url && (
//           <div
//             style={{
//               width: "100%",
//               marginBottom: 20,
//               padding: 12,
//               background: "#111",
//               color: "#00ff88",
//               borderRadius: 8,
//               fontSize: 11,
//               lineHeight: 1.6,
//               fontFamily:
//                 "monospace",
//               wordBreak:
//                 "break-all",
//               boxSizing:
//                 "border-box",
//               maxHeight: 280,
//               overflowY: "auto",
//             }}
//           >
//             <div
//               style={{
//                 fontSize: 13,
//                 fontWeight:
//                   "bold",
//                 marginBottom: 8,
//               }}
//             >
//               LOGIN DEBUG
//             </div>

//             <div>
//               <strong>
//                 URL:
//               </strong>{" "}
//               {debugInfo.url}
//             </div>

//             <div>
//               <strong>
//                 Host:
//               </strong>{" "}
//               {debugInfo.host}
//             </div>

//             <div>
//               <strong>
//                 Port:
//               </strong>{" "}
//               {debugInfo.port}
//             </div>

//             <div>
//               <strong>
//                 Username:
//               </strong>{" "}
//               {debugInfo.identifier}
//             </div>

//             <div>
//               <strong>
//                 Password:
//               </strong>{" "}
//               {debugInfo.password}
//             </div>

//             <div>
//               <strong>
//                 Status:
//               </strong>{" "}
//               {debugInfo.status}
//             </div>

//             {debugInfo.error && (
//               <div
//                 style={{
//                   marginTop: 8,
//                 }}
//               >
//                 <strong>
//                   Error:
//                 </strong>{" "}
//                 {debugInfo.error}
//               </div>
//             )}

//             {debugInfo.response && (
//               <>
//                 <div
//                   style={{
//                     marginTop: 8,
//                     fontWeight:
//                       "bold",
//                   }}
//                 >
//                   SERVER RESPONSE:
//                 </div>

//                 <pre
//                   style={{
//                     whiteSpace:
//                       "pre-wrap",
//                     wordBreak:
//                       "break-word",
//                     margin: "4px 0 0",
//                     fontFamily:
//                       "monospace",
//                     fontSize: 10,
//                   }}
//                 >
//                   {
//                     debugInfo.response
//                   }
//                 </pre>
//               </>
//             )}
//           </div>
//         )} */}

//         {/* ===================================================
//             SUCCESS
//         =================================================== */}

//         {success && (
//           <div
//             style={{
//               background:
//                 P.surfaceSuccess,
//               border:
//                 `1px solid ${P.borderSuccess}`,
//               color:
//                 P.textSuccessMsg,
//               padding:
//                 "10px 14px",
//               borderRadius: 12,
//               marginBottom: 14,
//               fontSize: 13,
//             }}
//           >
//             {success}
//           </div>
//         )}

//         {/* ===================================================
//             TITLE
//         =================================================== */}

//         <div
//           style={{
//             fontSize: 22,
//             fontWeight: 700,
//             color:
//               P.textPrimary,
//             marginBottom: 24,
//             textAlign:
//               "center",
//             fontFamily:
//               "'DM Sans', sans-serif",
//           }}
//         >
//           {mode === "login"
//             ? "User Login"
//             : "User Registration"}
//         </div>

//         {/* ===================================================
//             LOGIN
//         =================================================== */}

//         {mode === "login" && (
//           <form
//             onSubmit={
//               handleLogin
//             }
//             style={{
//               display: "flex",
//               flexDirection:
//                 "column",
//             }}
//           >
//             <div
//               style={{
//                 marginBottom: 14,
//               }}
//             >
//               <input
//                 type="text"
//                 placeholder="Email"
//                 value={
//                   identifier
//                 }
//                 onChange={(e) =>
//                   setIdentifier(
//                     e.target.value
//                   )
//                 }
//                 style={
//                   inputStyle
//                 }
//                 required
//               />
//             </div>

//             <div
//               style={{
//                 marginBottom: 14,
//               }}
//             >
//               <PasswordInput
//                 value={
//                   password
//                 }
//                 onChange={(e) =>
//                   setPassword(
//                     e.target.value
//                   )
//                 }
//                 placeholder="Password"
//                 required
//                 inputStyle={
//                   inputStyle
//                 }
//               />
//             </div>

//             <button
//   type="button"
//   onClick={testInternet}
//   style={buttonStyle}
// >
//   Test Internet
// </button>


// <button
//   type="button"
//   onClick={testNetworkDetails}
//   style={buttonStyle}
// >
//   Test Network Details
// </button>


// <button
//   type="button"
//   onClick={testServer}
//   style={buttonStyle}
// >
//   Test Server
// </button>

//             <button
//               type="submit"
//               disabled={loading}
//               style={{
//                 ...buttonStyle,

//                 opacity:
//                   loading
//                     ? 0.7
//                     : 1,
//               }}
//             >
//               {loading
//                 ? "Logging In..."
//                 : "Login"}
//             </button>

//             {/* FORGOT PASSWORD */}

//             <div
//               style={{
//                 marginBottom: 20,
//                 textAlign:
//                   "center",
//               }}
//             >
//               <span
//                 onClick={() => {
//                   navigate(
//                     "/forgot-password"
//                   );

//                   setError("");
//                   setSuccess("");
//                 }}
//                 style={{
//                   fontSize: 13,
//                   color:
//                     P.textAmberBright,
//                   cursor:
//                     "pointer",
//                   fontWeight: 600,
//                 }}
//               >
//                 Forgot Password?
//               </span>
//             </div>

//             {/* SIGN UP */}

//             <p
//               style={{
//                 margin: 0,
//                 fontSize: 13,
//                 color:
//                   P.textHint,
//                 textAlign:
//                   "center",
//               }}
//             >
//               Don't have an
//               account?{" "}

//               <span
//                 onClick={() => {
//                   setMode(
//                     "signup"
//                   );

//                   setError("");
//                   setSuccess("");
//                 }}
//                 style={{
//                   color:
//                     P.textAmberBright,
//                   fontWeight:
//                     600,
//                   cursor:
//                     "pointer",
//                 }}
//               >
//                 Sign Up
//               </span>
//             </p>
//           </form>
//         )}

//         {/* ===================================================
//             REGISTRATION
//         =================================================== */}

//         {mode === "signup" && (
//           <form
//             onSubmit={
//               handleSetupDevice
//             }
//             style={{
//               display:
//                 "flex",
//               flexDirection:
//                 "column",
//             }}
//           >
//             {/* IMEI */}

//             <div
//               style={{
//                 marginBottom: 14,
//               }}
//             >
//               <ImeiInput
//                 value={imei}
//                 onChange={(e) =>
//                   setImei(
//                     e.target.value
//                   )
//                 }
//                 placeholder="IMEI Number"
//                 required
//                 inputStyle={
//                   inputStyle
//                 }
//               />
//             </div>

//             {/* CLIENT */}

//             <div
//               style={{
//                 marginBottom: 14,
//               }}
//             >
//               <input
//                 type="text"
//                 placeholder="Client Name"
//                 value={
//                   clientName
//                 }
//                 onChange={(e) =>
//                   setClientName(
//                     e.target.value
//                   )
//                 }
//                 style={
//                   inputStyle
//                 }
//                 required
//               />
//             </div>

//             {/* EMAIL */}

//             <div
//               style={{
//                 marginBottom: 14,
//               }}
//             >
//               <input
//                 type="email"
//                 placeholder="Email"
//                 value={email}
//                 onChange={(e) =>
//                   setEmail(
//                     e.target.value
//                   )
//                 }
//                 style={
//                   inputStyle
//                 }
//                 required
//               />
//             </div>

//             {/* PHONE */}

//             <div
//               style={{
//                 marginBottom: 14,
//               }}
//             >
//               <input
//                 type="tel"
//                 placeholder="Phone"
//                 value={phone}
//                 onChange={(e) =>
//                   setPhone(
//                     e.target.value
//                   )
//                 }
//                 style={
//                   inputStyle
//                 }
//                 required
//               />
//             </div>

//             {/* LOCATION */}

//             <div
//               style={{
//                 marginBottom: 14,
//               }}
//             >
//               <input
//                 type="text"
//                 placeholder="Location"
//                 value={location}
//                 onChange={(e) =>
//                   setLocation(
//                     e.target.value
//                   )
//                 }
//                 style={
//                   inputStyle
//                 }
//                 required
//               />
//             </div>

//             {/* PASSWORD */}

//             <PasswordInput
//               value={
//                 setupPassword
//               }
//               onChange={(e) =>
//                 setSetupPassword(
//                   e.target.value
//                 )
//               }
//               placeholder="Password"
//               required
//               inputStyle={{
//                 ...inputStyle,
//                 marginBottom: 14,
//               }}
//             />

//             {/* CONFIRM PASSWORD */}

//             <PasswordInput
//               value={
//                 confirmPassword
//               }
//               onChange={(e) =>
//                 setConfirmPassword(
//                   e.target.value
//                 )
//               }
//               placeholder="Confirm Password"
//               required
//               inputStyle={{
//                 ...inputStyle,
//                 marginBottom: 14,
//               }}
//             />

//             {/* SUBMIT */}

//             <button
//               type="submit"
//               disabled={loading}
//               style={{
//                 ...buttonStyle,

//                 opacity:
//                   loading
//                     ? 0.7
//                     : 1,
//               }}
//             >
//               {loading
//                 ? "Signing up..."
//                 : "Sign Up"}
//             </button>

//             {/* LOGIN LINK */}

//             <p
//               style={{
//                 margin: 0,
//                 fontSize: 13,
//                 color:
//                   P.textHint,
//                 textAlign:
//                   "center",
//               }}
//             >
//               Already have an
//               account?{" "}

//               <span
//                 onClick={() => {
//                   setMode(
//                     "login"
//                   );

//                   setError("");
//                   setSuccess("");
//                 }}
//                 style={{
//                   color:
//                     P.textAmberBright,
//                   fontWeight:
//                     600,
//                   cursor:
//                     "pointer",
//                 }}
//               >
//                 Login here
//               </span>
//             </p>
//           </form>
//         )}
//       </div>
//     </div>
//   );
// }

// // =====================================================
// // INPUT STYLE
// // =====================================================

// const inputStyle = {
//   width: "100%",
//   padding: "15px 20px",
//   border: "none",
//   background: P.surfaceForm,
//   borderRadius: 10,
//   boxSizing: "border-box",
//   fontSize: 14,
//   fontFamily:
//     "'Inter', sans-serif",
//   color: P.textPrimary,
//   outline: "none",
// };

// // =====================================================
// // BUTTON STYLE
// // =====================================================

// const buttonStyle = {
//   width: "100%",
//   padding: "15px 16px",
//   background: P.btnPrimary,
//   border: "none",
//   color: P.textWhite,
//   fontSize: 16,
//   fontWeight: 700,
//   borderRadius: 50,
//   cursor: "pointer",
//   marginBottom: 14,
//   boxShadow: P.shadowBtn,
//   fontFamily:
//     "'DM Sans', sans-serif",
//   letterSpacing: 0.3,
// };