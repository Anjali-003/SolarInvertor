// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useInverter } from "../context/Context";
// import P from "../theme/colors";

// export default function AddDevice() {

//     const navigate = useNavigate();

//     const {
//         refreshDevices
//     } = useInverter();

//     const [imei, setImei] =
//         useState("");

//     const [error, setError] =
//         useState("");

//     const [success, setSuccess] =
//         useState("");

//     const [loading, setLoading] =
//         useState(false);


//     const handleSubmit = async (e) => {

//         e.preventDefault();

//         setError("");
//         setSuccess("");

//         const cleanImei =
//             imei.trim();


//         if (!/^\d{15}$/.test(cleanImei)) {

//             setError(
//                 "IMEI must be exactly 15 digits"
//             );

//             return;
//         }


//         const token =
//             localStorage.getItem("token");


//         if (!token) {

//             setError(
//                 "Please login again"
//             );

//             navigate("/login");

//             return;
//         }


//         setLoading(true);


//         try {

//             const res = await fetch(
//                 "http://localhost:3000/api/user/devices",
//                 {
//                     method: "POST",

//                     headers: {
//                         "Content-Type":
//                             "application/json",

//                         Authorization:
//                             `Bearer ${token}`
//                     },

//                     body: JSON.stringify({
//                         imei: cleanImei
//                     })
//                 }
//             );


//             const result =
//                 await res.json();


//             if (!res.ok) {

//                 setError(
//                     result.error ||
//                     "Failed to add device"
//                 );

//                 return;
//             }


//             setSuccess(
//                 "Device added successfully"
//             );

//             setImei("");


//             // Refresh context device list
//             await refreshDevices();


//         } catch (err) {

//             console.error(
//                 "Add device error:",
//                 err
//             );

//             setError(
//                 "Server error. Please try again."
//             );

//         } finally {

//             setLoading(false);
//         }
//     };


//     return (
//         <div
//             style={{
//                 padding: 20,
//                 minHeight: "100vh",
//                 background: P.bg
//             }}
//         >

//             <h2>
//                 Add Device
//             </h2>


//             {error && (
//                 <div
//                     style={{
//                         color: "red",
//                         marginBottom: 12
//                     }}
//                 >
//                     {error}
//                 </div>
//             )}


//             {success && (
//                 <div
//                     style={{
//                         color: "green",
//                         marginBottom: 12
//                     }}
//                 >
//                     {success}
//                 </div>
//             )}


//             <form
//                 onSubmit={handleSubmit}
//             >

//                 <input
//                     type="text"
//                     inputMode="numeric"
//                     maxLength={15}
//                     placeholder="IMEI"
//                     value={imei}
//                     onChange={(e) =>
//                         setImei(
//                             e.target.value
//                                 .replace(/\D/g, "")
//                         )
//                     }
//                     style={{
//                         width: "100%",
//                         padding: 14,
//                         boxSizing: "border-box",
//                         marginBottom: 12
//                     }}
//                 />


//                 <button
//                     type="submit"
//                     disabled={loading}
//                 >
//                     {loading
//                         ? "Adding..."
//                         : "Add Device"}
//                 </button>

//             </form>

//         </div>
//     );
// }











// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useInverter } from "../context/Context";
// import P from "../theme/colors";

// export default function AddDevice() {

//     const navigate = useNavigate();

//     const {
//         devices,
//         refreshDevices,
//         setSelectedDeviceId
//     } = useInverter();

//     const [imei, setImei] =
//         useState("");

//         const [location, setLocation] = useState("");

//     const [error, setError] =
//         useState("");

//     const [success, setSuccess] =
//         useState("");

//     const [loading, setLoading] =
//         useState(false);


//     const handleSubmit = async (e) => {

//         e.preventDefault();

//         setError("");
//         setSuccess("");

//         const cleanImei =
//             imei.trim();


//         // ============================================
//         // VALIDATE IMEI
//         // ============================================

//         if (!/^\d{15}$/.test(cleanImei)) {

//             setError(
//                 "IMEI must be exactly 15 digits"
//             );

//             return;
//         }


//         // ============================================
//         // GET TOKEN
//         // ============================================

//         const token =
//             localStorage.getItem("token");


//         if (!token) {

//             setError(
//                 "Please login again"
//             );

//             navigate("/login");

//             return;
//         }


//         setLoading(true);


//         try {

//             // ========================================
//             // ADD DEVICE
//             // ========================================

//             const res = await fetch(
//                 "http://localhost:3000/api/user/devices",
//                 {
//                     method: "POST",

//                     headers: {
//                         "Content-Type":
//                             "application/json",

//                         Authorization:
//                             `Bearer ${token}`
//                     },

//                     body: JSON.stringify({
//                         imei: cleanImei,
//                             location: location.trim()

//                     })
//                 }
//             );


//             const result =
//                 await res.json();


//             if (!res.ok) {

//                 setError(
//                     result.error ||
//                     "Failed to add device"
//                 );

//                 return;
//             }


//             // ========================================
//             // DEVICE WAS ADDED
//             // ========================================

//             setSuccess(
//                 "Device added successfully"
//             );

//             setImei("");
//             setLocation("");


//             // ========================================
//             // REFRESH USER'S DEVICE LIST
//             // ========================================

//             await refreshDevices();


//             // ========================================
//             // FIND THE NEW DEVICE
//             // ========================================

//             /*
//              * IMPORTANT:
//              *
//              * refreshDevices() updates React state.
//              * Therefore `devices` here may still contain
//              * the OLD device list during this function.
//              *
//              * The cleanest solution is for the backend
//              * POST response to return the newly added
//              * device.
//              */

//             if (result.device?.id) {

//                 setSelectedDeviceId(
//                     result.device.id
//                 );

//             }


//             // ========================================
//             // GO BACK TO DASHBOARD
//             // ========================================

//             navigate("/");

//         } catch (err) {

//             console.error(
//                 "Add device error:",
//                 err
//             );

//             setError(
//                 "Server error. Please try again."
//             );

//         } finally {

//             setLoading(false);
//         }
//     };


//     // ================================================
//     // BACK TO DEVICE LIST
//     // ================================================

//     const handleBack = () => {

//         navigate(-1);

//     };


//     return (
//         <div
//             style={{
//                 minHeight: "100vh",
//                 background: P.bg,
//                 padding: 20,
//                 boxSizing: "border-box",
//                 position: "relative"
//             }}
//         >

//             <div
//                 style={{
//                     maxWidth: 500,
//                     margin: "0 auto"
//                 }}
//             >

//                 {/* <h2
//                     style={{
//                         color: P.textPrimary,
//                         marginBottom: 24
//                     }}
//                 >
//                     Add Device
//                 </h2> */}
// <div
//         style={{
//           width: "100%",
//           maxWidth: 420,
//           boxSizing: "border-box",

//           background: P.surface,
//           borderRadius: 24,

//           padding:
//             "18px 22px",

//           marginBottom: 18,

//           boxShadow:
//             `${P.shadowCardLg}, ${P.shadowCard}`,

//           border:
//             `1px solid ${P.border}`,

//           display: "flex",
//           alignItems: "center",

//           gap: 18,
//         }}
//       >
//         {/* LOGO */}
//         <div
//           style={{
//             width: 76,
//             height: 76,

//             flexShrink: 0,

//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",

//             borderRadius: 14,
//           }}
//         >
//           <img
//             src="/src/assets/logo.png"
//             alt="Company Logo"
//             style={{
//               width: 116,
//               height: 116,
//               objectFit: "contain",
//             }}
//           />
//         </div>

//         {/* TITLE + SUBTITLE */}
//         <div
//           style={{
//             flex: 1,
//             minWidth: 0,
//           }}
//         >
//           <h1
//             style={{
//               margin: 0,

//               fontSize: 26,
//               fontWeight: 800,

//               color: P.textPrimary,

//               fontFamily:
//                 "'DM Sans', sans-serif",

//               lineHeight: 1.15,
//             }}
//           >
//             Add Device
//           </h1>

//           <p
//             style={{
//               margin: "5px 0 0",

//               fontSize: 13,

//               color: P.amber,

//               fontFamily:
//                 "'Inter', sans-serif",

//               lineHeight: 1.3,
//             }}
//           >
//             Add a new device
//           </p>
//         </div>
//       </div>

//                 {/* =================================
//                     ERROR
//                 ================================== */}

//                 {error && (
//                     <div
//                         style={{
//                             color: "red",
//                             marginBottom: 12,
//                             padding: 12,
//                             borderRadius: 10,
//                             background: "#fff1f1"
//                         }}
//                     >
//                         {error}
//                     </div>
//                 )}


//                 {/* =================================
//                     SUCCESS
//                 ================================== */}

//                 {success && (
//                     <div
//                         style={{
//                             color: "green",
//                             marginBottom: 12,
//                             padding: 12,
//                             borderRadius: 10,
//                             background: "#effcf3"
//                         }}
//                     >
//                         {success}
//                     </div>
//                 )}


//                 {/* =================================
//                     FORM
//                 ================================== */}

//                 <form
//                     onSubmit={handleSubmit}
//                 >

//                     <input
//                         type="text"
//                         inputMode="numeric"
//                         maxLength={15}
//                         placeholder="IMEI"
//                         value={imei}
//                         onChange={(e) =>
//                             setImei(
//                                 e.target.value
//                                     .replace(/\D/g, "")
//                             )
//                         }
//                         style={{
//                             width: "100%",
//                             padding: 14,
//                             boxSizing: "border-box",
//                             marginBottom: 12,
//                             border: `1px solid ${P.border}`,
//                             borderRadius: 10,
//                             outline: "none"
//                         }}
//                     />

//                     <input
//     type="text"
//     placeholder="Location"
//     value={location}
//     onChange={(e) => setLocation(e.target.value)}
//     style={{
//         width: "100%",
//         padding: 14,
//         boxSizing: "border-box",
//         marginBottom: 12,
//         border: `1px solid ${P.border}`,
//         borderRadius: 10,
//         outline: "none"
//     }}
//     required
// />


//                     <button
//                         type="submit"
//                         disabled={loading}
//                         style={{
//                             width: "100%",
//                             padding: 14,
//                             border: "none",
//                             borderRadius: 10,
//                             background:
//                                 P.btnPrimary,
//                             color:
//                                 P.textWhite,
//                             fontWeight: 700,
//                             cursor:
//                                 loading
//                                     ? "not-allowed"
//                                     : "pointer",
//                             opacity:
//                                 loading
//                                     ? 0.7
//                                     : 1
//                         }}
//                     >
//                         {loading
//                             ? "Adding..."
//                             : "Add Device"}
//                     </button>

//                 </form>

//             </div>


//             {/* =====================================
//                 BACK BUTTON
//             ====================================== */}
// {/* 
//             <button
//                 type="button"
//                 onClick={handleBack}
//                 style={{
//                     position: "fixed",
//                     left: 20,
//                     bottom: 20,

//                     padding: "11px 18px",

//                     border:
//                         `1px solid ${P.border}`,

//                     borderRadius: 10,

//                     background:
//                         P.surface,

//                     color:
//                         P.textPrimary,

//                     fontWeight: 600,

//                     cursor: "pointer",

//                     boxShadow:
//                         "0 4px 12px rgba(0,0,0,0.08)"
//                 }}
//             >
//                 ← Back
//             </button> */}


//              <div
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
//         //   onClick={() =>
//         //     navigate("/devices")
//         //   }
//                         onClick={handleBack}
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

//         </div>
//     );
// }




import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useInverter } from "../context/Context";
import P from "../theme/colors";

export default function AddDevice() {
    const navigate = useNavigate();

    const {
        refreshDevices,
        setSelectedDeviceId,
    } = useInverter();

    const [imei, setImei] = useState("");
    const [location, setLocation] = useState("");

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        const cleanImei = imei.trim();
        const cleanLocation = location.trim();

        // ============================================
        // VALIDATE IMEI
        // ============================================

        if (!/^\d{15}$/.test(cleanImei)) {
            setError("IMEI must be exactly 15 digits");
            return;
        }

        // ============================================
        // VALIDATE LOCATION
        // ============================================

        if (!cleanLocation) {
            setError("Location is required");
            return;
        }

        // ============================================
        // GET TOKEN
        // ============================================

        const token = localStorage.getItem("token");

        if (!token) {
            setError("Please login again");
            navigate("/login");
            return;
        }

        setLoading(true);

        try {
            // ========================================
            // ADD DEVICE
            // ========================================

            const res = await fetch(
                //VPSCHANGE
                // "http://localhost:3000/api/user/devices",
                                "/api/user/devices",

                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },

                    body: JSON.stringify({
                        imei: cleanImei,
                        location: cleanLocation,
                    }),
                }
            );

            const result = await res.json();

            if (!res.ok) {
                setError(
                    result.error ||
                    "Failed to add device"
                );

                return;
            }

            // ========================================
            // DEVICE ADDED
            // ========================================

            setSuccess("Device added successfully");

            setImei("");
            setLocation("");

            // ========================================
            // REFRESH DEVICE LIST
            // ========================================

            await refreshDevices();

            // ========================================
            // SELECT NEW DEVICE
            // ========================================

            if (result.device?.id) {
                setSelectedDeviceId(result.device.id);
            }

            // ========================================
            // GO TO DASHBOARD
            // ========================================

            navigate("/");

        } catch (err) {
            console.error(
                "Add device error:",
                err
            );

            setError(
                "Server error. Please try again."
            );

        } finally {
            setLoading(false);
        }
    };

    // ============================================
    // BACK BUTTON
    // ============================================

    const handleBack = () => {
        navigate(-1);
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

                justifyContent: "flex-start",

                padding: "24px 20px 110px",

                boxSizing: "border-box",
            }}
        >

            {/* =====================================================
                HEADER CARD
            ===================================================== */}

            <div
                style={{
                    width: "100%",
                    maxWidth: 420,

                    boxSizing: "border-box",

                    background: P.surface,

                    borderRadius: 24,

                    padding: "18px 22px",

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


                {/* TITLE */}

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
                        Add Device
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
                DEVICE DETAILS CARD
            ===================================================== */}

            <div
                style={{
                    width: "100%",
                    maxWidth: 420,

                    boxSizing: "border-box",

                    background: P.surface,

                    borderRadius: 24,

                    padding: "24px 22px",

                    boxShadow:
                        `${P.shadowCardLg}, ${P.shadowCard}`,

                    border:
                        `1px solid ${P.border}`,
                }}
            >

                {/* CARD HEADING */}

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
                        Enter the details of the inverter
                        you want to add
                    </p>

                </div>


                {/* =================================================
                    ERROR
                ================================================= */}

                {error && (
                    <div
                        style={{
                            marginBottom: 14,

                            padding: "10px 14px",

                            borderRadius: 10,

                            background: "#fff1f1",

                            border: "1px solid #ffd5d5",

                            color: "#d32f2f",

                            fontSize: 13,

                            fontFamily:
                                "'Inter', sans-serif",
                        }}
                    >
                        {error}
                    </div>
                )}


                {/* =================================================
                    SUCCESS
                ================================================= */}

                {success && (
                    <div
                        style={{
                            marginBottom: 14,

                            padding: "10px 14px",

                            borderRadius: 10,

                            background: P.surfaceSuccess,

                            border:
                                `1px solid ${P.borderSuccess}`,

                            color: P.textSuccessMsg,

                            fontSize: 13,

                            fontFamily:
                                "'Inter', sans-serif",
                        }}
                    >
                        {success}
                    </div>
                )}


                {/* =================================================
                    FORM
                ================================================= */}

                <form onSubmit={handleSubmit}>

                    {/* IMEI */}

                    <div
                        style={{
                            marginBottom: 14,
                        }}
                    >

                        <input
                            type="text"
                            inputMode="numeric"
                            maxLength={15}

                            placeholder="IMEI Number"

                            value={imei}

                            onChange={(e) =>
                                setImei(
                                    e.target.value
                                        .replace(/\D/g, "")
                                )
                            }

                            style={{
                                width: "100%",

                                padding:
                                    "15px 20px",

                                borderRadius: 10,

                                border: "none",

                                background:
                                    P.surfaceForm,

                                fontSize: 14,

                                fontFamily:
                                    "'Inter', sans-serif",

                                color:
                                    P.textPrimary,

                                outline: "none",

                                boxSizing:
                                    "border-box",
                            }}

                            required
                        />

                    </div>


                    {/* LOCATION */}

                    <div
                        style={{
                            marginBottom: 24,
                        }}
                    >

                        <input
                            type="text"

                            placeholder="Location"

                            value={location}

                            onChange={(e) =>
                                setLocation(
                                    e.target.value
                                )
                            }

                            style={{
                                width: "100%",

                                padding:
                                    "15px 20px",

                                borderRadius: 10,

                                border: "none",

                                background:
                                    P.surfaceForm,

                                fontSize: 14,

                                fontFamily:
                                    "'Inter', sans-serif",

                                color:
                                    P.textPrimary,

                                outline: "none",

                                boxSizing:
                                    "border-box",
                            }}

                            required
                        />

                    </div>


                    {/* ADD BUTTON */}

                    <button
                        type="submit"

                        disabled={loading}

                        style={{
                            width: "100%",

                            padding:
                                "15px 16px",

                            border: "none",

                            borderRadius: 50,

                            fontWeight: 700,

                            fontSize: 16,

                            cursor:
                                loading
                                    ? "not-allowed"
                                    : "pointer",

                            color: P.surface,

                            opacity:
                                loading
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
                            ? "Adding..."
                            : "Add Device"}
                    </button>

                </form>

            </div>


            {/* =====================================================
                FIXED BACK BUTTON
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

                    onClick={handleBack}

                    aria-label="Back to device list"

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