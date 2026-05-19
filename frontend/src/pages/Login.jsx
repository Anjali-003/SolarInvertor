// import { useState } from "react";

// export default function Login() {

//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//   const handleLogin = async () => {

//     const res = await fetch(
//       "http://localhost:3000/api/auth/login",
//       {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           email,
//           password,
//         }),
//       }
//     );

//     const data = await res.json();

//     if (data.token) {

//       // save token
//       localStorage.setItem(
//         "token",
//         data.token
//       );
//         navigate("/");
//       alert("Login Success");
//     } else {
//       alert(data.error);
//     }
//   };

//   return (
//     <div>
//       <h1>Login</h1>

//       <input
//         placeholder="Email"
//         value={email}
//         onChange={(e) =>
//           setEmail(e.target.value)
//         }
//       />

//       <input
//         type="password"
//         placeholder="Password"
//         value={password}
//         onChange={(e) =>
//           setPassword(e.target.value)
//         }
//       />

//       <button onClick={handleLogin}>
//         Login
//       </button>
//     </div>
//   );
// }




// import { useState } from "react";
// import { useNavigate } from "react-router-dom";

// export default function Login() {

//   const navigate = useNavigate();

//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//   const login = async (e) => {

//     e.preventDefault();

//     try {

//       const res = await fetch(
//         "http://localhost:3000/api/auth/login",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             email,
//             password,
//           }),
//         }
//       );

//       const data = await res.json();

//       if (data.token) {

//         localStorage.setItem(
//           "token",
//           data.token
//         );

//         navigate("/");
//       }

//     } catch (err) {

//       console.log(err);
//     }
//   };

//   return (

//     <div style={{
//       height: "100vh",
//       display: "flex",
//       justifyContent: "center",
//       alignItems: "center",
//     }}>

//       <form
//         onSubmit={login}
//         style={{
//           display: "flex",
//           flexDirection: "column",
//           gap: 12,
//           width: 300,
//         }}
//       >

//         <h2>Login</h2>

//         <input
//           placeholder="Email"
//           value={email}
//           onChange={(e) =>
//             setEmail(e.target.value)
//           }
//         />

//         <input
//           type="password"
//           placeholder="Password"
//           value={password}
//           onChange={(e) =>
//             setPassword(e.target.value)
//           }
//         />

//         <button type="submit">
//           Login
//         </button>

//       </form>

//     </div>
//   );
// }




import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {

  const navigate = useNavigate();

  // mode
  const [mode, setMode] = useState("login");

  // LOGIN
  const [identifier, setIdentifier] =
    useState("");

  const [password, setPassword] =
    useState("");

  // SETUP DEVICE
  const [serialNumber, setSerialNumber] =
    useState("");

  const [clientName, setClientName] =
    useState("");

  const [phone, setPhone] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [confirmPassword,
    setConfirmPassword] =
    useState("");

  const [error, setError] =
    useState("");

  // LOGIN
  const login = async (e) => {

    e.preventDefault();

    setError("");

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

      const data = await res.json();

      if (!res.ok) {

        setError(
          data.error || "Login failed"
        );

        return;
      }

      localStorage.setItem(
        "token",
        data.token
      );

      navigate("/");

    } catch (err) {

      console.log(err);

      setError("Server error");
    }
  };

  // SETUP DEVICE
  const setupDevice = async (e) => {

    e.preventDefault();

    setError("");

    try {

      const res = await fetch(
        "http://localhost:3000/api/auth/setup-device",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({

            serial_number:
              serialNumber,

            client_name:
              clientName,

            phone,

            email,

            password,

            confirm_password:
              confirmPassword,

          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {

        setError(
          data.error ||
          "Setup failed"
        );

        return;
      }

      alert(
        "Device setup successful"
      );

      setMode("login");

    } catch (err) {

      console.log(err);

      setError("Server error");
    }
  };

  return (

    <div style={{
      height: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      background: "#FFFDF5",
      fontFamily: "sans-serif",
    }}>

      <div style={{
        width: 350,
        padding: 30,
        borderRadius: 12,
        background: "#fff",
        boxShadow:
          "0 2px 12px rgba(0,0,0,0.08)",
      }}>

        {/* TABS */}
        <div style={{
          display: "flex",
          marginBottom: 20,
        }}>

          <button
            onClick={() =>
              setMode("login")
            }
            style={{
              flex: 1,
              padding: 10,
              background:
                mode === "login"
                  ? "#F59E0B"
                  : "#eee",
              border: "none",
              cursor: "pointer",
            }}
          >
            Login
          </button>

          <button
            onClick={() =>
              setMode("setup")
            }
            style={{
              flex: 1,
              padding: 10,
              background:
                mode === "setup"
                  ? "#F59E0B"
                  : "#eee",
              border: "none",
              cursor: "pointer",
            }}
          >
            Setup Device
          </button>

        </div>

        {/* ERROR */}
        {error && (
          <div style={{
            color: "red",
            marginBottom: 12,
          }}>
            {error}
          </div>
        )}

        {/* LOGIN */}
        {mode === "login" && (

          <form
            onSubmit={login}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 12,
            }}
          >

            <h2>Login</h2>

            <input
              placeholder="Email / Phone / Serial No"
              value={identifier}
              onChange={(e) =>
                setIdentifier(
                  e.target.value
                )
              }
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
            />

            <button type="submit">
              Login
            </button>

          </form>
        )}

        {/* SETUP DEVICE */}
        {mode === "setup" && (

          <form
            onSubmit={setupDevice}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 12,
            }}
          >

            <h2>Setup Device</h2>

            <input
              placeholder="Serial Number"
              value={serialNumber}
              onChange={(e) =>
                setSerialNumber(
                  e.target.value
                )
              }
            />

            <input
              placeholder="Client Name"
              value={clientName}
              onChange={(e) =>
                setClientName(
                  e.target.value
                )
              }
            />

            <input
              placeholder="Phone"
              value={phone}
              onChange={(e) =>
                setPhone(
                  e.target.value
                )
              }
            />

            <input
              placeholder="Email"
              value={email}
              onChange={(e) =>
                setEmail(
                  e.target.value
                )
              }
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
            />

            <button type="submit">
              Setup Device
            </button>

          </form>
        )}

      </div>

    </div>
  );
}