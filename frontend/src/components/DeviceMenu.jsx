// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useInverter } from "../context/Context";
// import P from "../theme/colors";

// export default function DeviceMenu() {

//     const navigate = useNavigate();

//     const {
//         devices,
//         selectedDeviceId,
//         setSelectedDeviceId
//     } = useInverter();

//     const [open, setOpen] = useState(false);


//     const handleSelectDevice = (deviceId) => {

//         setSelectedDeviceId(deviceId);

//         // Close menu after selection
//         setOpen(false);
//     };


//     return (
//         <>
//             {/* =========================
//                 BURGER BUTTON
//             ========================== */}
// {/* 
//             <button
//                 type="button"
//                 onClick={() => setOpen(true)}
//                 style={{
//                     position: "absolute",
//                     left: 16,
//                     top: "50%",
//                     transform: "translateY(-50%)",

//                     width: 42,
//                     height: 42,

//                     border: "none",
//                     background: "transparent",

//                     cursor: "pointer",

//                     display: "flex",
//                     flexDirection: "column",
//                     justifyContent: "center",
//                     alignItems: "center",

//                     gap: 5,
//                 }}
//             > */}


//             <button
//     type="button"
//     onClick={() => setOpen(true)}
//     style={{
//         position: "absolute",
//         // left: 16,
//         right: 16,
//         top: "50%",
//         transform: "translateY(-50%)",

//         width: 42,
//         height: 42,

//         border: "none",
//         background: "transparent",

//         cursor: "pointer",

//         display: "flex",
//         flexDirection: "column",
//         justifyContent: "center",
//         alignItems: "center",

//         gap: 5,
//     }}
// >

//                 <span
//                     style={{
//                         width: 22,
//                         height: 2,
//                         background: P.textPrimary,
//                         borderRadius: 2,
//                     }}
//                 />

//                 <span
//                     style={{
//                         width: 22,
//                         height: 2,
//                         background: P.textPrimary,
//                         borderRadius: 2,
//                     }}
//                 />

//                 <span
//                     style={{
//                         width: 22,
//                         height: 2,
//                         background: P.textPrimary,
//                         borderRadius: 2,
//                     }}
//                 />

//             </button>


//             {/* =========================
//                 OVERLAY
//             ========================== */}

//             {open && (
//                 <div
//                     onClick={() => setOpen(false)}
//                     style={{
//                         position: "fixed",
//                         inset: 0,
//                         background:
//                             "rgba(0,0,0,0.25)",
//                         zIndex: 999,
//                     }}
//                 />
//             )}


//             {/* =========================
//                 SIDE MENU
//             ========================== */}

//             <div
//                 style={{
//                     position: "fixed",
//                     top: 0,
//                     // left: 0,
// right: 0,
// left: "auto",
//                     width: 320,
//                     maxWidth: "85vw",
//                     height: "100vh",

//                     background: P.surface,

//                     boxShadow:
//                         "4px 0 20px rgba(0,0,0,0.15)",

//                     zIndex: 1000,

//                     transform:
//                         open
//                             ? "translateX(0)"
//                             : "translateX(100%)",

//                     transition:
//                         "transform 0.25s ease",

//                     display: "flex",
//                     flexDirection: "column",
//                 }}
//             >

//                 {/* =========================
//                     MENU HEADER
//                 ========================== */}

//                 <div
//                     style={{
//                         height: 64,

//                         display: "flex",
//                         alignItems: "center",
//                         justifyContent:
//                             "space-between",

//                         padding: "0 18px",

//                         borderBottom:
//                             `1px solid ${P.border}`,
//                     }}
//                 >

//                     <div
//                         style={{
//                             fontSize: 17,
//                             fontWeight: 800,
//                             color: P.textPrimary,
//                             fontFamily:
//                                 "'DM Sans', sans-serif",
//                         }}
//                     >
//                         Your Devices
//                     </div>


//                     <button
//                         type="button"
//                         onClick={() =>
//                             setOpen(false)
//                         }
//                         style={{
//                             border: "none",
//                             background:
//                                 "transparent",
//                             fontSize: 26,
//                             cursor: "pointer",
//                             color:
//                                 P.textPrimary,
//                         }}
//                     >
//                         ×
//                     </button>

//                 </div>


//                 {/* =========================
//                     DEVICE LIST
//                 ========================== */}

//                 <div
//                     style={{
//                         flex: 1,
//                         overflowY: "auto",
//                         padding: 16,
//                     }}
//                 >

//                     {devices.length === 0 ? (

//                         <div
//                             style={{
//                                 padding: 20,
//                                 textAlign: "center",
//                                 color:
//                                     P.textMuted,
//                                 fontSize: 14,
//                             }}
//                         >
//                             No devices added.
//                         </div>

//                     ) : (

//                         devices.map((device) => {

//                             const selected =
//                                 device.id ===
//                                 selectedDeviceId;

//                             return (

//                                 <button
//                                     key={device.id}
//                                     type="button"
//                                     onClick={() =>
//                                         handleSelectDevice(
//                                             device.id
//                                         )
//                                     }
//                                     style={{
//                                         width: "100%",
//                                         textAlign:
//                                             "left",

//                                         border:
//                                             selected
//                                                 ? `2px solid ${P.borderAmber}`
//                                                 : `1px solid ${P.border}`,

//                                         background:
//                                             selected
//                                                 ? P.surfaceAmber
//                                                 : P.surface,

//                                         borderRadius: 14,

//                                         padding: 14,

//                                         marginBottom: 12,

//                                         cursor:
//                                             "pointer",
//                                     }}
//                                 >

//                                     {/* IMEI */}

//                                     <div
//                                         style={{
//                                             fontSize: 15,
//                                             fontWeight: 800,
//                                             color:
//                                                 P.textPrimary,
//                                             marginBottom: 8,
//                                         }}
//                                     >
//                                         {device.imei}
//                                     </div>


//                                     {/* VERSION */}

//                                     <div
//                                         style={{
//                                             fontSize: 12,
//                                             color:
//                                                 P.textMuted,
//                                             marginBottom: 4,
//                                         }}
//                                     >
//                                         Version:{" "}
//                                         {device.device_version ||
//                                             "--"}
//                                     </div>


//                                     {/* SOLUTION */}

//                                     <div
//                                         style={{
//                                             fontSize: 12,
//                                             color:
//                                                 P.textMuted,
//                                         }}
//                                     >
//                                         Solution:{" "}
//                                         {device.solution ||
//                                             "--"}
//                                     </div>


//                                     {/* SELECTED */}

//                                     {selected && (

//                                         <div
//                                             style={{
//                                                 marginTop: 10,
//                                                 fontSize: 11,
//                                                 fontWeight: 800,
//                                                 color:
//                                                     P.textAmber,
//                                             }}
//                                         >
//                                             ✓ ACTIVE DEVICE
//                                         </div>

//                                     )}

//                                 </button>

//                             );

//                         })

//                     )}

//                 </div>


//                 {/* =========================
//                     ADD DEVICE
//                 ========================== */}

//                 <div
//                     style={{
//                         padding: 16,
//                         borderTop:
//                             `1px solid ${P.border}`,
//                     }}
//                 >

//                     <button
//                         type="button"
//                         onClick={() => {

//                             setOpen(false);

//                             navigate(
//                                 "/add-device"
//                             );

//                         }}
//                         style={{
//                             width: "100%",
//                             padding: 14,

//                             border: "none",
//                             borderRadius: 12,

//                             background:
//                                 P.btnPrimary,

//                             color:
//                                 P.textWhite,

//                             fontWeight: 700,

//                             cursor: "pointer",
//                         }}
//                     >
//                         + Add Device
//                     </button>

//                 </div>

//             </div>
//         </>
//     );
// }



// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useInverter } from "../context/Context";
// import P from "../theme/colors";

// export default function DeviceMenu() {
//     const navigate = useNavigate();

//     const {
//         devices,
//         selectedDeviceId,
//         setSelectedDeviceId
//     } = useInverter();

//     const [open, setOpen] = useState(false);


//     // =====================================================
//     // LOCK BACKGROUND PAGE SCROLL WHEN MENU IS OPEN
//     // =====================================================

//     useEffect(() => {
//         if (open) {
//             document.body.style.overflow = "hidden";
//             document.documentElement.style.overflow = "hidden";
//         } else {
//             document.body.style.overflow = "";
//             document.documentElement.style.overflow = "";
//         }

//         return () => {
//             document.body.style.overflow = "";
//             document.documentElement.style.overflow = "";
//         };
//     }, [open]);


//     // =====================================================
//     // SELECT DEVICE
//     // =====================================================

//     const handleSelectDevice = (deviceId) => {
//         setSelectedDeviceId(deviceId);
//         setOpen(false);
//     };


//     return (
//         <>
//             {/* =====================================================
//                 BURGER BUTTON
//             ===================================================== */}

//             <button
//                 type="button"
//                 onClick={() => setOpen(true)}
//                 aria-label="Open device menu"
//                 style={{
//                     position: "absolute",
//                     right: 16,
//                     top: "50%",
//                     transform: "translateY(-50%)",

//                     width: 42,
//                     height: 42,

//                     border: "none",
//                     background: "transparent",

//                     cursor: "pointer",

//                     display: "flex",
//                     flexDirection: "column",
//                     justifyContent: "center",
//                     alignItems: "center",

//                     gap: 5,

//                     padding: 0,

//                     WebkitTapHighlightColor:
//                         "transparent",
//                 }}
//             >
//                 <span
//                     style={{
//                         width: 22,
//                         height: 2,
//                         background: P.textPrimary,
//                         borderRadius: 2,
//                     }}
//                 />

//                 <span
//                     style={{
//                         width: 22,
//                         height: 2,
//                         background: P.textPrimary,
//                         borderRadius: 2,
//                     }}
//                 />

//                 <span
//                     style={{
//                         width: 22,
//                         height: 2,
//                         background: P.textPrimary,
//                         borderRadius: 2,
//                     }}
//                 />
//             </button>


//             {/* =====================================================
//                 OVERLAY
//             ===================================================== */}

//             {open && (
//                 <div
//                     onClick={() => setOpen(false)}
//                     style={{
//                         position: "fixed",
//                         inset: 0,

//                         background:
//                             "rgba(0,0,0,0.25)",

//                         zIndex: 1999,

//                         // Prevent touch scrolling through overlay
//                         touchAction: "none",
//                     }}
//                 />
//             )}


//             {/* =====================================================
//                 SIDE MENU
//             ===================================================== */}

//             <div
//                 style={{
//                     position: "fixed",

//                     top: 0,
//                     right: 0,
//                     bottom: 0,

//                     width: 320,
//                     maxWidth: "85vw",

//                     // height: "100dvh",

//                     background: P.surface,

//                     boxShadow:
//                         "-4px 0 20px rgba(0,0,0,0.15)",

//                     zIndex: 2000,

//                     transform:
//                         open
//                             ? "translateX(0)"
//                             : "translateX(100%)",

//                     transition:
//                         "transform 0.25s ease",

//                     display: "flex",
//                     flexDirection: "column",

//                     boxSizing: "border-box",

//                     // Important:
//                     // prevents the drawer itself from
//                     // becoming a scrolling container
//                     overflow: "hidden",
//                 }}
//             >

//                 {/* =================================================
//                     MENU HEADER
//                 ================================================= */}

//                 <div
//                     style={{
//                         height: 64,

//                         flexShrink: 0,

//                         display: "flex",
//                         alignItems: "center",
//                         justifyContent:
//                             "space-between",

//                         padding: "0 18px",

//                         borderBottom:
//                             `1px solid ${P.border}`,

//                         boxSizing:
//                             "border-box",
//                     }}
//                 >

//                     <div
//                         style={{
//                             fontSize: 17,
//                             fontWeight: 800,

//                             color:
//                                 P.textPrimary,

//                             fontFamily:
//                                 "'DM Sans', sans-serif",
//                         }}
//                     >
//                         Your Devices
//                     </div>


//                     {/* CLOSE BUTTON */}

//                     <button
//                         type="button"
//                         onClick={() =>
//                             setOpen(false)
//                         }
//                         aria-label="Close device menu"
//                         style={{
//                             border: "none",
//                             background:
//                                 "transparent",

//                             fontSize: 26,

//                             cursor: "pointer",

//                             color:
//                                 P.textPrimary,

//                             width: 40,
//                             height: 40,

//                             display: "flex",
//                             alignItems: "center",
//                             justifyContent:
//                                 "center",

//                             padding: 0,

//                             WebkitTapHighlightColor:
//                                 "transparent",
//                         }}
//                     >
//                         ×
//                     </button>

//                 </div>


//                 {/* =================================================
//                     DEVICE LIST

//                     ONLY THIS SECTION SCROLLS
//                 ================================================= */}

//                 <div
//                     style={{
//                         flex: 1,

//                         minHeight: 0,

//                         overflowY: "auto",
//                         overflowX: "hidden",

//                         padding: 16,

//                         boxSizing: "border-box",

//                         WebkitOverflowScrolling:
//                             "touch",

//                         // Prevent scroll from propagating
//                         // to the page behind
//                         overscrollBehavior:
//                             "contain",
//                     }}
//                 >

//                     {devices.length === 0 ? (

//                         <div
//                             style={{
//                                 padding: 20,

//                                 textAlign:
//                                     "center",

//                                 color:
//                                     P.textMuted,

//                                 fontSize: 14,

//                                 fontFamily:
//                                     "'Inter', sans-serif",
//                             }}
//                         >
//                             No devices added.
//                         </div>

//                     ) : (

//                         devices.map((device) => {

//                             const selected =
//                                 device.id ===
//                                 selectedDeviceId;

//                             return (

//                                 <button
//                                     key={device.id}
//                                     type="button"

//                                     onClick={() =>
//                                         handleSelectDevice(
//                                             device.id
//                                         )
//                                     }

//                                     style={{
//                                         width: "100%",

//                                         display: "block",

//                                         textAlign:
//                                             "left",

//                                         // KEEPING YOUR ORIGINAL
//                                         // CARD SIZE
//                                         border:
//                                             selected
//                                                 ? `2px solid ${P.borderAmber}`
//                                                 : `1px solid ${P.border}`,

//                                         background:
//                                             selected
//                                                 ? P.surfaceAmber
//                                                 : P.surface,

//                                         borderRadius: 14,

//                                         padding: 14,

//                                         marginBottom: 12,

//                                         cursor:
//                                             "pointer",

//                                         boxSizing:
//                                             "border-box",

//                                         fontFamily:
//                                             "'Inter', sans-serif",

//                                         WebkitTapHighlightColor:
//                                             "transparent",
//                                     }}
//                                 >

//                                     {/* =================================================
//                                         IMEI
//                                     ================================================= */}

//                                     <div
//                                         style={{
//                                             fontSize: 15,

//                                             fontWeight: 800,

//                                             color:
//                                                 P.textPrimary,

//                                             marginBottom: 8,

//                                             fontFamily:
//                                                 "'DM Sans', sans-serif",

//                                             overflowWrap:
//                                                 "anywhere",
//                                         }}
//                                     >
//                                         {device.imei || "--"}
//                                     </div>


//                                     {/* =================================================
//                                         VERSION
//                                     ================================================= */}

//                                     <div
//                                         style={{
//                                             fontSize: 12,

//                                             color:
//                                                 P.textMuted,

//                                             marginBottom: 4,

//                                             fontFamily:
//                                                 "'Inter', sans-serif",
//                                         }}
//                                     >
//                                         Version:{" "}
//                                         {device.device_version ||
//                                             "--"}
//                                     </div>


//                                     {/* =================================================
//                                         SOLUTION
//                                     ================================================= */}

//                                     <div
//                                         style={{
//                                             fontSize: 12,

//                                             color:
//                                                 P.textMuted,

//                                             fontFamily:
//                                                 "'Inter', sans-serif",
//                                         }}
//                                     >
//                                         Solution:{" "}
//                                         {device.solution ||
//                                             "--"}
//                                     </div>


//                                     {/* =================================================
//                                         ACTIVE DEVICE
//                                     ================================================= */}

//                                     {selected && (

//                                         <div
//                                             style={{
//                                                 marginTop: 10,

//                                                 fontSize: 11,

//                                                 fontWeight: 800,

//                                                 color:
//                                                     P.textAmber,

//                                                 fontFamily:
//                                                     "'DM Sans', sans-serif",
//                                             }}
//                                         >
//                                             ✓ ACTIVE DEVICE
//                                         </div>

//                                     )}

//                                 </button>

//                             );

//                         })

//                     )}

//                 </div>


//                 {/* =================================================
//                     ADD DEVICE

//                     FIXED AT BOTTOM OF DRAWER
//                     DOES NOT SCROLL
//                 ================================================= */}

//                 <div
//                     style={{
//                         flexShrink: 0,

//                         padding: 16,

//                         paddingBottom:
//                             "calc(16px + env(safe-area-inset-bottom))",

//                         borderTop:
//                             `1px solid ${P.border}`,

//                         background:
//                             P.surface,

//                         boxSizing:
//                             "border-box",

//                         zIndex: 2,
//                     }}
//                 >

//                     <button
//                         type="button"

//                         onClick={() => {

//                             setOpen(false);

//                             navigate(
//                                 "/add-device"
//                             );

//                         }}

//                         style={{
//                             width: "100%",

//                             padding: 14,

//                             border: "none",

//                             borderRadius: 12,

//                             background:
//                                 P.btnPrimary,

//                             color:
//                                 P.textWhite,

//                             fontSize: 14,

//                             fontWeight: 700,

//                             fontFamily:
//                                 "'DM Sans', sans-serif",

//                             cursor: "pointer",

//                             boxSizing:
//                                 "border-box",

//                             WebkitTapHighlightColor:
//                                 "transparent",
//                         }}
//                     >
//                         + Add Device
//                     </button>

//                 </div>

//             </div>
//         </>
//     );
// }


import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { useInverter } from "../context/Context";
import P from "../theme/colors";

export default function DeviceMenu() {
    const navigate = useNavigate();

    const {
        devices,
        selectedDeviceId,
        setSelectedDeviceId,
    } = useInverter();

    const [open, setOpen] = useState(false);

    // =====================================================
    // LOCK BACKGROUND SCROLL WHEN MENU IS OPEN
    // =====================================================

    useEffect(() => {
        if (!open) {
            return;
        }

        const originalBodyOverflow =
            document.body.style.overflow;

        const originalHtmlOverflow =
            document.documentElement.style.overflow;

        document.body.style.overflow = "hidden";
        document.documentElement.style.overflow = "hidden";

        return () => {
            document.body.style.overflow =
                originalBodyOverflow;

            document.documentElement.style.overflow =
                originalHtmlOverflow;
        };
    }, [open]);

    // =====================================================
    // CLOSE MENU
    // =====================================================

    const closeMenu = () => {
        setOpen(false);
    };

    // =====================================================
    // SELECT DEVICE
    // =====================================================

    const handleSelectDevice = (deviceId) => {
        setSelectedDeviceId(deviceId);
        closeMenu();
    };

    // =====================================================
    // ADD DEVICE
    // =====================================================

    const handleAddDevice = () => {
        closeMenu();
        navigate("/add-device");
    };

    // =====================================================
    // DRAWER
    // =====================================================

    const drawer = open
        ? createPortal(
              <>
                  {/* =================================================
                      OVERLAY
                  ================================================= */}

                  <div
                      onClick={closeMenu}
                      style={{
                          position: "fixed",
                          inset: 0,

                          background:
                              "rgba(0, 0, 0, 0.25)",

                          zIndex: 1999,

                          touchAction: "none",
                      }}
                  />

                  {/* =================================================
                      SIDE DRAWER
                  ================================================= */}

                  <div
                      role="dialog"
                      aria-modal="true"
                      aria-label="Device menu"
                      style={{
                          position: "fixed",

                          top: 0,
                          right: 0,
                          bottom: 0,

                          width: 320,
                          maxWidth: "85vw",

                          background: P.surface,

                          boxShadow:
                              "-4px 0 20px rgba(0,0,0,0.15)",

                          zIndex: 2000,

                          display: "flex",
                          flexDirection: "column",

                          boxSizing: "border-box",

                          overflow: "hidden",

                          transform: "translateX(0)",

                          animation:
                              "deviceMenuSlideIn 0.25s ease",
                      }}
                  >
                      {/* =================================================
                          HEADER
                      ================================================= */}

                      <div
                          style={{
                              height: 64,

                              flexShrink: 0,

                              display: "flex",
                              alignItems: "center",
                              justifyContent:
                                  "space-between",

                              padding: "0 18px",

                              borderBottom:
                                  `1px solid ${P.border}`,

                              boxSizing: "border-box",
                          }}
                      >
                          <div
                              style={{
                                  fontSize: 17,

                                  fontWeight: 800,

                                  color:
                                      P.textPrimary,

                                  fontFamily:
                                      "'DM Sans', sans-serif",
                              }}
                          >
                              Your Devices
                          </div>

                          {/* CLOSE BUTTON */}

                          <button
                              type="button"
                              onClick={closeMenu}
                              aria-label="Close device menu"
                              style={{
                                  width: 40,
                                  height: 40,

                                  border: "none",

                                  background:
                                      "transparent",

                                  color:
                                      P.textPrimary,

                                  fontSize: 26,

                                  lineHeight: 1,

                                  cursor: "pointer",

                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent:
                                      "center",

                                  padding: 0,

                                  WebkitTapHighlightColor:
                                      "transparent",
                              }}
                          >
                              ×
                          </button>
                      </div>

                      {/* =================================================
                          DEVICE LIST
                          ONLY THIS SECTION SCROLLS
                      ================================================= */}

                      <div
                          style={{
                              flex: 1,

                              minHeight: 0,

                              overflowY: "auto",
                              overflowX: "hidden",

                              padding: 16,

                              boxSizing: "border-box",

                              WebkitOverflowScrolling:
                                  "touch",

                              overscrollBehavior:
                                  "contain",
                          }}
                      >
                          {devices.length === 0 ? (
                              <div
                                  style={{
                                      padding: 20,

                                      textAlign:
                                          "center",

                                      color:
                                          P.textMuted,

                                      fontSize: 14,

                                      fontFamily:
                                          "'Inter', sans-serif",
                                  }}
                              >
                                  No devices added.
                              </div>
                          ) : (
                              devices.map((device) => {
                                  const selected =
                                      device.id ===
                                      selectedDeviceId;

                                  return (
                                      <button
                                          key={device.id}
                                          type="button"
                                          onClick={() =>
                                              handleSelectDevice(
                                                  device.id
                                              )
                                          }
                                          style={{
                                              width: "100%",

                                              display:
                                                  "block",

                                              textAlign:
                                                  "left",

                                              border: selected
                                                  ? `2px solid ${P.borderAmber}`
                                                  : `1px solid ${P.border}`,

                                              background:
                                                  selected
                                                      ? P.surfaceAmber
                                                      : P.surface,

                                              borderRadius: 14,

                                              padding: 14,

                                              marginBottom: 12,

                                              cursor:
                                                  "pointer",

                                              boxSizing:
                                                  "border-box",

                                              fontFamily:
                                                  "'Inter', sans-serif",

                                              WebkitTapHighlightColor:
                                                  "transparent",
                                          }}
                                      >
                                          {/* IMEI */}

                                          <div
                                              style={{
                                                  fontSize: 15,

                                                  fontWeight: 800,

                                                  color:
                                                      P.textPrimary,

                                                  marginBottom:
                                                      8,

                                                  fontFamily:
                                                      "'DM Sans', sans-serif",

                                                  overflowWrap:
                                                      "anywhere",
                                              }}
                                          >
                                              {device.imei ||
                                                  "--"}
                                          </div>

                                          {/* VERSION */}

                                          <div
                                              style={{
                                                  fontSize: 12,

                                                  color:
                                                      P.textMuted,

                                                  marginBottom:
                                                      4,

                                                  fontFamily:
                                                      "'Inter', sans-serif",
                                              }}
                                          >
                                              Version:{" "}
                                              {device.device_version ||
                                                  "--"}
                                          </div>

                                          {/* SOLUTION */}

                                          <div
                                              style={{
                                                  fontSize: 12,

                                                  color:
                                                      P.textMuted,

                                                  fontFamily:
                                                      "'Inter', sans-serif",
                                              }}
                                          >
                                              Solution:{" "}
                                              {device.solution ||
                                                  "--"}
                                          </div>

                                          {/* ACTIVE DEVICE */}

                                          {selected && (
                                              <div
                                                  style={{
                                                      marginTop: 10,

                                                      fontSize: 11,

                                                      fontWeight: 800,

                                                      color:
                                                          P.textAmber,

                                                      fontFamily:
                                                          "'DM Sans', sans-serif",
                                                  }}
                                              >
                                                  ✓ ACTIVE DEVICE
                                              </div>
                                          )}
                                      </button>
                                  );
                              })
                          )}
                      </div>

                      {/* =================================================
                          ADD DEVICE
                          ALWAYS VISIBLE
                          DOES NOT SCROLL
                      ================================================= */}

                      <div
                          style={{
                              flexShrink: 0,

                              padding: 16,

                              paddingBottom:
                                  "calc(16px + env(safe-area-inset-bottom))",

                              borderTop:
                                  `1px solid ${P.border}`,

                              background:
                                  P.surface,

                              boxSizing:
                                  "border-box",

                              position: "relative",

                              zIndex: 3,
                          }}
                      >
                          <button
                              type="button"
                              onClick={
                                  handleAddDevice
                              }
                              style={{
                                  width: "100%",

                                  minHeight: 48,

                                  padding: "14px 16px",

                                  border: "none",

                                  borderRadius: 12,

                                  background:
                                      P.btnPrimary,

                                  color:
                                      P.textWhite,

                                  fontSize: 14,

                                  fontWeight: 700,

                                  fontFamily:
                                      "'DM Sans', sans-serif",

                                  cursor: "pointer",

                                  boxSizing:
                                      "border-box",

                                  WebkitTapHighlightColor:
                                      "transparent",
                              }}
                          >
                              + Add Device
                          </button>
                      </div>
                  </div>

                  {/* =================================================
                      DRAWER ANIMATION
                  ================================================= */}

                  <style>
                      {`
                          @keyframes deviceMenuSlideIn {
                              from {
                                  transform: translateX(100%);
                              }

                              to {
                                  transform: translateX(0);
                              }
                          }
                      `}
                  </style>
              </>,
              document.body
          )
        : null;

    // =====================================================
    // MAIN COMPONENT
    // =====================================================

    return (
        <>
            {/* =================================================
                BURGER BUTTON
            ================================================= */}

            <button
                type="button"
                onClick={() => setOpen(true)}
                aria-label="Open device menu"
                aria-expanded={open}
                style={{
                    position: "absolute",

                    right: 16,
                    top: "50%",

                    transform:
                        "translateY(-50%)",

                    width: 42,
                    height: 42,

                    border: "none",

                    background:
                        "transparent",

                    cursor: "pointer",

                    display: "flex",
                    flexDirection: "column",

                    justifyContent:
                        "center",

                    alignItems: "center",

                    gap: 5,

                    padding: 0,

                    WebkitTapHighlightColor:
                        "transparent",
                }}
            >
                <span
                    style={{
                        width: 22,
                        height: 2,

                        background:
                            P.textPrimary,

                        borderRadius: 2,
                    }}
                />

                <span
                    style={{
                        width: 22,
                        height: 2,

                        background:
                            P.textPrimary,

                        borderRadius: 2,
                    }}
                />

                <span
                    style={{
                        width: 22,
                        height: 2,

                        background:
                            P.textPrimary,

                        borderRadius: 2,
                    }}
                />
            </button>

            {/* =================================================
                PORTAL DRAWER
            ================================================= */}

            {drawer}
        </>
    );
}