// import { useState } from "react";
// import { useNavigate } from "react-router-dom";

// export default function VendorLogin() {

//   const navigate = useNavigate();

//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//   const [loading, setLoading] = useState(false);

//   const handleLogin = async (e) => {

//     e.preventDefault();

//     try {

//       setLoading(true);

//       const res = await fetch(
//         "http://localhost:3000/api/vendor/login",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json"
//           },
//           body: JSON.stringify({
//             email,
//             password
//           })
//         }
//       );

//       const data = await res.json();

//       console.log("Vendor Login Response:", data);

//       if (!res.ok) {

//         alert(
//           data.error || "Login failed"
//         );

//         return;
//       }

//       // Store vendor info
//       localStorage.setItem(
//         "vendorToken",
//         data.token
//       );

//       localStorage.setItem(
//         "vendorId",
//         data.vendor.id
//       );

//       localStorage.setItem(
//         "vendorName",
//         data.vendor.name
//       );

//       localStorage.setItem(
//         "vendorEmail",
//         data.vendor.email
//       );

//       alert("Login successful");

//       //navigate("/vendor-dashboard");
//       navigate("/devices");

//     } catch (err) {

//       console.error(err);

//       alert("Server error");

//     } finally {

//       setLoading(false);
//     }
//   };

//   return (
//     <div
//       style={{
//         maxWidth: 450,
//         margin: "50px auto",
//         padding: 25,
//         border: "1px solid #ddd",
//         borderRadius: 10
//       }}
//     >
//       <h2>Vendor Login</h2>

//       <form onSubmit={handleLogin}>

//         <div style={{ marginBottom: 15 }}>
//           <label>Email</label>

//           <input
//             type="email"
//             value={email}
//             onChange={(e) =>
//               setEmail(e.target.value)
//             }
//             required
//             style={{
//               width: "100%",
//               padding: 10
//             }}
//           />
//         </div>

//         <div style={{ marginBottom: 15 }}>
//           <label>Password</label>

//           <input
//             type="password"
//             value={password}
//             onChange={(e) =>
//               setPassword(e.target.value)
//             }
//             required
//             style={{
//               width: "100%",
//               padding: 10
//             }}
//           />
//         </div>

//         <button
//           type="submit"
//           disabled={loading}
//           style={{
//             width: "100%",
//             padding: 12,
//             cursor: "pointer"
//           }}
//         >
//           {
//             loading
//               ? "Logging in..."
//               : "Login"
//           }
//         </button>

//       </form>
//     </div>
//   );
// }







import { useState } from "react";
import { useNavigate } from "react-router-dom";

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

  const [error, setError] =
    useState("");

  const handleLogin = async (e) => {

    e.preventDefault();

    try {

      setLoading(true);
      setError("");

      const res = await fetch(
        "http://localhost:3000/api/vendor/login",
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
    const res = await fetch("http://localhost:3000/api/vendor/register", {
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
    alert("Registration submitted successfully.\n\nPlease wait for admin approval before logging in.");

    setMode("login");

    setName("");
    setEmail("");
    setPhone("");
    setPassword("");
    setConfirmPassword("");

  } catch {
    setError("Server error");
  } finally {
    setLoading(false);
  }
};

  // const handleSignup = async (e) => {

  //   e.preventDefault();

  //   if (
  //     password !== confirmPassword
  //   ) {
  //     setError(
  //       "Passwords do not match"
  //     );
  //     return;
  //   }

  //   try {

  //     setLoading(true);
  //     setError("");

  //     const res = await fetch(
  //       "http://localhost:3000/api/vendor/register",
  //       {
  //         method: "POST",
  //         headers: {
  //           "Content-Type":
  //             "application/json"
  //         },
  //         body: JSON.stringify({
  //           name,
  //           email,
  //           phone,
  //           password
  //         })
  //       }
  //     );

  //     const data =
  //       await res.json();

  //     if (!res.ok) {

  //       setError(
  //         data.error ||
  //         "Registration failed"
  //       );

  //       return;
  //     }

  //     alert(
  //       "Vendor account created successfully"
  //     );

  //     setMode("login");

  //   } catch {

  //     setError("Server error");

  //   } finally {

  //     setLoading(false);
  //   }
  // };

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
          width: "100%",
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
            textAlign: "center",
            marginBottom: 30
          }}
        >

          <img
            src="src/assets/logo.png"
            alt="logo"
            style={{
              width: 90,
              marginBottom: 10
            }}
          />

          <div
            style={{
              fontSize: 24,
              fontWeight: 900,
              color: "#1F2937"
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

              WebkitBackgroundClip:
                "text",

              WebkitTextFillColor:
                "transparent",
            }}
          >
            Vendor Portal
          </div>

        </div>

        {error && (

          <div
            style={{
              background: "#FEE2E2",
              color: "#B91C1C",
              padding: 12,
              borderRadius: 8,
              marginBottom: 20
            }}
          >
            {error}
          </div>
        )}

        <div
          style={{
            textAlign: "center",
            fontSize: 20,
            fontWeight: 600,
            marginBottom: 25
          }}
        >
          {
            mode === "login"
              ? "Vendor Login"
              : "Vendor Registration"
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

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) =>
                setPassword(
                  e.target.value
                )
              }
              required
              style={inputStyle}
            />

            <button
              type="submit"
              disabled={loading}
              style={buttonStyle}
            >
              {
                loading
                  ? "Logging In..."
                  : "Login"
              }
            </button>

            <p
              style={{
                textAlign: "center"
              }}
            >
              Don't have an account?{" "}

              <span
                style={{
                  color: "#3B82F6",
                  cursor: "pointer"
                }}
                onClick={() =>
                  setMode(
                    "signup"
                  )
                }
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

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) =>
                setPassword(
                  e.target.value
                )
              }
              required
              style={inputStyle}
            />

            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) =>
                setConfirmPassword(
                  e.target.value
                )
              }
              required
              style={inputStyle}
            />

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
                  color: "#3B82F6",
                  cursor: "pointer"
                }}
                onClick={() =>
                  setMode(
                    "login"
                  )
                }
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
  background: "#F3F4F6",
  borderRadius: 8,
  boxSizing: "border-box"
};

const buttonStyle = {
  width: "100%",
  padding: 14,

  background:
    "linear-gradient(135deg,#FFB84D,#FF6B6B)",

  border: "none",

  color: "#fff",

  fontWeight: 700,

  borderRadius: 8,

  cursor: "pointer",

  marginBottom: 20
};