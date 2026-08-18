// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import Header from "../components/Header";
// import ErrorMessage from "../components/ErrorMessage";
// import ImeiInput from "../components/ImeiInput";
// import P from "../theme/colors";

// export default function RegisterDevice() {
//   const navigate = useNavigate();

//   const [imei, setImei] =
//     useState("");
//   const [deviceVersion, setDeviceVersion] = useState("");

//   // const [solutionType, setSolutionType] =
//   //   useState("");
//   const [solution, setSolution] = useState("");

//   // const [certData, setCertData] =
//   //   useState(null);

//   const [loading, setLoading] =
//     useState(false);

//   const [error, setError] =
//     useState("");

//   // const handleDownload = async (url, filename) => {
//   //   try {
//   //     const token = localStorage.getItem("vendorToken");
//   //     const res = await fetch(`http://localhost:3000${url}`, {
//   //       headers: {
//   //         Authorization: `Bearer ${token}`
//   //       }
//   //     });

//   //     if (!res.ok) throw new Error("Download failed");

//   //     const blob = await res.blob();
//   //     const downloadUrl = window.URL.createObjectURL(blob);
//   //     const a = document.createElement("a");
//   //     a.href = downloadUrl;
//   //     a.download = filename;
//   //     document.body.appendChild(a);
//   //     a.click();
//   //     window.URL.revokeObjectURL(downloadUrl);
//   //     document.body.removeChild(a);
//   //   } catch (err) {
//   //     console.error("Download error:", err);
//   //   }
//   // };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!/^\d{15,16}$/.test(imei)) {
//       setError("IMEI must be 15 or 16 digits with no letters or symbols");
//       return;
//     }

//     try {
//       setLoading(true);
//       setError("");

//       const token = localStorage.getItem("vendorToken");

//       const res =
//         await fetch(
//           "http://localhost:3000/api/certs/generate",
//           //VPSCHANGE
//                     // "/api/certs/generate",

//           {
//             method: "POST",

//             headers: {
//               "Content-Type":
//                 "application/json",

//               Authorization:
//                 `Bearer ${token}`,
//             },

// //             body: JSON.stringify({
// //   imei,
// //   solution: solutionType,
// //   deviceVersion,
// // }),

// body: JSON.stringify({
//     imei,
//     solution,
//     deviceVersion,
// }),
//           }
//         );

//       // const data =
//       //   await res.json();

//       // if (!res.ok) {

//       //   setError(
//       //     data.error ||
//       //     "Certificate generation failed"
//       //   );

//       //   return;
//       // }


//       const data =
//         await res.json();

//       console.log(
//         "API RESPONSE:",
//         data
//       );

//       // if (!res.ok) {

//       //   console.error(
//       //     "Backend error:",
//       //     data
//       //   );

//       //   setError(
//       //     data.details ||
//       //     data.error ||
//       //     "Certificate generation failed"
//       //   );

//       //   return;
//       // }

//       if (!res.ok) {
//     console.error("Backend error:", data);

//     setError(
//         data.details ||
//         data.error ||
//         "Device registration failed"
//     );

//     return;
// }

// console.log("Device registration response:", data);

// navigate("/device-registered", {
//     state: {
//         device: data.device
//     }
// });

//       // console.log(
//       //   "Certificate response:",
//       //   data
//       // );

//       // setCertData(data);

//       console.log("Response:", data);
//       // navigate("/devices");
//       navigate("/device-registered", {
//     state: {
//         device: data.device
//     }
// });

//     } catch (err) {

//       console.error(err);

//       setError(
//         "Server error"
//       );

//     } finally {

//       setLoading(false);
//     }
//   };

//   const downloadButton = {
//     width: "100%",
//     padding: 14,
//     border: "none",
//     borderRadius: 12,
//     cursor: "pointer",
//     fontWeight: 700,
//     color: P.surface,
//     background: P.btnPrimary,
//   };

//   return (
// //     <div
// //       style={{
// //   minHeight: "100vh",
// //   background: P.bgGradient,
// //   padding: "160px 40px 20px",
// //   fontFamily: "'Inter', sans-serif",
// // }}
// //     >

// <div
//   style={{
//     minHeight: "100vh",
//     background: P.bgGradient,
//     fontFamily: "'Inter', sans-serif",

//     display: "flex",
//     flexDirection: "column",
//     alignItems: "center",
//     justifyContent: "center",

//     padding: "clamp(24px, 5vw, 60px) 20px",
//     boxSizing: "border-box",
//   }}
// >
//       {/* <div
//         style={{
//           maxWidth: 420,
//           margin: "0 auto",
//           background: P.surface,
//           borderRadius: 24,
//           padding: "32px 28px",
//           // boxShadow: "P.shadowCardLg, P.shadowCard",
//           // border: "1px solid ${P.border}",
//           boxShadow: `${P.shadowCardLg}, ${P.shadowCard}`,
// border: `1px solid ${P.border}`,
//         }}
//       > */}
//       <div
//   style={{
//     width: "100%",
//     maxWidth: 420,
//     boxSizing: "border-box",

//     background: P.surface,
//     borderRadius: 24,
//     padding: "clamp(24px, 5vw, 32px) clamp(20px, 5vw, 28px)",

//     boxShadow: `${P.shadowCardLg}, ${P.shadowCard}`,
//     border: `1px solid ${P.border}`,
//   }}
// >

//         <div
//           style={{
//             background: P.shadowCard,
//             borderRadius: 16,
//             padding: "10px 16px",
//             // marginBottom: 24,
//             display: "flex",
//             justifyContent: "center",
//             alignItems: "center",
//           }}
//         >
//           <img
//             src="/src/assets/logo.png"
//             alt="Logo"
//             style={{
//               width: 180,
//               height: 122,
//               objectFit: "contain",
//             }}
//           />
//         </div>

//         <h1
//           style={{
//             fontSize: 22,
//             fontWeight: 700,
//             color: P.textPrimary,
//             marginTop: 0,
//             marginBottom: 6,
//             fontFamily: "'DM Sans', sans-serif",
//             textAlign: "center",
//           }}
//         >
//           Register Device
//         </h1>

//         <p
//           style={{
//             color: P.textMuted,
//             marginBottom: 24,
//             fontSize: 13,
//             textAlign: "center",
//             fontFamily: "'Inter', sans-serif",
//           }}
//         >
//           Add a new inverter device
//         </p>

//         <ErrorMessage message={error} />

//         <form onSubmit={handleSubmit}>

//           {/* IMEI */}
//           <div
//             style={{
//               marginBottom: 14,
//             }}
//           >

//             <ImeiInput
//               value={imei}
//               onChange={(e) => setImei(e.target.value)}
//               placeholder="IMEI Number"
//               required
//               inputStyle={{
//                 padding: "15px 20px",
//                 borderRadius: 10,
//                 border: "none",
//                 background: P.surfaceForm,
//                 fontSize: 14,
//                 fontFamily: "'Inter', sans-serif",
//                 color: P.textPrimary,
//                 outline: "none",
//               }}
//             />
//           </div>

//           {/* Solution Type */}
//           <div
//             style={{
//               marginBottom: 14,
//               position: "relative",
//             }}
//           >
//             {/* Custom dropdown arrow */}
//             {/* <svg
//               style={{
//                 position: "absolute",
//                 right: 18,
//                 top: "50%",
//                 transform: "translateY(-50%)",
//                 pointerEvents: "none",
//                 color: P.textMuted,
//               }}
//               width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
//             >
//               <polyline points="6 9 12 15 18 9" />
//             </svg> */}
//             {/* <select

//               value={solutionType}
//               onChange={(e) => setSolutionType(e.target.value)}
//               style={{
//                 width: "100%",
//                 padding: "15px 20px",
//                 borderRadius: 10,
//                 border: "none",
//                 background: P.surfaceForm,
//                 fontSize: 14,
//                 fontFamily: "'Inter', sans-serif",
//                 color: solutionType ? P.textPrimary : P.textMuted,
//                 outline: "none",
//                 appearance: "none",
//                 WebkitAppearance: "none",
//                 cursor: "pointer",
//               }}
//               required
//             >
//               <option value="">
//                 Select Solution Type
//               </option>

//               <option value="ongridrooftop">
//                 On Grid Rooftop
//               </option>

//               <option value="offgridrooftop">
//                 Off Grid Rooftop
//               </option>

//               <option value="hybridrooftop">
//                 Hybrid Grid Rooftop
//               </option>
//             </select> */}


//             {/* Solution */}
// <div
//   style={{
//     marginBottom: 14,
//   }}
// >
//   <input
//     type="text"
//     placeholder="Solution"
//     value={solution}
//     onChange={(e) => setSolution(e.target.value)}
//     style={{
//       width: "100%",
//       padding: "15px 20px",
//       borderRadius: 10,
//       border: "none",
//       background: P.surfaceForm,
//       fontSize: 14,
//       fontFamily: "'Inter', sans-serif",
//       color: P.textPrimary,
//       boxSizing: "border-box",
//       outline: "none",
//     }}
//     required
//   />
// </div>
//           </div>

//           <div
//   style={{
//     marginBottom: 24,
//   }}
// >
//   <input
//     type="text"
//     placeholder="Device Version"
//     value={deviceVersion}
//     onChange={(e) => setDeviceVersion(e.target.value)}
//     style={{
//       width: "100%",
//       padding: "15px 20px",
//       borderRadius: 10,
//       border: "none",
//       background: P.surfaceForm,
//       fontSize: 14,
//       fontFamily: "'Inter', sans-serif",
//       color: P.textPrimary,
//       boxSizing: "border-box",
//       outline: "none",
//     }}
//     required
//   />
// </div>

//           <button
//             type="submit"
//             disabled={loading}
//             style={{
//               width: "100%",
//               padding: "15px 16px",
//               border: "none",
//               borderRadius: 50,
//               fontWeight: 700,
//               fontSize: 16,
//               cursor: loading ? "not-allowed" : "pointer",
//               color: P.surface,
//               opacity: loading ? 0.7 : 1,
//               background: P.btnPrimary,
//               boxShadow: P.shadowBtn,
//               fontFamily: "'DM Sans', sans-serif",
//               letterSpacing: 0.3,
//             }}
//           >
//             {loading ? "Registering..." : "Register Device"}
//           </button>

//           {/* Back Button */}
// <div
//   style={{
//     maxWidth: 420,
//     margin: "16px auto 0",
//   }}
// >
//   <button
//     onClick={() => navigate("/devices")}
//     style={{
//       width: "100%",
//       padding: "14px 16px",
//       border: "1px solid #E8E8E8",
//       borderRadius: 30,
//       cursor: "pointer",
//       fontWeight: 600,
//       fontSize: 14,
//       color: P.textSecond,
//       background: P.surface,
//       fontFamily: "'Inter', sans-serif",
//       boxShadow: P.shadowCard,
//     }}
//   >
//     ← Back to Dashboard
//   </button>
// </div>
//         </form>

//         {/* Certificate Result */}
//         {/* {certData && (
//           <div
//             style={{
//               marginTop: 30,
//               padding: 24,
//               borderRadius: 20,
//               background:
//                 P.surfaceWarm,
//             }}
//           >
//             <h3>
//               Certificate Generated ✅
//             </h3>

//             <p>
//               Download your files
//             </p>

//             <div
//               style={{
//                 display: "flex",
//                 flexDirection:
//                   "column",
//                 gap: 12,
//               }}
//             > */}


// {/* 

//               <button
//                 style={downloadButton}
//                 onClick={() =>
//                   downloadFile(
//                     certData.downloads.certificate,
//                     "device.crt"
//                   )
//                 }
//               >
//                 Download Certificate
//               </button>
//               <button
//                 style={downloadButton}
//                 onClick={() =>
//                   downloadFile(
//                     certData.downloads.private_key,
//                     "device.key"
//                   )
//                 }
//               >
//                 Download Private Key
//               </button>

//               <button
//                 style={downloadButton}
//                 onClick={() =>
//                   downloadFile(
//                     certData.downloads.ca_certificate,
//                     "ca.crt"
//                   )
//                 }
//               >
//                 Download CA Certificate
//               </button>

//               <button
//                 style={downloadButton}
//                 onClick={() =>
//                   navigate(
//                     `/credentials/${certData.certificate_id}`
//                   )
//                 }
//               >
//                 Show Credentials
//               </button> */}
// {/* 

//             </div>
//           </div>
//         )} */}
//       </div>
      
//     </div>
//   );
// }

















// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import ErrorMessage from "../components/ErrorMessage";
// import ImeiInput from "../components/ImeiInput";
// import P from "../theme/colors";

// export default function RegisterDevice() {
//   const navigate = useNavigate();

//   const [imei, setImei] = useState("");
//   const [deviceVersion, setDeviceVersion] = useState("");
//   const [solution, setSolution] = useState("");

//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // Validate IMEI
//     if (!/^\d{15,16}$/.test(imei)) {
//       setError(
//         "IMEI must be 15 or 16 digits with no letters or symbols"
//       );
//       return;
//     }

//     try {
//       setLoading(true);
//       setError("");

//       const token = localStorage.getItem("vendorToken");

//       const res = await fetch(
//         "http://localhost:3000/api/certs/generate",
//         // VPSCHANGE
//         // "/api/certs/generate",
//         {
//           method: "POST",

//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },

//           body: JSON.stringify({
//             imei,
//             solution,
//             deviceVersion,
//           }),
//         }
//       );

//       const data = await res.json();

//       console.log("API RESPONSE:", data);

//       if (!res.ok) {
//         console.error("Backend error:", data);

//         setError(
//           data.details ||
//             data.error ||
//             "Device registration failed"
//         );

//         return;
//       }

//       console.log(
//         "Device registration response:",
//         data
//       );

//       // Go to registered device page
//       navigate("/device-registered", {
//         state: {
//           device: data.device,
//         },
//       });
//     } catch (err) {
//       console.error(err);

//       setError("Server error");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div
//       style={{
//         minHeight: "100vh",
//         background: P.bgGradient,
//         fontFamily: "'Inter', sans-serif",

//         display: "flex",
//         flexDirection: "column",
//         alignItems: "center",
//         justifyContent: "center",

//         // Extra bottom space for fixed back button
//         padding:
//           "clamp(24px, 5vw, 60px) 20px 110px",

//         boxSizing: "border-box",
//       }}
//     >

//       {/* =====================================================
//             HEADER CARD
//             LOGO + TITLE
//         ===================================================== */}
//         <div
//           style={{
//             background: P.surface,
//             borderRadius: 18,

//             padding: "14px 16px",
//             marginBottom: 22,

//             boxShadow: P.shadowCard,
//             border: `1px solid ${P.border}`,

//             display: "flex",
//             alignItems: "center",
//             gap: 16,
//           }}
//         >
//           {/* LOGO */}
//           <div
//             style={{
//               width: 72,
//               height: 72,
//               flexShrink: 0,

//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",

//               borderRadius: 14,
//             }}
//           >
//             <img
//               src="/src/assets/logo.png"
//               alt="Company Logo"
//               style={{
//                 width: 72,
//                 height: 72,
//                 objectFit: "contain",
//               }}
//             />
//           </div>

//           {/* TITLE + SUBTITLE */}
//           <div
//             style={{
//               flex: 1,
//               minWidth: 0,
//             }}
//           >
//             <h1
//               style={{
//                 margin: 0,

//                 fontSize: 24,
//                 fontWeight: 800,

//                 color: P.textPrimary,

//                 fontFamily:
//                   "'DM Sans', sans-serif",

//                 lineHeight: 1.15,
//               }}
//             >
//               Register Device
//             </h1>

//             <p
//               style={{
//                 margin: "5px 0 0",

//                 fontSize: 13,

//                 color: P.textMuted,

//                 fontFamily:
//                   "'Inter', sans-serif",

//                 lineHeight: 1.3,
//               }}
//             >
//               Add a new inverter device
//             </p>
//           </div>
//         </div>
//       {/* =====================================================
//           MAIN REGISTRATION CARD
//       ===================================================== */}
//       <div
//         style={{
//           width: "100%",
//           maxWidth: 420,
//           boxSizing: "border-box",

//           background: P.surface,
//           borderRadius: 24,

//           padding:
//             "clamp(24px, 5vw, 32px) clamp(20px, 5vw, 28px)",

//           boxShadow: `${P.shadowCardLg}, ${P.shadowCard}`,
//           border: `1px solid ${P.border}`,
//         }}
//       >
        

//         {/* =====================================================
//             ERROR MESSAGE
//         ===================================================== */}
//         <ErrorMessage message={error} />

//         {/* =====================================================
//             FORM
//         ===================================================== */}
//         <form onSubmit={handleSubmit}>
//           {/* =================================================
//               IMEI
//           ================================================= */}
//           <div
//             style={{
//               marginBottom: 14,
//             }}
//           >
//             <ImeiInput
//               value={imei}
//               onChange={(e) =>
//                 setImei(e.target.value)
//               }
//               placeholder="IMEI Number"
//               required
//               inputStyle={{
//                 width: "100%",
//                 padding: "15px 20px",

//                 borderRadius: 10,
//                 border: "none",

//                 background:
//                   P.surfaceForm,

//                 fontSize: 14,

//                 fontFamily:
//                   "'Inter', sans-serif",

//                 color: P.textPrimary,

//                 outline: "none",
//                 boxSizing: "border-box",
//               }}
//             />
//           </div>

//           {/* =================================================
//               SOLUTION
//           ================================================= */}
//           <div
//             style={{
//               marginBottom: 14,
//             }}
//           >
//             <input
//               type="text"
//               placeholder="Solution"
//               value={solution}
//               onChange={(e) =>
//                 setSolution(e.target.value)
//               }
//               style={{
//                 width: "100%",

//                 padding: "15px 20px",

//                 borderRadius: 10,
//                 border: "none",

//                 background:
//                   P.surfaceForm,

//                 fontSize: 14,

//                 fontFamily:
//                   "'Inter', sans-serif",

//                 color: P.textPrimary,

//                 boxSizing: "border-box",
//                 outline: "none",
//               }}
//               required
//             />
//           </div>

//           {/* =================================================
//               DEVICE VERSION
//           ================================================= */}
//           <div
//             style={{
//               marginBottom: 24,
//             }}
//           >
//             <input
//               type="text"
//               placeholder="Device Version"
//               value={deviceVersion}
//               onChange={(e) =>
//                 setDeviceVersion(
//                   e.target.value
//                 )
//               }
//               style={{
//                 width: "100%",

//                 padding: "15px 20px",

//                 borderRadius: 10,
//                 border: "none",

//                 background:
//                   P.surfaceForm,

//                 fontSize: 14,

//                 fontFamily:
//                   "'Inter', sans-serif",

//                 color: P.textPrimary,

//                 boxSizing: "border-box",
//                 outline: "none",
//               }}
//               required
//             />
//           </div>

//           {/* =================================================
//               REGISTER BUTTON
//           ================================================= */}
//           <button
//             type="submit"
//             disabled={loading}
//             style={{
//               width: "100%",

//               padding: "15px 16px",

//               border: "none",
//               borderRadius: 50,

//               fontWeight: 700,
//               fontSize: 16,

//               cursor: loading
//                 ? "not-allowed"
//                 : "pointer",

//               color: P.surface,

//               opacity: loading
//                 ? 0.7
//                 : 1,

//               background:
//                 P.btnPrimary,

//               boxShadow:
//                 P.shadowBtn,

//               fontFamily:
//                 "'DM Sans', sans-serif",

//               letterSpacing: 0.3,
//             }}
//           >
//             {loading
//               ? "Registering..."
//               : "Register Device"}
//           </button>
//         </form>
//       </div>

//       {/* =====================================================
//           FIXED BACK BUTTON
//           BOTTOM LEFT
//       ===================================================== */}
//       <div
//         style={{
//           position: "fixed",

//           left: 30,

//           bottom:
//             "calc(36px + env(safe-area-inset-bottom))",

//           zIndex: 1000,
//         }}
//       >
//         <button
//           type="button"
//           onClick={() =>
//             navigate("/devices")
//           }
//           aria-label="Back to dashboard"
//           style={{
//             width: 44,
//             height: 44,

//             borderRadius: "50%",

//             border:
//               `1px solid ${P.border}`,

//             background:
//               P.surface,

//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",

//             padding: 0,

//             cursor: "pointer",

//             color:
//               P.textSecond,

//             fontSize: 22,
//             fontWeight: 500,

//             lineHeight: 1,

//             fontFamily:
//               "'Inter', sans-serif",

//             boxShadow:
//               "0 4px 14px rgba(0, 0, 0, 0.16)",

//             WebkitTapHighlightColor:
//               "transparent",
//           }}
//         >
//           ←
//         </button>
//       </div>
//     </div>
//   );
// }





import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ErrorMessage from "../components/ErrorMessage";
import ImeiInput from "../components/ImeiInput";
import P from "../theme/colors";

export default function RegisterDevice() {
  const navigate = useNavigate();

  const [imei, setImei] = useState("");
  const [deviceVersion, setDeviceVersion] = useState("");
  const [solution, setSolution] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate IMEI
    if (!/^\d{15,16}$/.test(imei)) {
      setError(
        "IMEI must be 15 or 16 digits with no letters or symbols"
      );
      return;
    }

    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("vendorToken");

      const res = await fetch(
        "http://localhost:3000/api/certs/generate",
        // VPSCHANGE
        // "/api/certs/generate",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            imei,
            solution,
            deviceVersion,
          }),
        }
      );

      const data = await res.json();

      console.log("API RESPONSE:", data);

      if (!res.ok) {
        console.error("Backend error:", data);

        setError(
          data.details ||
            data.error ||
            "Device registration failed"
        );

        return;
      }

      console.log(
        "Device registration response:",
        data
      );

      navigate("/device-registered", {
        state: {
          device: data.device,
        },
      });
    } catch (err) {
      console.error(err);
      setError("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: P.bgGradient,
        fontFamily: "'Inter', sans-serif",

        display: "flex",
        flexDirection: "column",
        alignItems: "center",

        // Header starts from the top
        justifyContent: "flex-start",

        padding:
          "24px 20px 110px",

        boxSizing: "border-box",
      }}
    >
      {/* =====================================================
          HEADER CARD
          LOGO + TITLE
      ===================================================== */}
      <div
        style={{
          width: "100%",
          maxWidth: 420,
          boxSizing: "border-box",

          background: P.surface,
          borderRadius: 24,

          padding:
            "18px 22px",

          marginBottom: 18,

          boxShadow:
            `${P.shadowCardLg}, ${P.shadowCard}`,

          border:
            `1px solid ${P.border}`,

          display: "flex",
          alignItems: "center",

          gap: 18,
        }}
      >
        {/* LOGO */}
        <div
          style={{
            width: 76,
            height: 76,

            flexShrink: 0,

            display: "flex",
            alignItems: "center",
            justifyContent: "center",

            borderRadius: 14,
          }}
        >
          <img
            src="/src/assets/logo.png"
            alt="Company Logo"
            style={{
              width: 116,
              height: 116,
              objectFit: "contain",
            }}
          />
        </div>

        {/* TITLE + SUBTITLE */}
        <div
          style={{
            flex: 1,
            minWidth: 0,
          }}
        >
          <h1
            style={{
              margin: 0,

              fontSize: 26,
              fontWeight: 800,

              color: P.textPrimary,

              fontFamily:
                "'DM Sans', sans-serif",

              lineHeight: 1.15,
            }}
          >
            Register Device
          </h1>

          <p
            style={{
              margin: "5px 0 0",

              fontSize: 13,

              color: P.amber,

              fontFamily:
                "'Inter', sans-serif",

              lineHeight: 1.3,
            }}
          >
            Add a new inverter device
          </p>
        </div>
      </div>

      {/* =====================================================
          REGISTRATION CARD
      ===================================================== */}
      <div
        style={{
          width: "100%",
          maxWidth: 420,
          boxSizing: "border-box",

          background: P.surface,
          borderRadius: 24,

          padding:
            "24px 22px",

          boxShadow:
            `${P.shadowCardLg}, ${P.shadowCard}`,

          border:
            `1px solid ${P.border}`,
        }}
      >
        {/* =================================================
            CARD HEADING
        ================================================= */}
        <div
          style={{
            marginBottom: 20,
          }}
        >
          <h2
            style={{
              margin: 0,

              fontSize: 20,
              fontWeight: 800,

              color: P.textPrimary,

              fontFamily:
                "'DM Sans', sans-serif",

              lineHeight: 1.2,
            }}
          >
            Device Details
          </h2>

          <p
            style={{
              margin: "5px 0 0",

              fontSize: 12,

              color: P.textMuted,

              fontFamily:
                "'Inter', sans-serif",

              lineHeight: 1.4,
            }}
          >
            Enter the details of your inverter device
          </p>
        </div>

        {/* =================================================
            ERROR MESSAGE
        ================================================= */}
        <ErrorMessage message={error} />

        {/* =================================================
            FORM
        ================================================= */}
        <form onSubmit={handleSubmit}>
          {/* =================================================
              IMEI
          ================================================= */}
          <div
            style={{
              marginBottom: 14,
            }}
          >
            <ImeiInput
              value={imei}
              onChange={(e) =>
                setImei(e.target.value)
              }
              placeholder="IMEI Number"
              required
              inputStyle={{
                width: "100%",

                padding: "15px 20px",

                borderRadius: 10,
                border: "none",

                background:
                  P.surfaceForm,

                fontSize: 14,

                fontFamily:
                  "'Inter', sans-serif",

                color: P.textPrimary,

                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>
          {/* =================================================
              DEVICE VERSION
          ================================================= */}
          <div
            style={{
              marginBottom: 24,
            }}
          >
            <input
              type="text"
              placeholder="Device Version"
              value={deviceVersion}
              onChange={(e) =>
                setDeviceVersion(
                  e.target.value
                )
              }
              style={{
                width: "100%",

                padding: "15px 20px",

                borderRadius: 10,
                border: "none",

                background:
                  P.surfaceForm,

                fontSize: 14,

                fontFamily:
                  "'Inter', sans-serif",

                color: P.textPrimary,

                boxSizing: "border-box",
                outline: "none",
              }}
              required
            />
          </div>

          {/* =================================================
              SOLUTION
          ================================================= */}
          <div
            style={{
              marginBottom: 14,
            }}
          >
            <input
              type="text"
              placeholder="Device Type"
              value={solution}
              onChange={(e) =>
                setSolution(e.target.value)
              }
              style={{
                width: "100%",

                padding: "15px 20px",

                borderRadius: 10,
                border: "none",

                background:
                  P.surfaceForm,

                fontSize: 14,

                fontFamily:
                  "'Inter', sans-serif",

                color: P.textPrimary,

                boxSizing: "border-box",
                outline: "none",
              }}
              required
            />
          </div>

          

          {/* =================================================
              REGISTER BUTTON
          ================================================= */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",

              padding: "15px 16px",

              border: "none",
              borderRadius: 50,

              fontWeight: 700,
              fontSize: 16,

              cursor: loading
                ? "not-allowed"
                : "pointer",

              color: P.surface,

              opacity: loading
                ? 0.7
                : 1,

              background:
                P.btnPrimary,

              boxShadow:
                P.shadowBtn,

              fontFamily:
                "'DM Sans', sans-serif",

              letterSpacing: 0.3,
            }}
          >
            {loading
              ? "Registering..."
              : "Register Device"}
          </button>
        </form>
      </div>

      {/* =====================================================
          FIXED BACK BUTTON
          BOTTOM LEFT
      ===================================================== */}
      <div
        style={{
          position: "fixed",

          left: 30,

          bottom:
            "calc(36px + env(safe-area-inset-bottom))",

          zIndex: 1000,
        }}
      >
        <button
          type="button"
          onClick={() =>
            navigate("/devices")
          }
          aria-label="Back to dashboard"
          style={{
            width: 44,
            height: 44,

            borderRadius: "50%",

            border:
              `1px solid ${P.border}`,

            background:
              P.surface,

            display: "flex",
            alignItems: "center",
            justifyContent: "center",

            padding: 0,

            cursor: "pointer",

            color:
              P.textSecond,

            fontSize: 22,
            fontWeight: 500,

            lineHeight: 1,

            fontFamily:
              "'Inter', sans-serif",

            boxShadow:
              "0 4px 14px rgba(0, 0, 0, 0.16)",

            WebkitTapHighlightColor:
              "transparent",
          }}
        >
          ←
        </button>
      </div>
    </div>
  );
}
