// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import Header from "../components/Header";
// import P from "../theme/colors";

// export default function VendorDevices() {

//   const [devices, setDevices] =
//     useState([]);

//   const [loading, setLoading] =
//     useState(true);

//   const navigate =
//     useNavigate();

//   useEffect(() => {

//     const loadDevices =
//       async () => {

//         try {

//           const token =
//             localStorage.getItem(
//               "vendorToken"
//             );

//           const res =
//             await fetch(
//               "http://localhost:3000/api/devices/my-devices",
//               //VPSCHANGE
//               // "/api/devices/my-devices",
//               {
//                 headers: {
//                   Authorization:
//                     `Bearer ${token}`
//                 }
//               }
//             );

//           const data =
//             await res.json();

//           console.log(data);

//           if (Array.isArray(data)) {
//             setDevices(data);
//           }

//         } catch (err) {

//           console.error(err);

//         } finally {

//           setLoading(false);

//         }
//       };

//     loadDevices();

//   }, []);

//   return (
//     <div
//       style={{
//             minHeight: "100vh",
//             background: P.bgGradient,
//             padding: "32px 20px 40px",
//             fontFamily: "'Inter', sans-serif",
//           }}
//     >
//       <div
//         style={{
//           maxWidth: 480,
//           margin: "0 auto",
//         }}
//       >

//         <Header />

//         {/* Page Heading */}
//         <div
//           style={{
//             marginBottom: 25,
//           }}
//         >
//           <h1
//             style={{
//               fontSize: 32,
//               fontWeight: 800,
//               color: P.textPrimary,
//               fontFamily: "'DM Sans', sans-serif",
//               textAlign: "center",
//               marginBottom: 2,
//             }}
//           >
//             My Devices
//           </h1>

//           <p
//             style={{
//               fontSize: 13,
//                 color: P.amber,
//                 fontFamily: "'Inter', sans-serif",
//                 textAlign: "center",
//                 fontStyle: "italic",
//                 marginTop: 0,
//                 marginBottom: 20,
//             }}
//           >
//             All registered inverter devices
//           </p>
//         </div>

//         {/* Loading */}
//         {loading && (
//           <div
//             style={{
//               background: P.surface,
//               padding: 30,
//               borderRadius: 24,
//               textAlign: "center",
//               boxShadow:
//                 "0 10px 30px rgba(0,0,0,0.08)",
//             }}
//           >
//             Loading devices...
//           </div>
//         )}

//         {/* Empty State */}
//         {!loading &&
//           devices.length === 0 && (
//             <div
//               style={{
//                 background: P.surface,
//                 padding: 40,
//                 borderRadius: 24,
//                 textAlign: "center",
//                 boxShadow:
//                   "0 10px 30px rgba(0,0,0,0.08)",
//               }}
//             >
//               <h3>
//                 No devices found
//               </h3>

//               <p
//                 style={{
//                   color: P.textLight,
//                 }}
//               >
//                 Register your first
//                 inverter device.
//               </p>
//             </div>
//           )}

//         {/* Device Cards */}
//         <div
//           style={{
//             display: "flex",
//             flexDirection: "column",
//             gap: 16,
//             marginBottom: 24,
//           }}
//         >

//           {devices.map(device => (

//             <div
//               key={device.id}
//             //   onClick={() =>
//             //     navigate(
//             //     //   `/device/${device.id}`
//             //     `/vendor/device/${device.id}/power`
//             //     )
//             //   }

//               onClick={() => {
//                 localStorage.setItem("selectedVendorDevice", JSON.stringify(device));
//                 navigate("/vendor");
//               }}
//               style={{
//                 background: P.surface,
//                 borderRadius: 18,
//                 padding: "18px 18px 18px 20px",
//                 boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
//                 border: `1px solid ${P.border}`,
//                 cursor: "pointer",
//                 display: "flex",
//                 alignItems: "center",
//                 gap: 12,
//                 position: "relative",
//                 overflow: "hidden",
//               }}
//             >
//               {/* LEFT — text content */}
//               <div style={{ flex: 1, minWidth: 0 }}>

//                 {/* Active badge */}
//                 <div
//                   style={{
//                     display: "inline-flex",
//                     alignItems: "center",
//                     background: P.amber,
//                     color: P.surface,
//                     fontSize: 11,
//                     fontWeight: 700,
//                     padding: "3px 10px",
//                     borderRadius: 20,
//                     marginBottom: 10,
//                     fontFamily: "'Inter', sans-serif",
//                   }}
//                 >
//                   Active
//                 </div>

//                 {/* Device ID */}
//                 <div style={{ marginBottom: 20 }}>
//                   <span
//                     style={{
//                       fontSize: 20,
//                       fontWeight: 1000,
//                       color: P.textPrimary,
//                       fontFamily: "'DM Sans', sans-serif",
//                     }}
//                   >
//                     Device ID: {device.id}

//                   </span>
//                 </div>

//                 {/* IMEI */}
//                 <div style={{ marginBottom: 10 }}>
//                   <div
//                     style={{
//                       fontSize: 15,
//                       fontWeight: 1000,
//                       color: P.textSecond,
//                       fontFamily: "'Inter', sans-serif",
//                       marginBottom: 1,
//                     }}
//                   >
//                     IMEI
//                   </div>
//                   <div
//                     style={{
//                       fontSize: 13,
//                       fontWeight: 500,
//                       color: P.textMuted,
//                       fontFamily: "'Inter', sans-serif",
//                       overflow: "hidden",
//                       textOverflow: "ellipsis",
//                       whiteSpace: "nowrap",
//                     }}
//                   >
//                     {device.imei}
//                   </div>
//                 </div>

//                 {/* Solution Type */}
//                 <div>
//                   <div
//                     style={{
//                       fontSize: 15,
//                       fontWeight: 1000,
//                       color: P.textSecond,
//                       fontFamily: "'Inter', sans-serif",
//                       marginBottom: 1,
//                     }}
//                   >
//                     Solution Type
//                   </div>
//                   <div
//                     style={{
//                       fontSize: 13,
//                       fontWeight: 500,
//                       color: P.textMuted,
//                       fontFamily: "'Inter', sans-serif",
//                       textTransform: "capitalize",
//                     }}
//                   >
//                     {device.solution || "—"}
//                   </div>
//                 </div>
//               </div>

//               {/* RIGHT — solar panel image */}
//               <div
//                 style={{
//                   flexShrink: 0,
//                   width: 170,
//                   height: 100,
//                   display: "flex",
//                   alignItems: "center",
//                   justifyContent: "center",
//                 }}
//               >
//                 <img
//                   src="/src/assets/solar-panel.png"
//                   alt="Solar Panel"
//                   style={{
//                     width: 220,
//                     height: 180,
//                     objectFit: "contain",
//                   }}
//                 />
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* Back Button */}
//         <div
//           style={{
//             marginTop: 25,
//           }}
//         >
//           <button
//     onClick={() => navigate("/devices")}
//     style={{
//       width: "100%",
//       padding: "14px 16px",
//       border: `1px solid ${P.border}`,
//       borderRadius: 50,
//       cursor: "pointer",
//       fontWeight: 600,
//       fontSize: 14,
//       color: P.textSecond,
//       background: P.surface,
//       fontFamily: "'Inter', sans-serif",
//       boxShadow: P.shadowCard,
//     }}
//   >
//     ← Back to Device Hub
//   </button>
//         </div>

//       </div>
//     </div>
//   );
// }














import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import P from "../theme/colors";
import logo from "../assets/logo.png";

export default function VendorDevices() {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const loadDevices = async () => {
      try {
        const token = localStorage.getItem("vendorToken");

        const res = await fetch(
          "http://localhost:3000/api/devices/my-devices",
          // VPSCHANGE
          // "/api/devices/my-devices",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();

        console.log(data);

        if (Array.isArray(data)) {
          setDevices(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadDevices();
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: P.bgGradient,
        fontFamily: "'Inter', sans-serif",
        paddingBottom: 110, // space for fixed bottom button
      }}
    >
      <div
        style={{
          // maxWidth: 480,
          // margin: "0 auto",
          // padding: "20px 20px 30px",
           width: "100%",
      maxWidth: 420,
      margin: "0 auto",
      padding: "20px 20px 110px",
      boxSizing: "border-box",
        }}
      >
        {/* =====================================================
            HEADER
            LOGO + TITLE IN SAME ROW
        ===================================================== */}
        {/* <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            marginBottom: 28,
          }}
        >
          <div
            style={{
              width: 98,
              height: 98,
              flexShrink: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <img
              src={logo}
              alt="Company Logo"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
              }}
            />
          </div>

          <div>
            <h1
              style={{
                margin: 0,
                fontSize: 28,
                fontWeight: 800,
                color: P.textPrimary,
                fontFamily: "'DM Sans', sans-serif",
                lineHeight: 1.1,
              }}
            >
              My Devices
            </h1>

            <p
              style={{
                margin: "5px 0 0",
                fontSize: 12,
                color: P.amber,
                fontFamily: "'Inter', sans-serif",
                fontStyle: "italic",
              }}
            >
              All registered inverter devices
            </p>
          </div>
        </div> */}

        {/* Header + Page Title Card */}

{/* 

        <div
          style={{
            background: P.surface,
            borderRadius: 18,
            padding: "14px 18px",
            marginBottom: 20,
            boxShadow: P.shadowCard,
            border: `1px solid ${P.border}`,
            display: "flex",
            alignItems: "center",
            gap: 28,
          }}
        >
          <div
    style={{
      width: 58,
      height: 58,
      flexShrink: 0,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    <img
      src="/src/assets/logo.png"
      alt="Company Logo"
      style={{
        width: 108,
        height: 108,
        objectFit: "contain",
      }}
    />
  </div> */}

          {/* <button
    onClick={() => navigate("/devices")}
    style={{
      border: "none",
      background: "transparent",
      padding: 0,
      marginBottom: 16,
      display: "flex",
      alignItems: "center",
      gap: 6,
      cursor: "pointer",
      color: P.textSecond,
      fontSize: 14,
      fontWeight: 600,
      fontFamily: "'Inter', sans-serif",
    }}
  >
    ←
  </button> */}




{/* 
          <div
            style={{
              flex: 1,
              minWidth: 0,
            }}
          >
            <h1
              style={{
                fontSize: 28,
                fontWeight: 800,
                color: P.textPrimary,
                fontFamily: "'DM Sans', sans-serif",
                margin: 0,
                lineHeight: 1.15,
              }}
            >
              My Devices
            </h1>

            <p
              style={{
                fontSize: 14,
                color: P.amber,
                fontFamily: "'Inter', sans-serif",
                fontStyle: "italic",
                margin: "4px 0 0",
                lineHeight: 1.3,
              }}
            >
              All registered inverter devices
            </p>

          </div>
        </div> */}

{/* =====================================================
          HEADER CARD
          LOGO + TITLE
      ===================================================== */}
      <div
        style={{
          // width: "100%",
          // maxWidth: 420,
          // boxSizing: "border-box",

          // background: P.surface,
          // borderRadius: 24,

          // padding:
          //   "18px 22px",

          // marginBottom: 18,

          // boxShadow:
          //   `${P.shadowCardLg}, ${P.shadowCard}`,

          // border:
          //   `1px solid ${P.border}`,

          // display: "flex",
          // alignItems: "center",

          // gap: 18,
           width: "100%",
        boxSizing: "border-box",
        background: P.surface,
        borderRadius: 24,
        padding: "18px 22px",
        marginBottom: 18,
        boxShadow: `${P.shadowCardLg}, ${P.shadowCard}`,
        border: `1px solid ${P.border}`,
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
              My Devices
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
              All registered inverter devices
          </p>
        </div>
      </div>

        {/* =====================================================
            LOADING
        ===================================================== */}
        {loading && (
          <div
            style={{
              background: P.surface,
              padding: 30,
              borderRadius: 24,
              textAlign: "center",
              boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
              color: P.textSecond,
              fontSize: 14,
            }}
          >
            Loading devices...
          </div>
        )}

        {/* =====================================================
            EMPTY STATE
        ===================================================== */}
        {!loading && devices.length === 0 && (
          <div
            style={{
              background: P.surface,
              padding: 40,
              borderRadius: 24,
              textAlign: "center",
              boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
            }}
          >
            <h3
              style={{
                margin: "0 0 8px",
                color: P.textPrimary,
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              No devices found
            </h3>

          
          </div>
        )}

        {/* =====================================================
            DEVICE LIST
        ===================================================== */}
        {!loading && devices.length > 0 && (
          <div
            style={{
              // display: "flex",
              // flexDirection: "column",
              // gap: 16,

              width: "100%",
        display: "flex",
        flexDirection: "column",
        gap: 16,

              // Extra bottom space so last card is never hidden
              // behind the fixed button.
              paddingBottom: 30,
            }}
          >
            
            {devices.map((device) => (
              <div
                key={device.id}
                onClick={() => {
                  localStorage.setItem(
                    "selectedVendorDevice",
                    JSON.stringify(device)
                  );

                  navigate("/vendor");
                }}
                style={{
                  // background: P.surface,
                  // borderRadius: 18,
                  // padding: "18px 18px 18px 20px",
            //        padding:
            // "24px 22px",


            // width: "100%",
            // boxSizing: "border-box",
            // background: P.surface,
            // borderRadius: 18,
            // padding: "24px 22px",
            //       boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
            //       border: `1px solid ${P.border}`,
            //       cursor: "pointer",

            //       display: "flex",
            //       alignItems: "center",
            //       gap: 12,

            //       position: "relative",
            //       overflow: "hidden",

            
  width: "100%",
  boxSizing: "border-box",

  background: P.surface,
  borderRadius: 18,
  padding: "20px 18px",

  boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
  border: `1px solid ${P.border}`,

  cursor: "pointer",

  display: "flex",
  alignItems: "center",
  gap: 12,

  position: "relative",
  overflow: "hidden",

                  transition: "transform 0.15s ease",
                }}
                onMouseDown={(e) => {
                  e.currentTarget.style.transform = "scale(0.99)";
                }}
                onMouseUp={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                }}
              >
                {/* =================================================
                    LEFT — DEVICE DETAILS
                ================================================= */}
                <div
                  style={{
                    // flex: 1,
                    // minWidth: 0,
                       flex: "1 1 0",
    minWidth: 0,
    maxWidth: "100%",
    overflow: "hidden",
                  }}
                >
                  {/* ACTIVE BADGE */}
                  <div
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,

                      background: P.amber,
                      color: P.surface,

                      fontSize: 11,
                      fontWeight: 700,

                      padding: "4px 10px",
                      borderRadius: 20,

                      marginBottom: 14,

                      fontFamily: "'Inter', sans-serif",
                    }}
                  >
                    <span
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        background: "#FFFFFF",
                      }}
                    />

                    Active
                  </div>

                  {/* IMEI */}
                  <div
                    style={{
                      marginBottom: 12,
                    }}
                  >
                    <div
                      style={{
                        fontSize: 16,
                        fontWeight: 800,
                        color: P.textSecond,
                        fontFamily: "'Inter', sans-serif",
                        marginBottom: 3,
                      }}
                    >
                      IMEI
                    </div>

                    {/* <div
                      style={{
                        fontSize: 18,
                        fontWeight: 500,
                        color: P.textMuted,
                        fontFamily: "'Inter', sans-serif",

                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {device.imei || "—"}
                    </div> */}

                    <div
  style={{
    fontSize: 18,
    fontWeight: 500,
    color: P.textMuted,
    fontFamily: "'Inter', sans-serif",

    width: "100%",
    maxWidth: "100%",

    overflowWrap: "anywhere",
    wordBreak: "break-word",

    lineHeight: 1.4,
  }}
>
  {device.imei || "—"}
</div>
                  </div>

                  {/* SOLUTION TYPE */}
                  <div>
                    <div
                      style={{
                        fontSize: 16,
                        fontWeight: 800,
                        color: P.textSecond,
                        fontFamily: "'Inter', sans-serif",
                        marginBottom: 3,
                      }}
                    >
                      Solution Type
                    </div>

                    <div
                      style={{
                        fontSize: 18,
                        fontWeight: 500,
                        color: P.textMuted,
                        fontFamily: "'Inter', sans-serif",
                        textTransform: "capitalize",
                      }}
                    >
                      {device.solution || "—"}
                    </div>
                  </div>
                </div>

                {/* =================================================
                    RIGHT — SOLAR PANEL IMAGE
                ================================================= */}
                {/* <div
                  style={{
                    flexShrink: 0,
                    width: 125,
                    height: 105,

                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <img
                    src="/src/assets/solar-panel.png"
                    alt="Solar Panel"
                    style={{
                      width: 160,
                      height: 145,
                      objectFit: "contain",
                    }}
                  />
                </div> */}


                <div
  style={{
    flex: "0 0 clamp(85px, 28vw, 125px)",
    height: 105,

    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  }}
>
  <img
    src="/src/assets/solar-panel.png"
    alt="Solar Panel"
    style={{
      width: "100%",
      maxWidth: 125,
      height: "auto",
      objectFit: "contain",
    }}
  />
</div>

                {/* RIGHT ARROW */}
                <div
                  style={{
                    position: "absolute",
                    right: 10,
                    bottom: 8,

                    fontSize: 18,
                    color: P.amber,
                    fontWeight: 700,
                  }}
                >
                  →
                </div>
              </div>
            ))}
          </div>
        )}

        {/* BACK BUTTON — FLOATING ABOVE DEVICE CARD */}
      {/* <div
        style={{
          // position: "relative",
          // maxWidth: 480,
          // margin: "0 auto",
          // height: 0,
          // zIndex: 20,
          position: "fixed", 
          left: 20, 
          bottom: "calc(16px + env(safe-area-inset-bottom))", 
          zIndex: 100,
        }}
      >
        <button
          onClick={() => navigate("/devices")}
          style={{
            position: "absolute",
            top: 12,
            left: 0,

            width: 40,
            height: 40,
            borderRadius: "50%",

            border: `1px solid ${P.border}`,
            background: P.surface,

            display: "flex",
            alignItems: "center",
            justifyContent: "center",

            padding: 0,
            cursor: "pointer",

            color: P.textSecond,
            fontSize: 22,
            fontWeight: 500,
            fontFamily: "'Inter', sans-serif",

            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.14)",
          }}
        >
          ←
        </button>
      </div> */}

      {/* BACK BUTTON — FIXED BOTTOM LEFT */}
<div
  style={{
    position: "fixed",
    left: 35,
    bottom: "calc(36px + env(safe-area-inset-bottom))",
    zIndex: 1000,
  }}
>
  <button
    onClick={() => navigate("/devices")}
    aria-label="Back to devices"
    style={{
      width: 44,
      height: 44,
      borderRadius: "50%",

      border: `1px solid ${P.border}`,
      background: P.surface,

      display: "flex",
      alignItems: "center",
      justifyContent: "center",

      padding: 0,
      cursor: "pointer",

      color: P.textSecond,
      fontSize: 22,
      fontWeight: 500,
      lineHeight: 1,
      fontFamily: "'Inter', sans-serif",

      boxShadow: "0 4px 14px rgba(0, 0, 0, 0.16)",

      // Makes sure the button remains easy to tap
      WebkitTapHighlightColor: "transparent",
    }}
  >
    ←
  </button>
</div>
      </div>

      {/* =========================================================
          FIXED BOTTOM BUTTON
      ========================================================= */}
      {/* <div
        style={{
          position: "fixed",
          left: 0,
          right: 0,
          bottom: 0,

          zIndex: 100,

          background: P.bgGradient,
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",

          // borderTop: `1px solid ${P.border}`,

          padding: "28px 20px",
          paddingBottom:
            "calc(12px + env(safe-area-inset-bottom))",
        }}
      >
        <div
          style={{
            maxWidth: 480,
            margin: "0 auto",
          }}
        > */}
      {/* <button
            onClick={() => navigate("/devices")}
            style={{
              width: "100%",
              padding: "14px 16px",

              border: `1px solid ${P.border}`,
              borderRadius: 50,

              cursor: "pointer",

              fontWeight: 600,
              fontSize: 14,

              color: P.textSecond,
              background: P.surface,

              fontFamily: "'Inter', sans-serif",

              boxShadow: P.shadowCard,
            }}
          >
            ← Back to Dashboard
          </button> */}

      {/* <button
  onClick={() => navigate("/devices")}
  style={{
    width: 40,
    height: 40,
    borderRadius: "50%",
    border: `1px solid ${P.border}`,
    background: P.surface,
    padding: 0,
    marginBottom: 16,

    display: "flex",
    alignItems: "center",
    justifyContent: "center",

    cursor: "pointer",
    color: P.textSecond,
    fontSize: 22,
    fontWeight: 500,
    fontFamily: "'Inter', sans-serif",

    boxShadow: "0 3px 10px rgba(0, 0, 0, 0.10)",
  }}
>
  ←
</button>
        </div>
      </div>  */}

      

    </div>
  );
}
