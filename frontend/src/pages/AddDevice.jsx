// import { Html5Qrcode } from "html5-qrcode";
// import { useCallback, useEffect, useRef, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useInverter } from "../context/Context";
// import P from "../theme/colors";
// import { isDeviceSaved, saveDeviceMeta } from "../utils/deviceMeta";

// const API_BASE = "http://localhost:3000";
// // VPSCHANGE

// // =====================================================
// // STATIC OPTIONS
// // (Shown to the user during setup. Only the IMEI +
// // location are actually sent to the backend today —
// // product type / model are captured for the guided
// // flow and included in the saved location text.)
// // =====================================================

// const PRODUCT_TYPES = [
//   "MPPT based Off-Grid PCU",
//   "MPPT based Hybrid-1P PCU",
//   "Intelligent Power Supply (IPS)",
//   "Grid-Tie Inverter",
//   "MPPT based Hybrid-3P PCU",
// ];

// const MODELS_BY_PRODUCT_TYPE = {
//   "MPPT based Off-Grid PCU": [
//     "Energiaa X3 - 3KW",
//     "Energiaa X3T - 3KW",
//     "Energiaa X5T - 5KW",
//     "Energiaa X5.5T - 5.5KW",
//   ],
//   "MPPT based Hybrid-1P PCU": [
//     "Energiaa X3 - 3KW",
//     "Energiaa X3T - 3KW",
//     "Energiaa X5T - 5KW",
//     "Energiaa X5.5T - 5.5KW",
//   ],
//   "Intelligent Power Supply (IPS)": ["Energiaa X3 - 3KW", "Energiaa X3T - 3KW"],
//   "Grid-Tie Inverter": ["Energiaa X5T - 5KW", "Energiaa X5.5T - 5.5KW"],
//   "MPPT based Hybrid-3P PCU": ["Energiaa X5T - 5KW", "Energiaa X5.5T - 5.5KW"],
// };

// export default function AddDevice() {
//   const navigate = useNavigate();

//   const { refreshDevices, setSelectedDeviceId, openTemporaryDevice } =
//     useInverter();

//   // =====================================================
//   // WIZARD STATE
//   //
//   // "scan"        -> pg-2  (barcode / quick access screen, always mounted)
//   // "productType" -> pg-3  (popup)
//   // "model"       -> pg-4  (popup)
//   // "confirmAdd"  -> pg-5  (popup) "Add Device" Yes/No — asked right
//   //                  after the model is picked, BEFORE nickname/address
//   // "details"     -> pg-6  (popup) nickname + address — Save submits
//   // =====================================================

//   const [popup, setPopup] = useState(null);

//   const [imei, setImei] = useState("");
//   const [productType, setProductType] = useState("");
//   const [model, setModel] = useState("");
//   const [nickname, setNickname] = useState("");
//   const [address, setAddress] = useState("");

//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);

//   // =====================================================
//   // "DEVICE ALREADY EXISTS" TOAST
//   //
//   // Shown when the scanned/entered code matches a device
//   // the user already has in "My Devices" — the guided
//   // add-device wizard (product type / model / confirm /
//   // nickname) is skipped entirely and we jump straight to
//   // that existing device instead.
//   // =====================================================

//   const [toast, setToast] = useState("");

//   // =====================================================
//   // CAMERA SCANNER
//   //
//   // Started only on an explicit user tap (not inside a
//   // mount-time useEffect). Auto-starting getUserMedia
//   // inside an effect collides with React 18 StrictMode's
//   // dev-only mount -> cleanup -> mount double-invoke: two
//   // overlapping start() calls end up racing for the same
//   // <div id="..."> target, so after granting permission
//   // nothing renders and the flow appears stuck. A click
//   // handler is never double-invoked, so this sidesteps
//   // that entirely.
//   // =====================================================

//   const [cameraOn, setCameraOn] = useState(false);
//   const [cameraReady, setCameraReady] = useState(false);
//   const [cameraError, setCameraError] = useState("");

//   const scannerRef = useRef(null); // Html5Qrcode instance
//   const isRunningRef = useRef(false); // true only once start() has resolved
//   const startTokenRef = useRef(0); // guards against stale/overlapping calls
//   const scannerId = "add-device-qr-scanner";

//   const stopScanner = useCallback(() => {
//     startTokenRef.current += 1; // invalidate any in-flight start()

//     const inst = scannerRef.current;
//     scannerRef.current = null;

//     setCameraOn(false);
//     setCameraReady(false);

//     if (inst && isRunningRef.current) {
//       isRunningRef.current = false;
//       inst
//         .stop()
//         .then(() => inst.clear())
//         .catch(() => {});
//     }
//   }, []);

//   const startScanner = useCallback(() => {
//     if (scannerRef.current) {
//       // Already starting/running — ignore duplicate taps.
//       return;
//     }

//     setCameraError("");
//     setCameraOn(true);

//     const token = ++startTokenRef.current;
//     const html5QrCode = new Html5Qrcode(scannerId);
//     scannerRef.current = html5QrCode;

//     html5QrCode
//       .start(
//         { facingMode: "environment" },
//         { fps: 10, qrbox: { width: 240, height: 240 } },
//         (decodedText) => {
//           setImei(decodedText.trim());
//           stopScanner();
//         },
//         () => {}, // ignore per-frame scan misses
//       )
//       .then(() => {
//         if (startTokenRef.current !== token) {
//           // A stop() came in while start() was pending —
//           // shut this instance straight back down.
//           html5QrCode
//             .stop()
//             .then(() => html5QrCode.clear())
//             .catch(() => {});
//           return;
//         }
//         isRunningRef.current = true;
//         setCameraReady(true);
//       })
//       .catch((err) => {
//         console.error("Camera error:", err);
//         if (scannerRef.current === html5QrCode) {
//           scannerRef.current = null;
//         }
//         setCameraOn(false);
//         setCameraReady(false);
//         setCameraError(
//           "Couldn't access the camera. You can still type the code below.",
//         );
//       });
//   }, [stopScanner]);

//   // Stop the camera whenever a popup opens on top of the scan
//   // screen, and always on unmount.
//   useEffect(() => {
//     if (popup !== null) {
//       stopScanner();
//     }
//     return () => stopScanner();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [popup]);

//   // =====================================================
//   // STEP 1 -> 2 : OPEN QUICK ACCESS
//   // =====================================================

//   const handleOpenQuickAccess = async () => {
//     setError("");

//     const cleanImei = imei.trim();

//     if (!/^\d{15}$/.test(cleanImei)) {
//       setError("IMEI must be exactly 15 digits");
//       return;
//     }

//     setLoading(true);

//     try {
//       const res = await fetch(`/api/user/devices/${cleanImei}`);
//       const result = await res.json();

//       if (!res.ok) {
//         setError(result.error || "Device not found");
//         return;
//       }

//       setPopup("productType");
//     } catch (err) {
//       console.error("Quick access device lookup error:", err);
//       setError("Server error. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // =====================================================
//   // STEP 2 : SELECT PRODUCT TYPE
//   // =====================================================

//   const handleSelectProductType = (type) => {
//     setProductType(type);
//     setModel("");
//     setPopup("model");
//   };

//   // =====================================================
//   // STEP 3 : SELECT MODEL
//   // =====================================================

//   const handleSelectModel = (selectedModel) => {
//     setModel(selectedModel);
//     setPopup("confirmAdd");
//   };

//   // =====================================================
//   // STEP 3.5 : CONFIRM ADD DEVICE
//   // (asked right after model is picked, before nickname etc.)
//   // =====================================================

//   const handleConfirmAddNo = async () => {
//     setError("");
//     setLoading(true);

//     try {
//       const cleanImei = imei.trim();
//       const res = await fetch(`/api/user/devices/${cleanImei}`);
//       const result = await res.json();

//       if (!res.ok) {
//         setError(result.error || "Device not found");
//         setPopup(null);
//         setProductType("");
//         setModel("");
//         return;
//       }

//       openTemporaryDevice(result.device);
//       navigate("/home", { replace: true });
//     } catch (err) {
//       console.error("Temporary device lookup error:", err);
//       setError("Server error. Please try again.");
//       setPopup(null);
//       setProductType("");
//       setModel("");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleConfirmAddYes = () => {
//     setPopup("details");
//   };

//   // =====================================================
//   // STEP 4 : ENTER DEVICE DETAILS
//   // =====================================================

//   const handleDetailsCancel = () => {
//     // Cancel backs out of the whole guided flow and
//     // returns to the scan screen, ready to try again.
//     setPopup(null);
//     setProductType("");
//     setModel("");
//     setNickname("");
//     setAddress("");
//   };

//   const handleDetailsSave = () => {
//     setError("");

//     if (!nickname.trim() || !address.trim()) {
//       setError("Nickname and address are both required");
//       return;
//     }

//     addDevice();
//   };

//   // =====================================================
//   // STEP 5 : SAVE THE DEVICE
//   //
//   // No accounts anymore — "adding a device" just means:
//   // 1. Look the IMEI up (public, read-only) to make sure
//   //    it's a real, registered device.
//   // 2. Remember it on THIS phone (localStorage), keyed by
//   //    IMEI. That's the whole "save".
//   //
//   // If the IMEI is already saved on this phone, skip the
//   // lookup/save and jump straight to it.
//   // =====================================================

//   const addDevice = async () => {
//     setError("");

//     const cleanImei = imei.trim();

//     if (!/^\d{15}$/.test(cleanImei)) {
//       setError("IMEI must be exactly 15 digits");
//       setPopup("details");
//       return;
//     }

//     // -----------------------------------------------
//     // Already saved on this phone? Skip the lookup, show
//     // the toast, and jump straight to that device.
//     // -----------------------------------------------

//     if (isDeviceSaved(cleanImei)) {
//       setPopup(null);
//       setToast("Device already exists");
//       setSelectedDeviceId(cleanImei);

//       setTimeout(() => {
//         navigate("/saved-devices", { replace: true });
//         navigate("/home");
//       }, 1200);

//       return;
//     }

//     setLoading(true);

//     try {
//       const res = await fetch(`/api/user/devices/${cleanImei}`);

//       const result = await res.json();

//       if (!res.ok) {
//         setError(result.error || "Device not found");
//         setPopup("details");
//         return;
//       }

//       // =====================================================
//       // SAVE EVERYTHING LOCALLY ON THIS PHONE
//       //
//       // No backend write at all — the IMEI + the details
//       // picked in this wizard are just remembered in this
//       // browser's localStorage (see utils/deviceMeta.js).
//       // =====================================================

//       saveDeviceMeta(cleanImei, {
//         nickname: nickname.trim(),
//         deviceType: productType,
//         model,
//         location: address.trim(),
//         addedAt: new Date().toISOString(),
//       });

//       await refreshDevices();

//       setSelectedDeviceId(cleanImei);

//       navigate("/saved-devices", { replace: true });
//       navigate("/home");
//     } catch (err) {
//       console.error("Add device error:", err);
//       setError("Server error. Please try again.");
//       setPopup("details");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // =====================================================
//   // BACK BUTTON
//   // =====================================================

//   const handleBack = () => {
//     if (popup !== null) {
//       setPopup(null);
//       return;
//     }
//     navigate(-1);
//   };

//   return (
//     <div
//       style={{
//         minHeight: "100vh",
//         width: "100%",
//         background: P.pageSide,
//         fontFamily: "'Inter', sans-serif",
//       }}
//     >
//       {/* =====================================================
//                 PHONE-SIZED VISUAL AREA
//                 (same pattern as PageBackground.jsx / SelectOption.jsx,
//                 so this screen frames like the rest of the app on
//                 wide/desktop viewports instead of stretching full width)
//             ===================================================== */}

//       <div
//         style={{
//           width: "100%",
//           maxWidth: 520,
//           minHeight: "100vh",
//           margin: "0 auto",
//           position: "relative",
//           overflow: "clip",
//           background: "#0B0B0B",
//         }}
//       >
//         {/* =====================================================
//                 PG-2 : CAMERA / QUICK ACCESS (base layer, always mounted)
//             ===================================================== */}

//         <div
//           style={{
//             position: "absolute",
//             inset: 0,
//             display: "flex",
//             flexDirection: "column",
//           }}
//         >
//           {/* CAMERA VIEWFINDER */}
//           <div
//             style={{
//               flex: 1,
//               width: "100%",
//               background: "#000",
//               position: "relative",
//             }}
//           >
//             {/* html5-qrcode mounts the live video feed into this
//                         div once startScanner() is called — it stays in
//                         the DOM (hidden) even when the camera is off, so
//                         there's a stable target for start() to attach to. */}
//             <div
//               id={scannerId}
//               style={{
//                 width: "100%",
//                 height: "100%",
//                 display: cameraOn ? "block" : "none",
//               }}
//             />

//             {!cameraOn && (
//               <button
//                 type="button"
//                 onClick={startScanner}
//                 style={{
//                   position: "absolute",
//                   inset: 0,
//                   width: "100%",
//                   height: "100%",
//                   border: "none",
//                   background: "transparent",
//                   display: "flex",
//                   flexDirection: "column",
//                   alignItems: "center",
//                   justifyContent: "center",
//                   gap: 12,
//                   cursor: "pointer",
//                   color: "#cfcfcf",
//                   WebkitTapHighlightColor: "transparent",
//                 }}
//               >
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   width="34"
//                   height="34"
//                   viewBox="0 0 24 24"
//                   fill="none"
//                   stroke="currentColor"
//                   strokeWidth="1.8"
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                 >
//                   <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
//                   <circle cx="12" cy="13" r="4" />
//                 </svg>
//                 <div
//                   style={{
//                     fontSize: 13,
//                     fontFamily: "'Inter', sans-serif",
//                     padding: "0 24px",
//                     textAlign: "center",
//                   }}
//                 >
//                   Tap to scan the device barcode
//                 </div>
//               </button>
//             )}

//             {cameraOn && !cameraReady && (
//               <div
//                 style={{
//                   position: "absolute",
//                   inset: 0,
//                   display: "flex",
//                   alignItems: "center",
//                   justifyContent: "center",
//                   color: "#cfcfcf",
//                   fontSize: 13,
//                   fontFamily: "'Inter', sans-serif",
//                 }}
//               >
//                 Starting camera…
//               </div>
//             )}

//             {cameraOn && (
//               <button
//                 type="button"
//                 onClick={stopScanner}
//                 aria-label="Close camera"
//                 style={{
//                   position: "absolute",
//                   top: 14,
//                   right: 14,
//                   width: 34,
//                   height: 34,
//                   borderRadius: "50%",
//                   border: "none",
//                   background: "rgba(0,0,0,0.5)",
//                   color: "#fff",
//                   display: "flex",
//                   alignItems: "center",
//                   justifyContent: "center",
//                   cursor: "pointer",
//                   fontSize: 18,
//                   lineHeight: 1,
//                 }}
//               >
//                 ×
//               </button>
//             )}

//             {cameraError && (
//               <div
//                 style={{
//                   position: "absolute",
//                   bottom: 10,
//                   left: 16,
//                   right: 16,
//                   textAlign: "center",
//                   color: "#ff9a9a",
//                   fontSize: 12,
//                   fontFamily: "'Inter', sans-serif",
//                 }}
//               >
//                 {cameraError}
//               </div>
//             )}
//           </div>

//           {/* BOTTOM PANEL — code field + quick access button */}
//           <div
//             style={{
//               padding: "16px 20px calc(28px + env(safe-area-inset-bottom))",
//               boxSizing: "border-box",
//             }}
//           >
//             <input
//               type="text"
//               inputMode="numeric"
//               placeholder="Scan or enter device code"
//               value={imei}
//               onChange={(e) => setImei(e.target.value.replace(/\D/g, ""))}
//               style={{
//                 width: "100%",
//                 padding: "13px 16px",
//                 borderRadius: 8,
//                 border: `1px solid ${P.amber}`,
//                 background: "#FFFDF6",
//                 color: P.textPrimary,
//                 fontSize: 14,
//                 fontFamily: "'Inter', sans-serif",
//                 outline: "none",
//                 boxSizing: "border-box",
//                 marginBottom: 10,
//               }}
//             />

//             <button
//               type="button"
//               onClick={handleOpenQuickAccess}
//               disabled={loading}
//               style={{
//                 width: "100%",
//                 padding: "15px 16px",
//                 border: "none",
//                 borderRadius: 8,
//                 background: "linear-gradient(180deg, #2F8FD1 0%, #1F6FB5 100%)",
//                 color: P.textWhite,
//                 fontSize: 15,
//                 fontWeight: 700,
//                 letterSpacing: 0.6,
//                 textTransform: "uppercase",
//                 fontFamily: "'DM Sans', sans-serif",
//                 cursor: loading ? "not-allowed" : "pointer",
//                 opacity: loading ? 0.7 : 1,
//               }}
//             >
//               Open Quick Access
//             </button>

//             <div
//               style={{
//                 marginTop: 8,
//                 fontSize: 11,
//                 color: "#d8d8d8",
//                 fontFamily: "'Inter', sans-serif",
//                 width: "100%",
//                 textAlign: "center",
//                 boxSizing: "border-box",
//                 padding: "0 16px",
//               }}
//             >
//               Place a barcode inside the viewfinder rectangle to scan it.
//             </div>

//             {error && popup === null && (
//               <div
//                 style={{
//                   marginTop: 10,
//                   padding: "9px 14px",
//                   borderRadius: 8,
//                   background: "#3a1414",
//                   border: "1px solid #5a2020",
//                   color: "#ff9a9a",
//                   fontSize: 12,
//                   fontFamily: "'Inter', sans-serif",
//                 }}
//               >
//                 {error}
//               </div>
//             )}
//           </div>
//         </div>

//         {/* =====================================================
//                 PG-3 : SELECT PRODUCT TYPE
//             ===================================================== */}

//         {popup === "productType" && (
//           <PopupOverlay>
//             <PopupCard title="Select Product Type">
//               {PRODUCT_TYPES.map((type) => (
//                 <PopupListItem
//                   key={type}
//                   onClick={() => handleSelectProductType(type)}
//                 >
//                   {type}
//                 </PopupListItem>
//               ))}
//             </PopupCard>
//           </PopupOverlay>
//         )}

//         {/* =====================================================
//                 PG-4 : SELECT MODEL
//             ===================================================== */}

//         {popup === "model" && (
//           <PopupOverlay>
//             <PopupCard title="Select Model">
//               {(MODELS_BY_PRODUCT_TYPE[productType] || []).map((m) => (
//                 <PopupListItem key={m} onClick={() => handleSelectModel(m)}>
//                   {m}
//                 </PopupListItem>
//               ))}
//             </PopupCard>
//           </PopupOverlay>
//         )}

//         {/* =====================================================
//                 PG-5 : ADD DEVICE CONFIRMATION
//                 (asked right after the model is picked, before nickname)
//             ===================================================== */}

//         {popup === "confirmAdd" && (
//           <PopupOverlay>
//             <PopupCard
//               title="Add Device"
//               subtitle="Do you want to add this device to your list?"
//             >
//               <div
//                 style={{
//                   display: "flex",
//                   justifyContent: "flex-end",
//                   gap: 22,
//                   marginTop: 18,
//                 }}
//               >
//                 <PopupTextButton onClick={handleConfirmAddNo}>
//                   NO
//                 </PopupTextButton>

//                 <PopupTextButton onClick={handleConfirmAddYes} strong>
//                   YES
//                 </PopupTextButton>
//               </div>
//             </PopupCard>
//           </PopupOverlay>
//         )}

//         {/* =====================================================
//                 PG-6 : ENTER DEVICE DETAILS
//             ===================================================== */}

//         {popup === "details" && (
//           <PopupOverlay>
//             <PopupCard
//               title="Enter Device Details"
//               subtitle="Nickname and Address"
//             >
//               <input
//                 type="text"
//                 placeholder="e.g. Main Roof Inverter"
//                 value={nickname}
//                 onChange={(e) => setNickname(e.target.value)}
//                 style={popupInputStyle}
//               />

//               <input
//                 type="text"
//                 placeholder="e.g. 123 Solar Street"
//                 value={address}
//                 onChange={(e) => setAddress(e.target.value)}
//                 style={{ ...popupInputStyle, marginBottom: 4 }}
//               />

//               {error && (
//                 <div
//                   style={{
//                     marginTop: 8,
//                     fontSize: 12,
//                     color: P.textErrorMsg,
//                     fontFamily: "'Inter', sans-serif",
//                   }}
//                 >
//                   {error}
//                 </div>
//               )}

//               <div
//                 style={{
//                   display: "flex",
//                   justifyContent: "flex-end",
//                   gap: 22,
//                   marginTop: 18,
//                 }}
//               >
//                 <PopupTextButton
//                   onClick={handleDetailsCancel}
//                   disabled={loading}
//                 >
//                   CANCEL
//                 </PopupTextButton>

//                 <PopupTextButton
//                   onClick={handleDetailsSave}
//                   strong
//                   disabled={loading}
//                 >
//                   {loading ? "ADDING..." : "SAVE"}
//                 </PopupTextButton>
//               </div>
//             </PopupCard>
//           </PopupOverlay>
//         )}

//         {/* =====================================================
//                 BACK BUTTON
//                 (absolute, not fixed — anchors to the phone-sized
//                 frame above instead of the raw browser viewport, so
//                 it stays inside the frame on wide/desktop screens)
//             ===================================================== */}

//         <div
//           style={{
//             position: "absolute",
//             top: 16,
//             left: 16,
//             zIndex: 10,
//           }}
//         >
//           <button
//             onClick={handleBack}
//             style={{
//               width: 40,
//               height: 40,
//               borderRadius: "50%",
//               backgroundColor: "#fff",
//               border: "none",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//             }}
//           >
//             ←
//           </button>
//         </div>

//         {/* =====================================================
//                 "DEVICE ALREADY EXISTS" TOAST
//             ===================================================== */}

//         {toast && (
//           <div
//             style={{
//               position: "absolute",
//               left: "50%",
//               top: "46%",
//               transform: "translate(-50%, -50%)",
//               background: "rgba(40, 40, 40, 0.92)",
//               color: "#fff",
//               padding: "10px 20px",
//               borderRadius: 20,
//               fontSize: 13,
//               fontFamily: "'Inter', sans-serif",
//               whiteSpace: "nowrap",
//               zIndex: 4000,
//               boxShadow: "0 4px 14px rgba(0, 0, 0, 0.3)",
//             }}
//           >
//             {toast}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// // =====================================================
// // SHARED POPUP PIECES
// // =====================================================

// const popupInputStyle = {
//   width: "100%",
//   padding: "10px 2px",
//   marginBottom: 18,
//   border: "none",
//   borderBottom: `1px solid ${P.border}`,
//   background: "transparent",
//   fontSize: 14,
//   fontFamily: "'Inter', sans-serif",
//   color: P.textPrimary,
//   outline: "none",
//   boxSizing: "border-box",
// };

// function PopupOverlay({ children }) {
//   return (
//     <div
//       style={{
//         position: "absolute",
//         inset: 0,
//         background: "rgba(0, 0, 0, 0.45)",
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "center",
//         padding: "0 24px",
//         zIndex: 2000,
//         boxSizing: "border-box",
//       }}
//     >
//       {children}
//     </div>
//   );
// }

// function PopupCard({ title, subtitle, children }) {
//   return (
//     <div
//       style={{
//         width: "100%",
//         maxWidth: 360,
//         background: "#FBEFDD",
//         borderRadius: 4,
//         padding: "20px 22px",
//         boxShadow: "0 12px 32px rgba(0, 0, 0, 0.35)",
//         boxSizing: "border-box",
//       }}
//     >
//       <div
//         style={{
//           fontSize: 17,
//           fontWeight: 700,
//           color: P.textPrimary,
//           fontFamily: "'DM Sans', sans-serif",
//           marginBottom: subtitle ? 4 : 14,
//         }}
//       >
//         {title}
//       </div>

//       {subtitle && (
//         <div
//           style={{
//             fontSize: 13,
//             color: P.textSecond,
//             fontFamily: "'Inter', sans-serif",
//             marginBottom: 16,
//           }}
//         >
//           {subtitle}
//         </div>
//       )}

//       {children}
//     </div>
//   );
// }

// function PopupListItem({ children, onClick }) {
//   return (
//     <button
//       type="button"
//       onClick={onClick}
//       style={{
//         display: "block",
//         width: "100%",
//         textAlign: "left",
//         background: "none",
//         border: "none",
//         padding: "10px 0",
//         fontSize: 14,
//         color: P.textPrimary,
//         fontFamily: "'Inter', sans-serif",
//         cursor: "pointer",
//         WebkitTapHighlightColor: "transparent",
//       }}
//     >
//       {children}
//     </button>
//   );
// }

// function PopupTextButton({
//   children,
//   onClick,
//   strong = false,
//   disabled = false,
// }) {
//   return (
//     <button
//       type="button"
//       onClick={onClick}
//       disabled={disabled}
//       style={{
//         background: "none",
//         border: "none",
//         padding: "6px 4px",
//         fontSize: 13,
//         fontWeight: 700,
//         letterSpacing: 0.4,
//         color: strong ? P.amberDark : P.textSecond,
//         fontFamily: "'DM Sans', sans-serif",
//         cursor: disabled ? "not-allowed" : "pointer",
//         opacity: disabled ? 0.6 : 1,
//         WebkitTapHighlightColor: "transparent",
//       }}
//     >
//       {children}
//     </button>
//   );
// }

















// import { Html5Qrcode } from "html5-qrcode";
// import {
//   useCallback,
//   useEffect,
//   useRef,
//   useState,
// } from "react";

// import { useNavigate } from "react-router-dom";
// import { useInverter } from "../context/Context";

// import P from "../theme/colors";

// import {
//   isDeviceSaved,
//   saveDeviceMeta,
// } from "../utils/deviceMeta";


// // =====================================================
// // API
// // =====================================================

// // Local development
// const API_BASE = "http://localhost:3000";

// // VPSCHANGE
// // When uploaded to VPS and frontend/backend use same domain,
// // you can use relative URLs as already done below.


// // =====================================================
// // PRODUCT TYPES
// // =====================================================
// //
// // All product types are shown.
// //
// // HOWEVER:
// //
// // Only "Grid-Tie Inverter" is currently supported.
// //
// // Selecting any other product type:
// //      -> shows "Device not available"
// //      -> closes popup
// //      -> returns to Quick Access screen
// //
// // =====================================================

// const PRODUCT_TYPES = [
//   "MPPT based Off-Grid PCU",
//   "MPPT based Hybrid-1P PCU",
//   "Intelligent Power Supply (IPS)",
//   "Grid-Tie Inverter",
//   "MPPT based Hybrid-3P PCU",
// ];


// // =====================================================
// // AVAILABLE GRID-TIE MODELS
// // =====================================================

// const GRID_TIE_MODELS = [
//   "Energiaa X3 - 3KW",
//   "Energiaa X3T - 3KW",
//   "Energiaa X5T - 5KW",
//   "Energiaa X5.5T - 5.5KW",
// ];


// // =====================================================
// // COMPONENT
// // =====================================================

// export default function AddDevice() {

//   const navigate =
//     useNavigate();


//   const {
//     refreshDevices,
//     setSelectedDeviceId,
//     openTemporaryDevice,
//   } = useInverter();


//   // =====================================================
//   // WIZARD STATE
//   // =====================================================

//   const [popup, setPopup] =
//     useState(null);

//   const [imei, setImei] =
//     useState("");

//   const [productType, setProductType] =
//     useState("");

//   const [model, setModel] =
//     useState("");

//   const [nickname, setNickname] =
//     useState("");

//   const [address, setAddress] =
//     useState("");

//   const [error, setError] =
//     useState("");

//   const [loading, setLoading] =
//     useState(false);


//   // =====================================================
//   // TOAST
//   // =====================================================

//   const [toast, setToast] =
//     useState("");


//   // =====================================================
//   // TOAST HELPER
//   // =====================================================

//   const showToast = (
//     message,
//     duration = 1600
//   ) => {

//     setToast(message);

//     window.setTimeout(() => {
//       setToast("");
//     }, duration);
//   };


//   // =====================================================
//   // CAMERA STATE
//   // =====================================================

//   const [cameraOn, setCameraOn] =
//     useState(false);

//   const [cameraReady, setCameraReady] =
//     useState(false);

//   const [cameraError, setCameraError] =
//     useState("");


//   const scannerRef =
//     useRef(null);

//   const isRunningRef =
//     useRef(false);

//   const startTokenRef =
//     useRef(0);

//   const scannerId =
//     "add-device-qr-scanner";


//   // =====================================================
//   // STOP CAMERA
//   // =====================================================

//   const stopScanner =
//     useCallback(() => {

//       startTokenRef.current += 1;

//       const inst =
//         scannerRef.current;

//       scannerRef.current =
//         null;

//       setCameraOn(false);
//       setCameraReady(false);


//       if (
//         inst &&
//         isRunningRef.current
//       ) {

//         isRunningRef.current =
//           false;

//         inst
//           .stop()
//           .then(() =>
//             inst.clear()
//           )
//           .catch(() => {});
//       }

//     }, []);


//   // =====================================================
//   // START CAMERA
//   // =====================================================

//   const startScanner =
//     useCallback(() => {

//       // Prevent duplicate camera starts
//       if (scannerRef.current) {
//         return;
//       }


//       setCameraError("");
//       setCameraOn(true);


//       const token =
//         ++startTokenRef.current;


//       const html5QrCode =
//         new Html5Qrcode(
//           scannerId
//         );


//       scannerRef.current =
//         html5QrCode;


//       html5QrCode
//         .start(

//           {
//             facingMode:
//               "environment",
//           },

//           {
//             fps: 10,

//             qrbox: {
//               width: 240,
//               height: 240,
//             },
//           },

//           // =================================================
//           // SUCCESSFULLY SCANNED
//           // =================================================

//           (decodedText) => {

//             const scannedCode =
//               decodedText.trim();

//             setImei(
//               scannedCode
//             );

//             setError("");

//             stopScanner();
//           },

//           // Ignore frame-by-frame scan errors
//           () => {}

//         )
//         .then(() => {

//           if (
//             startTokenRef.current !==
//             token
//           ) {

//             html5QrCode
//               .stop()
//               .then(() =>
//                 html5QrCode.clear()
//               )
//               .catch(() => {});

//             return;
//           }


//           isRunningRef.current =
//             true;

//           setCameraReady(true);

//         })
//         .catch((err) => {

//           console.error(
//             "Camera error:",
//             err
//           );


//           if (
//             scannerRef.current ===
//             html5QrCode
//           ) {
//             scannerRef.current =
//               null;
//           }


//           setCameraOn(false);
//           setCameraReady(false);


//           setCameraError(
//             "Couldn't access the camera. You can still type the code below."
//           );
//         });

//     }, [
//       stopScanner,
//     ]);


//   // =====================================================
//   // STOP CAMERA WHEN POPUP OPENS
//   // =====================================================

//   useEffect(() => {

//     if (popup !== null) {
//       stopScanner();
//     }


//     return () =>
//       stopScanner();

//     // eslint-disable-next-line react-hooks/exhaustive-deps

//   }, [
//     popup,
//   ]);


//   // =====================================================
//   // OPEN QUICK ACCESS
//   //
//   // IMPORTANT:
//   //
//   // Previous:
//   // /^\d{15}$/
//   //
//   // has been REMOVED.
//   //
//   // We now only require a non-empty device code.
//   // =====================================================

//   const handleOpenQuickAccess =
//     async () => {

//       setError("");


//       const cleanImei =
//         imei.trim();


//       // =================================================
//       // NO 15-DIGIT CHECK
//       // =================================================

//       if (!cleanImei) {

//         setError(
//           "Please scan or enter the device code"
//         );

//         return;
//       }


//       setLoading(true);


//       try {

//         const res =
//           await fetch(
//             `/api/user/devices/${encodeURIComponent(
//               cleanImei
//             )}`
//           );


//         const result =
//           await res.json();


//         if (!res.ok) {

//           setError(
//             result?.error ||
//             "Device not found"
//           );

//           return;
//         }


//         // Device exists.
//         // Ask the user to select product type.

//         setPopup(
//           "productType"
//         );

//       } catch (err) {

//         console.error(
//           "Quick access device lookup error:",
//           err
//         );


//         setError(
//           "Server error. Please try again."
//         );

//       } finally {

//         setLoading(false);
//       }
//     };


//   // =====================================================
//   // SELECT PRODUCT TYPE
//   //
//   // ONLY Grid-Tie Inverter is currently available.
//   // =====================================================

//   const handleSelectProductType =
//     (type) => {

//       setError("");


//       // =================================================
//       // NOT GRID-TIE
//       // =================================================

//       if (
//         type !==
//         "Grid-Tie Inverter"
//       ) {

//         // Clear selection
//         setProductType("");
//         setModel("");


//         // Close popup and return to
//         // Quick Access screen
//         setPopup(null);


//         // Inform user
//         showToast(
//           "Device not available"
//         );


//         return;
//       }


//       // =================================================
//       // GRID-TIE
//       // =================================================

//       setProductType(type);

//       setModel("");

//       setPopup(
//         "model"
//       );
//     };


//   // =====================================================
//   // SELECT MODEL
//   // =====================================================

//   const handleSelectModel =
//     (selectedModel) => {

//       setModel(
//         selectedModel
//       );

//       setPopup(
//         "confirmAdd"
//       );
//     };


//   // =====================================================
//   // CONFIRM ADD - NO
//   //
//   // Opens device temporarily without saving it.
//   // =====================================================

//   const handleConfirmAddNo =
//     async () => {

//       setError("");
//       setLoading(true);


//       try {

//         const cleanImei =
//           imei.trim();


//         if (!cleanImei) {

//           setError(
//             "Please scan or enter the device code"
//           );

//           setPopup(null);

//           return;
//         }


//         const res =
//           await fetch(
//             `/api/user/devices/${encodeURIComponent(
//               cleanImei
//             )}`
//           );


//         const result =
//           await res.json();


//         if (!res.ok) {

//           setError(
//             result?.error ||
//             "Device not found"
//           );

//           setPopup(null);

//           setProductType("");
//           setModel("");

//           return;
//         }


//         openTemporaryDevice(
//           result.device
//         );


//         navigate(
//           "/home",
//           {
//             replace: true,
//           }
//         );

//       } catch (err) {

//         console.error(
//           "Temporary device lookup error:",
//           err
//         );


//         setError(
//           "Server error. Please try again."
//         );


//         setPopup(null);

//         setProductType("");
//         setModel("");

//       } finally {

//         setLoading(false);
//       }
//     };


//   // =====================================================
//   // CONFIRM ADD - YES
//   // =====================================================

//   const handleConfirmAddYes =
//     () => {

//       setPopup(
//         "details"
//       );
//     };


//   // =====================================================
//   // DETAILS CANCEL
//   // =====================================================

//   const handleDetailsCancel =
//     () => {

//       setPopup(null);

//       setProductType("");
//       setModel("");

//       setNickname("");
//       setAddress("");

//       setError("");
//     };


//   // =====================================================
//   // DETAILS SAVE
//   // =====================================================

//   const handleDetailsSave =
//     () => {

//       setError("");


//       if (
//         !nickname.trim() ||
//         !address.trim()
//       ) {

//         setError(
//           "Nickname and address are both required"
//         );

//         return;
//       }


//       addDevice();
//     };


//   // =====================================================
//   // SAVE DEVICE
//   //
//   // Device metadata is stored in localStorage.
//   //
//   // NO 15-DIGIT IMEI VALIDATION.
//   // =====================================================

//   const addDevice =
//     async () => {

//       setError("");


//       const cleanImei =
//         imei.trim();


//       // =================================================
//       // ONLY REQUIRE NON-EMPTY CODE
//       // =================================================

//       if (!cleanImei) {

//         setError(
//           "Please scan or enter the device code"
//         );

//         setPopup(
//           "details"
//         );

//         return;
//       }


//       // =================================================
//       // ALREADY SAVED
//       // =================================================

//       if (
//         isDeviceSaved(
//           cleanImei
//         )
//       ) {

//         setPopup(null);

//         showToast(
//           "Device already exists",
//           1200
//         );


//         setSelectedDeviceId(
//           cleanImei
//         );


//         setTimeout(() => {

//           navigate(
//             "/saved-devices",
//             {
//               replace: true,
//             }
//           );

//           navigate(
//             "/home"
//           );

//         }, 1200);


//         return;
//       }


//       setLoading(true);


//       try {

//         // =================================================
//         // VERIFY DEVICE EXISTS ON SERVER
//         // =================================================

//         const res =
//           await fetch(
//             `/api/user/devices/${encodeURIComponent(
//               cleanImei
//             )}`
//           );


//         const result =
//           await res.json();


//         if (!res.ok) {

//           setError(
//             result?.error ||
//             "Device not found"
//           );

//           setPopup(
//             "details"
//           );

//           return;
//         }


//         // =================================================
//         // SAVE DEVICE INFORMATION LOCALLY
//         // =================================================

//         saveDeviceMeta(
//           cleanImei,
//           {

//             nickname:
//               nickname.trim(),

//             deviceType:
//               productType,

//             model,

//             location:
//               address.trim(),

//             addedAt:
//               new Date()
//                 .toISOString(),
//           }
//         );


//         // =================================================
//         // REFRESH DEVICE LIST
//         // =================================================

//         await refreshDevices();


//         // =================================================
//         // SELECT NEW DEVICE
//         // =================================================

//         setSelectedDeviceId(
//           cleanImei
//         );


//         // =================================================
//         // NAVIGATE
//         // =================================================

//         navigate(
//           "/saved-devices",
//           {
//             replace: true,
//           }
//         );


//         navigate(
//           "/home"
//         );

//       } catch (err) {

//         console.error(
//           "Add device error:",
//           err
//         );


//         setError(
//           "Server error. Please try again."
//         );


//         setPopup(
//           "details"
//         );

//       } finally {

//         setLoading(false);
//       }
//     };


//   // =====================================================
//   // BACK BUTTON
//   // =====================================================

//   const handleBack =
//     () => {

//       if (
//         popup !== null
//       ) {

//         setPopup(null);

//         return;
//       }


//       navigate(-1);
//     };


//   // =====================================================
//   // UI
//   // =====================================================

//   return (

//     <div
//       style={{
//         minHeight:
//           "100vh",

//         width:
//           "100%",

//         background:
//           P.pageSide,

//         fontFamily:
//           "'Inter', sans-serif",
//       }}
//     >

//       {/* =================================================
//           PHONE-SIZED AREA
//       ================================================= */}

//       <div
//         style={{
//           width:
//             "100%",

//           maxWidth:
//             520,

//           minHeight:
//             "100vh",

//           margin:
//             "0 auto",

//           position:
//             "relative",

//           overflow:
//             "clip",

//           background:
//             "#0B0B0B",
//         }}
//       >


//         {/* =================================================
//             CAMERA / QUICK ACCESS
//         ================================================= */}

//         <div
//           style={{
//             position:
//               "absolute",

//             inset:
//               0,

//             display:
//               "flex",

//             flexDirection:
//               "column",
//           }}
//         >

//           {/* CAMERA */}

//           <div
//             style={{
//               flex:
//                 1,

//               width:
//                 "100%",

//               background:
//                 "#000",

//               position:
//                 "relative",
//             }}
//           >

//             <div
//               id={
//                 scannerId
//               }

//               style={{
//                 width:
//                   "100%",

//                 height:
//                   "100%",

//                 display:
//                   cameraOn
//                     ? "block"
//                     : "none",
//               }}
//             />


//             {/* CAMERA OFF */}

//             {!cameraOn && (

//               <button
//                 type="button"

//                 onClick={
//                   startScanner
//                 }

//                 style={{
//                   position:
//                     "absolute",

//                   inset:
//                     0,

//                   width:
//                     "100%",

//                   height:
//                     "100%",

//                   border:
//                     "none",

//                   background:
//                     "transparent",

//                   display:
//                     "flex",

//                   flexDirection:
//                     "column",

//                   alignItems:
//                     "center",

//                   justifyContent:
//                     "center",

//                   gap:
//                     12,

//                   cursor:
//                     "pointer",

//                   color:
//                     "#cfcfcf",

//                   WebkitTapHighlightColor:
//                     "transparent",
//                 }}
//               >

//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   width="34"
//                   height="34"
//                   viewBox="0 0 24 24"
//                   fill="none"
//                   stroke="currentColor"
//                   strokeWidth="1.8"
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                 >

//                   <path
//                     d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"
//                   />

//                   <circle
//                     cx="12"
//                     cy="13"
//                     r="4"
//                   />

//                 </svg>


//                 <div
//                   style={{
//                     fontSize:
//                       13,

//                     padding:
//                       "0 24px",

//                     textAlign:
//                       "center",
//                   }}
//                 >

//                   Tap to scan the device barcode

//                 </div>

//               </button>

//             )}


//             {/* CAMERA STARTING */}

//             {cameraOn &&
//               !cameraReady && (

//               <div
//                 style={{
//                   position:
//                     "absolute",

//                   inset:
//                     0,

//                   display:
//                     "flex",

//                   alignItems:
//                     "center",

//                   justifyContent:
//                     "center",

//                   color:
//                     "#cfcfcf",

//                   fontSize:
//                     13,
//                 }}
//               >

//                 Starting camera…

//               </div>

//             )}


//             {/* CLOSE CAMERA */}

//             {cameraOn && (

//               <button
//                 type="button"

//                 onClick={
//                   stopScanner
//                 }

//                 aria-label="Close camera"

//                 style={{
//                   position:
//                     "absolute",

//                   top:
//                     14,

//                   right:
//                     14,

//                   width:
//                     34,

//                   height:
//                     34,

//                   borderRadius:
//                     "50%",

//                   border:
//                     "none",

//                   background:
//                     "rgba(0,0,0,0.5)",

//                   color:
//                     "#fff",

//                   display:
//                     "flex",

//                   alignItems:
//                     "center",

//                   justifyContent:
//                     "center",

//                   cursor:
//                     "pointer",

//                   fontSize:
//                     18,
//                 }}
//               >

//                 ×

//               </button>

//             )}


//             {/* CAMERA ERROR */}

//             {cameraError && (

//               <div
//                 style={{
//                   position:
//                     "absolute",

//                   bottom:
//                     10,

//                   left:
//                     16,

//                   right:
//                     16,

//                   textAlign:
//                     "center",

//                   color:
//                     "#ff9a9a",

//                   fontSize:
//                     12,
//                 }}
//               >

//                 {cameraError}

//               </div>

//             )}

//           </div>


//           {/* =================================================
//               BOTTOM PANEL
//           ================================================= */}

//           <div
//             style={{
//               padding:
//                 "16px 20px calc(28px + env(safe-area-inset-bottom))",

//               boxSizing:
//                 "border-box",
//             }}
//           >

//             <input
//               type="text"

//               inputMode="text"

//               placeholder="Scan or enter device code"

//               value={
//                 imei
//               }

//               onChange={(e) => {

//                 // No numeric-only restriction.
//                 // No 15-character restriction.

//                 setImei(
//                   e.target.value
//                 );

//                 setError("");
//               }}

//               style={{
//                 width:
//                   "100%",

//                 padding:
//                   "13px 16px",

//                 borderRadius:
//                   8,

//                 border:
//                   `1px solid ${P.amber}`,

//                 background:
//                   "#FFFDF6",

//                 color:
//                   P.textPrimary,

//                 fontSize:
//                   14,

//                 fontFamily:
//                   "'Inter', sans-serif",

//                 outline:
//                   "none",

//                 boxSizing:
//                   "border-box",

//                 marginBottom:
//                   10,
//               }}
//             />


//             <button
//               type="button"

//               onClick={
//                 handleOpenQuickAccess
//               }

//               disabled={
//                 loading
//               }

//               style={{
//                 width:
//                   "100%",

//                 padding:
//                   "15px 16px",

//                 border:
//                   "none",

//                 borderRadius:
//                   8,

//                 background:
//                   "linear-gradient(180deg, #2F8FD1 0%, #1F6FB5 100%)",

//                 color:
//                   P.textWhite,

//                 fontSize:
//                   15,

//                 fontWeight:
//                   700,

//                 letterSpacing:
//                   0.6,

//                 textTransform:
//                   "uppercase",

//                 fontFamily:
//                   "'DM Sans', sans-serif",

//                 cursor:
//                   loading
//                     ? "not-allowed"
//                     : "pointer",

//                 opacity:
//                   loading
//                     ? 0.7
//                     : 1,
//               }}
//             >

//               {loading
//                 ? "Opening..."
//                 : "Open Quick Access"}

//             </button>


//             <div
//               style={{
//                 marginTop:
//                   8,

//                 fontSize:
//                   11,

//                 color:
//                   "#d8d8d8",

//                 width:
//                   "100%",

//                 textAlign:
//                   "center",

//                 padding:
//                   "0 16px",

//                 boxSizing:
//                   "border-box",
//               }}
//             >

//               Place a barcode inside the viewfinder rectangle to scan it.

//             </div>


//             {/* ERROR */}

//             {error &&
//               popup === null && (

//               <div
//                 style={{
//                   marginTop:
//                     10,

//                   padding:
//                     "9px 14px",

//                   borderRadius:
//                     8,

//                   background:
//                     "#3a1414",

//                   border:
//                     "1px solid #5a2020",

//                   color:
//                     "#ff9a9a",

//                   fontSize:
//                     12,
//                 }}
//               >

//                 {error}

//               </div>

//             )}

//           </div>

//         </div>


//         {/* =================================================
//             SELECT PRODUCT TYPE
//         ================================================= */}

//         {popup ===
//           "productType" && (

//           <PopupOverlay>

//             <PopupCard
//               title="Select Product Type"
//             >

//               {PRODUCT_TYPES.map(
//                 (type) => (

//                   <PopupListItem
//                     key={
//                       type
//                     }

//                     onClick={() =>
//                       handleSelectProductType(
//                         type
//                       )
//                     }
//                   >

//                     {type}

//                   </PopupListItem>

//                 )
//               )}

//             </PopupCard>

//           </PopupOverlay>

//         )}


//         {/* =================================================
//             SELECT GRID-TIE MODEL
//         ================================================= */}

//         {popup ===
//           "model" && (

//           <PopupOverlay>

//             <PopupCard
//               title="Select Model"
//             >

//               {GRID_TIE_MODELS.map(
//                 (m) => (

//                   <PopupListItem
//                     key={
//                       m
//                     }

//                     onClick={() =>
//                       handleSelectModel(
//                         m
//                       )
//                     }
//                   >

//                     {m}

//                   </PopupListItem>

//                 )
//               )}

//             </PopupCard>

//           </PopupOverlay>

//         )}


//         {/* =================================================
//             CONFIRM ADD
//         ================================================= */}

//         {popup ===
//           "confirmAdd" && (

//           <PopupOverlay>

//             <PopupCard
//               title="Add Device"
//               subtitle="Do you want to add this device to your list?"
//             >

//               <div
//                 style={{
//                   display:
//                     "flex",

//                   justifyContent:
//                     "flex-end",

//                   gap:
//                     22,

//                   marginTop:
//                     18,
//                 }}
//               >

//                 <PopupTextButton
//                   onClick={
//                     handleConfirmAddNo
//                   }
//                 >

//                   NO

//                 </PopupTextButton>


//                 <PopupTextButton
//                   onClick={
//                     handleConfirmAddYes
//                   }

//                   strong
//                 >

//                   YES

//                 </PopupTextButton>

//               </div>

//             </PopupCard>

//           </PopupOverlay>

//         )}


//         {/* =================================================
//             ENTER DEVICE DETAILS
//         ================================================= */}

//         {popup ===
//           "details" && (

//           <PopupOverlay>

//             <PopupCard
//               title="Enter Device Details"
//               subtitle="Nickname and Address"
//             >

//               <input
//                 type="text"

//                 placeholder="e.g. Main Roof Inverter"

//                 value={
//                   nickname
//                 }

//                 onChange={(e) =>
//                   setNickname(
//                     e.target.value
//                   )
//                 }

//                 style={
//                   popupInputStyle
//                 }
//               />


//               <input
//                 type="text"

//                 placeholder="e.g. 123 Solar Street"

//                 value={
//                   address
//                 }

//                 onChange={(e) =>
//                   setAddress(
//                     e.target.value
//                   )
//                 }

//                 style={{
//                   ...popupInputStyle,
//                   marginBottom: 4,
//                 }}
//               />


//               {error && (

//                 <div
//                   style={{
//                     marginTop:
//                       8,

//                     fontSize:
//                       12,

//                     color:
//                       P.textErrorMsg,
//                   }}
//                 >

//                   {error}

//                 </div>

//               )}


//               <div
//                 style={{
//                   display:
//                     "flex",

//                   justifyContent:
//                     "flex-end",

//                   gap:
//                     22,

//                   marginTop:
//                     18,
//                 }}
//               >

//                 <PopupTextButton
//                   onClick={
//                     handleDetailsCancel
//                   }

//                   disabled={
//                     loading
//                   }
//                 >

//                   CANCEL

//                 </PopupTextButton>


//                 <PopupTextButton
//                   onClick={
//                     handleDetailsSave
//                   }

//                   strong

//                   disabled={
//                     loading
//                   }
//                 >

//                   {loading
//                     ? "ADDING..."
//                     : "SAVE"}

//                 </PopupTextButton>

//               </div>

//             </PopupCard>

//           </PopupOverlay>

//         )}


//         {/* =================================================
//             BACK BUTTON
//         ================================================= */}

//         <div
//           style={{
//             position:
//               "absolute",

//             top:
//               16,

//             left:
//               16,

//             zIndex:
//               10,
//           }}
//         >

//           <button
//             type="button"

//             onClick={
//               handleBack
//             }

//             style={{
//               width:
//                 40,

//               height:
//                 40,

//               borderRadius:
//                 "50%",

//               backgroundColor:
//                 "#fff",

//               border:
//                 "none",

//               display:
//                 "flex",

//               alignItems:
//                 "center",

//               justifyContent:
//                 "center",

//               cursor:
//                 "pointer",

//               fontSize:
//                 18,
//             }}
//           >

//             ←

//           </button>

//         </div>


//         {/* =================================================
//             TOAST
//         ================================================= */}

//         {toast && (

//           <div
//             style={{
//               position:
//                 "absolute",

//               left:
//                 "50%",

//               top:
//                 "46%",

//               transform:
//                 "translate(-50%, -50%)",

//               background:
//                 "rgba(40, 40, 40, 0.94)",

//               color:
//                 "#fff",

//               padding:
//                 "11px 20px",

//               borderRadius:
//                 20,

//               fontSize:
//                 13,

//               fontFamily:
//                 "'Inter', sans-serif",

//               whiteSpace:
//                 "nowrap",

//               zIndex:
//                 4000,

//               boxShadow:
//                 "0 4px 14px rgba(0, 0, 0, 0.3)",
//             }}
//           >

//             {toast}

//           </div>

//         )}

//       </div>

//     </div>
//   );
// }


// // =====================================================
// // POPUP INPUT
// // =====================================================

// const popupInputStyle = {

//   width:
//     "100%",

//   padding:
//     "10px 2px",

//   marginBottom:
//     18,

//   border:
//     "none",

//   borderBottom:
//     `1px solid ${P.border}`,

//   background:
//     "transparent",

//   fontSize:
//     14,

//   fontFamily:
//     "'Inter', sans-serif",

//   color:
//     P.textPrimary,

//   outline:
//     "none",

//   boxSizing:
//     "border-box",
// };


// // =====================================================
// // POPUP OVERLAY
// // =====================================================

// function PopupOverlay({
//   children,
// }) {

//   return (

//     <div
//       style={{
//         position:
//           "absolute",

//         inset:
//           0,

//         background:
//           "rgba(0, 0, 0, 0.45)",

//         display:
//           "flex",

//         alignItems:
//           "center",

//         justifyContent:
//           "center",

//         padding:
//           "0 24px",

//         zIndex:
//           2000,

//         boxSizing:
//           "border-box",
//       }}
//     >

//       {children}

//     </div>
//   );
// }


// // =====================================================
// // POPUP CARD
// // =====================================================

// function PopupCard({
//   title,
//   subtitle,
//   children,
// }) {

//   return (

//     <div
//       style={{
//         width:
//           "100%",

//         maxWidth:
//           360,

//         background:
//           "#FBEFDD",

//         borderRadius:
//           4,

//         padding:
//           "20px 22px",

//         boxShadow:
//           "0 12px 32px rgba(0, 0, 0, 0.35)",

//         boxSizing:
//           "border-box",
//       }}
//     >

//       <div
//         style={{
//           fontSize:
//             17,

//           fontWeight:
//             700,

//           color:
//             P.textPrimary,

//           fontFamily:
//             "'DM Sans', sans-serif",

//           marginBottom:
//             subtitle
//               ? 4
//               : 14,
//         }}
//       >

//         {title}

//       </div>


//       {subtitle && (

//         <div
//           style={{
//             fontSize:
//               13,

//             color:
//               P.textSecond,

//             fontFamily:
//               "'Inter', sans-serif",

//             marginBottom:
//               16,
//           }}
//         >

//           {subtitle}

//         </div>

//       )}


//       {children}

//     </div>
//   );
// }


// // =====================================================
// // POPUP LIST ITEM
// // =====================================================

// function PopupListItem({
//   children,
//   onClick,
// }) {

//   return (

//     <button
//       type="button"

//       onClick={
//         onClick
//       }

//       style={{
//         display:
//           "block",

//         width:
//           "100%",

//         textAlign:
//           "left",

//         background:
//           "none",

//         border:
//           "none",

//         padding:
//           "10px 0",

//         fontSize:
//           14,

//         color:
//           P.textPrimary,

//         fontFamily:
//           "'Inter', sans-serif",

//         cursor:
//           "pointer",

//         WebkitTapHighlightColor:
//           "transparent",
//       }}
//     >

//       {children}

//     </button>
//   );
// }


// // =====================================================
// // POPUP TEXT BUTTON
// // =====================================================

// function PopupTextButton({
//   children,
//   onClick,
//   strong = false,
//   disabled = false,
// }) {

//   return (

//     <button
//       type="button"

//       onClick={
//         onClick
//       }

//       disabled={
//         disabled
//       }

//       style={{
//         background:
//           "none",

//         border:
//           "none",

//         padding:
//           "6px 4px",

//         fontSize:
//           13,

//         fontWeight:
//           700,

//         letterSpacing:
//           0.4,

//         color:
//           strong
//             ? P.amberDark
//             : P.textSecond,

//         fontFamily:
//           "'DM Sans', sans-serif",

//         cursor:
//           disabled
//             ? "not-allowed"
//             : "pointer",

//         opacity:
//           disabled
//             ? 0.6
//             : 1,

//         WebkitTapHighlightColor:
//           "transparent",
//       }}
//     >

//       {children}

//     </button>
//   );
// }








// import {
//   Html5Qrcode,
//   Html5QrcodeSupportedFormats,
// } from "html5-qrcode";

// import {
//   useCallback,
//   useEffect,
//   useRef,
//   useState,
// } from "react";

// import { useNavigate } from "react-router-dom";
// import { useInverter } from "../context/Context";

// import P from "../theme/colors";

// import {
//   isDeviceSaved,
//   saveDeviceMeta,
// } from "../utils/deviceMeta";


// // =====================================================
// // PRODUCT TYPES
// // =====================================================

// const PRODUCT_TYPES = [
//   "MPPT based Off-Grid PCU",
//   "MPPT based Hybrid-1P PCU",
//   "Intelligent Power Supply (IPS)",
//   "Grid-Tie Inverter",
//   "MPPT based Hybrid-3P PCU",
// ];


// // =====================================================
// // AVAILABLE GRID-TIE MODELS
// // =====================================================

// const GRID_TIE_MODELS = [
//   "Energiaa X3 - 3KW",
//   "Energiaa X3T - 3KW",
//   "Energiaa X5T - 5KW",
//   "Energiaa X5.5T - 5.5KW",
// ];


// // =====================================================
// // COMPONENT
// // =====================================================

// export default function AddDevice() {

//   const navigate = useNavigate();

//   const {
//     refreshDevices,
//     setSelectedDeviceId,
//     openTemporaryDevice,
//   } = useInverter();


//   // =====================================================
//   // WIZARD STATE
//   // =====================================================

//   const [popup, setPopup] = useState(null);

//   const [imei, setImei] = useState("");
//   const [productType, setProductType] = useState("");
//   const [model, setModel] = useState("");
//   const [nickname, setNickname] = useState("");
//   const [address, setAddress] = useState("");

//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);


//   // =====================================================
//   // TOAST
//   // =====================================================

//   const [toast, setToast] = useState("");

//   const toastTimerRef = useRef(null);


//   const showToast = useCallback((message, duration = 1600) => {

//     if (toastTimerRef.current) {
//       window.clearTimeout(toastTimerRef.current);
//     }

//     setToast(message);

//     toastTimerRef.current =
//       window.setTimeout(() => {

//         setToast("");
//         toastTimerRef.current = null;

//       }, duration);

//   }, []);


//   // =====================================================
//   // CAMERA STATE
//   // =====================================================

//   const [cameraOn, setCameraOn] = useState(false);
//   const [cameraReady, setCameraReady] = useState(false);
//   const [cameraError, setCameraError] = useState("");

//   const scannerRef = useRef(null);
//   const isRunningRef = useRef(false);
//   const startTokenRef = useRef(0);

//   const scannerId = "add-device-qr-scanner";


//   // =====================================================
//   // NORMALIZE DEVICE CODE
//   // =====================================================

//   const normalizeDeviceCode = (value) => {

//     return String(value ?? "")
//       .trim()
//       .toUpperCase();
//   };


//   // =====================================================
//   // STOP CAMERA
//   // =====================================================

//   const stopScanner = useCallback(async () => {

//     // Invalidates any start() operation still in progress.
//     startTokenRef.current += 1;

//     const scanner = scannerRef.current;

//     scannerRef.current = null;

//     setCameraOn(false);
//     setCameraReady(false);

//     if (!scanner) {
//       isRunningRef.current = false;
//       return;
//     }

//     try {

//       if (isRunningRef.current) {

//         isRunningRef.current = false;

//         await scanner.stop();
//       }

//     } catch (err) {

//       console.debug(
//         "Scanner stop ignored:",
//         err
//       );

//     }

//     try {

//       scanner.clear();

//     } catch (err) {

//       // Ignore clear errors.
//     }

//   }, []);


//   // =====================================================
//   // START CAMERA / BARCODE SCANNER
//   // =====================================================

//   const startScanner = useCallback(() => {

//     // Prevent duplicate starts.
//     if (scannerRef.current) {
//       return;
//     }

//     setCameraError("");
//     setError("");
//     setCameraOn(true);
//     setCameraReady(false);

//     const token =
//       ++startTokenRef.current;


//     // ===================================================
//     // ENABLE 1D BARCODE FORMATS
//     //
//     // Device labels like:
//     //
//     // S1SES1250416509
//     //
//     // are normally encoded using a linear barcode such
//     // as CODE_128 / CODE_39 rather than QR.
//     // ===================================================

//     const html5QrCode =
//       new Html5Qrcode(
//         scannerId,
//         {
//           formatsToSupport: [
//             Html5QrcodeSupportedFormats.CODE_128,
//             Html5QrcodeSupportedFormats.CODE_39,
//             Html5QrcodeSupportedFormats.CODE_93,
//             Html5QrcodeSupportedFormats.CODABAR,
//             Html5QrcodeSupportedFormats.EAN_13,
//             Html5QrcodeSupportedFormats.EAN_8,
//             Html5QrcodeSupportedFormats.UPC_A,
//             Html5QrcodeSupportedFormats.UPC_E,
//           ],

//           verbose: false,
//         }
//       );


//     scannerRef.current =
//       html5QrCode;


//     html5QrCode
//       .start(

//         // -----------------------------------------------
//         // Prefer rear camera.
//         // -----------------------------------------------

//         {
//           facingMode: "environment",
//         },


//         // -----------------------------------------------
//         // SCANNER CONFIG
//         //
//         // Wide rectangle instead of square because your
//         // device uses a horizontal 1D barcode.
//         // -----------------------------------------------

//         {
//           fps: 15,

//           qrbox: (
//             viewfinderWidth,
//             viewfinderHeight
//           ) => {

//             const width =
//               Math.max(
//                 180,
//                 Math.min(
//                   Math.floor(
//                     viewfinderWidth * 0.88
//                   ),
//                   360
//                 )
//               );


//             const height =
//               Math.max(
//                 80,
//                 Math.min(
//                   Math.floor(
//                     viewfinderHeight * 0.25
//                   ),
//                   130
//                 )
//               );


//             return {
//               width,
//               height,
//             };
//           },

//           disableFlip: false,
//         },


//         // -----------------------------------------------
//         // SCAN SUCCESS
//         // -----------------------------------------------

//         (decodedText, decodedResult) => {

//           const scannedCode =
//             normalizeDeviceCode(
//               decodedText
//             );


//           console.log(
//             "Barcode scanned:",
//             scannedCode
//           );

//           console.log(
//             "Barcode result:",
//             decodedResult
//           );


//           if (!scannedCode) {
//             return;
//           }


//           // Fill device-code field automatically.
//           setImei(scannedCode);

//           setError("");
//           setCameraError("");


//           showToast(
//             "Barcode scanned"
//           );


//           // Close camera after successful scan.
//           stopScanner();
//         },


//         // -----------------------------------------------
//         // FRAME SCAN FAILURE
//         //
//         // Completely normal while camera is searching.
//         // -----------------------------------------------

//         () => {}

//       )

//       .then(() => {

//         // Scanner may have been stopped while start()
//         // was still resolving.

//         if (
//           startTokenRef.current !== token
//         ) {

//           html5QrCode
//             .stop()
//             .then(() => {

//               try {
//                 html5QrCode.clear();
//               } catch (err) {
//                 // Ignore.
//               }

//             })
//             .catch(() => {});

//           return;
//         }


//         isRunningRef.current = true;

//         setCameraReady(true);
//       })

//       .catch((err) => {

//         console.error(
//           "Camera / barcode scanner error:",
//           err
//         );


//         if (
//           scannerRef.current ===
//           html5QrCode
//         ) {

//           scannerRef.current = null;
//         }


//         isRunningRef.current = false;

//         setCameraOn(false);
//         setCameraReady(false);


//         setCameraError(
//           "Couldn't access the camera. You can still type the code below."
//         );

//       });

//   }, [
//     showToast,
//     stopScanner,
//   ]);


//   // =====================================================
//   // STOP CAMERA WHEN POPUP OPENS
//   // =====================================================

//   useEffect(() => {

//     if (popup !== null) {
//       stopScanner();
//     }

//   }, [
//     popup,
//     stopScanner,
//   ]);


//   // =====================================================
//   // CLEANUP ON UNMOUNT
//   // =====================================================

//   useEffect(() => {

//     return () => {

//       stopScanner();

//       if (toastTimerRef.current) {
//         window.clearTimeout(
//           toastTimerRef.current
//         );
//       }

//     };

//   }, [
//     stopScanner,
//   ]);


//   // =====================================================
//   // OPEN QUICK ACCESS
//   //
//   // NO 15-DIGIT VALIDATION.
//   //
//   // Values such as:
//   //
//   // S1SES1250416509
//   //
//   // are valid.
//   // =====================================================

//   const handleOpenQuickAccess = async () => {

//     setError("");

//     const cleanImei =
//       normalizeDeviceCode(
//         imei
//       );


//     if (!cleanImei) {

//       setError(
//         "Please scan or enter the device code"
//       );

//       return;
//     }


//     // Keep normalized value in input.
//     setImei(cleanImei);

//     setLoading(true);


//     try {

//       const res =
//         await fetch(
//           `/api/user/devices/${encodeURIComponent(
//             cleanImei
//           )}`
//         );


//       const result =
//         await res.json();


//       if (!res.ok) {

//         setError(
//           result?.error ||
//           "Device not found"
//         );

//         return;
//       }


//       // Device exists.
//       setPopup(
//         "productType"
//       );

//     } catch (err) {

//       console.error(
//         "Quick access device lookup error:",
//         err
//       );


//       setError(
//         "Server error. Please try again."
//       );

//     } finally {

//       setLoading(false);
//     }
//   };


//   // =====================================================
//   // SELECT PRODUCT TYPE
//   //
//   // ONLY GRID-TIE IS CURRENTLY AVAILABLE.
//   // =====================================================

//   const handleSelectProductType = (type) => {

//     setError("");


//     if (
//       type !==
//       "Grid-Tie Inverter"
//     ) {

//       setProductType("");
//       setModel("");

//       // Return to Quick Access screen.
//       setPopup(null);

//       showToast(
//         "Device not available"
//       );

//       return;
//     }


//     setProductType(type);
//     setModel("");

//     setPopup(
//       "model"
//     );
//   };


//   // =====================================================
//   // SELECT MODEL
//   // =====================================================

//   const handleSelectModel = (selectedModel) => {

//     setModel(
//       selectedModel
//     );

//     setPopup(
//       "confirmAdd"
//     );
//   };


//   // =====================================================
//   // CONFIRM ADD - NO
//   //
//   // Open temporarily without saving locally.
//   // =====================================================

//   const handleConfirmAddNo = async () => {

//     setError("");
//     setLoading(true);


//     try {

//       const cleanImei =
//         normalizeDeviceCode(
//           imei
//         );


//       if (!cleanImei) {

//         setError(
//           "Please scan or enter the device code"
//         );

//         setPopup(null);

//         return;
//       }


//       const res =
//         await fetch(
//           `/api/user/devices/${encodeURIComponent(
//             cleanImei
//           )}`
//         );


//       const result =
//         await res.json();


//       if (!res.ok) {

//         setError(
//           result?.error ||
//           "Device not found"
//         );

//         setPopup(null);

//         setProductType("");
//         setModel("");

//         return;
//       }


//       openTemporaryDevice(
//         result.device
//       );


//       navigate(
//         "/home",
//         {
//           replace: true,
//         }
//       );

//     } catch (err) {

//       console.error(
//         "Temporary device lookup error:",
//         err
//       );


//       setError(
//         "Server error. Please try again."
//       );


//       setPopup(null);

//       setProductType("");
//       setModel("");

//     } finally {

//       setLoading(false);
//     }
//   };


//   // =====================================================
//   // CONFIRM ADD - YES
//   // =====================================================

//   const handleConfirmAddYes = () => {

//     setError("");

//     setPopup(
//       "details"
//     );
//   };


//   // =====================================================
//   // DETAILS CANCEL
//   // =====================================================

//   const handleDetailsCancel = () => {

//     setPopup(null);

//     setProductType("");
//     setModel("");

//     setNickname("");
//     setAddress("");

//     setError("");
//   };


//   // =====================================================
//   // DETAILS SAVE
//   // =====================================================

//   const handleDetailsSave = () => {

//     setError("");


//     if (
//       !nickname.trim() ||
//       !address.trim()
//     ) {

//       setError(
//         "Nickname and address are both required"
//       );

//       return;
//     }


//     addDevice();
//   };


//   // =====================================================
//   // SAVE DEVICE
//   //
//   // Device metadata is saved in localStorage.
//   //
//   // NO USER LOGIN / ACCOUNT STORAGE REQUIRED HERE.
//   // NO 15-DIGIT VALIDATION.
//   // =====================================================

//   const addDevice = async () => {

//     setError("");


//     const cleanImei =
//       normalizeDeviceCode(
//         imei
//       );


//     if (!cleanImei) {

//       setError(
//         "Please scan or enter the device code"
//       );

//       setPopup(
//         "details"
//       );

//       return;
//     }


//     // =================================================
//     // ALREADY SAVED ON THIS DEVICE/BROWSER
//     // =================================================

//     if (
//       isDeviceSaved(
//         cleanImei
//       )
//     ) {

//       setPopup(null);


//       showToast(
//         "Device already exists",
//         1200
//       );


//       setSelectedDeviceId(
//         cleanImei
//       );


//       window.setTimeout(() => {

//         navigate(
//           "/home",
//           {
//             replace: true,
//           }
//         );

//       }, 1200);


//       return;
//     }


//     setLoading(true);


//     try {

//       // =================================================
//       // VERIFY DEVICE EXISTS ON SERVER
//       // =================================================

//       const res =
//         await fetch(
//           `/api/user/devices/${encodeURIComponent(
//             cleanImei
//           )}`
//         );


//       const result =
//         await res.json();


//       if (!res.ok) {

//         setError(
//           result?.error ||
//           "Device not found"
//         );

//         setPopup(
//           "details"
//         );

//         return;
//       }


//       // =================================================
//       // SAVE DEVICE DETAILS LOCALLY
//       // =================================================

//       saveDeviceMeta(
//         cleanImei,
//         {

//           nickname:
//             nickname.trim(),

//           deviceType:
//             productType,

//           model,

//           location:
//             address.trim(),

//           addedAt:
//             new Date()
//               .toISOString(),
//         }
//       );


//       // =================================================
//       // REFRESH SAVED DEVICE LIST
//       // =================================================

//       if (refreshDevices) {

//         await refreshDevices();
//       }


//       // =================================================
//       // SELECT DEVICE
//       // =================================================

//       setSelectedDeviceId(
//         cleanImei
//       );


//       // =================================================
//       // GO HOME
//       // =================================================

//       navigate(
//         "/home",
//         {
//           replace: true,
//         }
//       );

//     } catch (err) {

//       console.error(
//         "Add device error:",
//         err
//       );


//       setError(
//         "Server error. Please try again."
//       );


//       setPopup(
//         "details"
//       );

//     } finally {

//       setLoading(false);
//     }
//   };


//   // =====================================================
//   // BACK BUTTON
//   // =====================================================

//   const handleBack = () => {

//     if (
//       popup !== null
//     ) {

//       setPopup(null);

//       return;
//     }


//     navigate(-1);
//   };


//   // =====================================================
//   // UI
//   // =====================================================

//   return (

//     <div
//       style={{
//         minHeight: "100vh",
//         width: "100%",
//         background: P.pageSide,
//         fontFamily: "'Inter', sans-serif",
//       }}
//     >

//       {/* =================================================
//           PHONE-SIZED AREA
//       ================================================= */}

//       <div
//         style={{
//           width: "100%",
//           maxWidth: 520,
//           minHeight: "100vh",
//           margin: "0 auto",
//           position: "relative",
//           overflow: "clip",
//           background: "#0B0B0B",
//         }}
//       >


//         {/* =================================================
//             CAMERA / QUICK ACCESS
//         ================================================= */}

//         <div
//           style={{
//             position: "absolute",
//             inset: 0,
//             display: "flex",
//             flexDirection: "column",
//           }}
//         >

//           {/* CAMERA AREA */}

//           <div
//             style={{
//               flex: 1,
//               width: "100%",
//               background: "#000",
//               position: "relative",
//               overflow: "hidden",
//             }}
//           >

//             {/* html5-qrcode camera target */}

//             <div
//               id={scannerId}

//               style={{
//                 width: "100%",
//                 height: "100%",
//                 display:
//                   cameraOn
//                     ? "block"
//                     : "none",
//               }}
//             />


//             {/* =================================================
//                 CAMERA OFF
//             ================================================= */}

//             {!cameraOn && (

//               <button
//                 type="button"

//                 onClick={
//                   startScanner
//                 }

//                 style={{
//                   position: "absolute",
//                   inset: 0,
//                   width: "100%",
//                   height: "100%",
//                   border: "none",
//                   background: "transparent",
//                   display: "flex",
//                   flexDirection: "column",
//                   alignItems: "center",
//                   justifyContent: "center",
//                   gap: 12,
//                   cursor: "pointer",
//                   color: "#cfcfcf",
//                   WebkitTapHighlightColor:
//                     "transparent",
//                 }}
//               >

//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   width="34"
//                   height="34"
//                   viewBox="0 0 24 24"
//                   fill="none"
//                   stroke="currentColor"
//                   strokeWidth="1.8"
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                 >

//                   <path
//                     d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"
//                   />

//                   <circle
//                     cx="12"
//                     cy="13"
//                     r="4"
//                   />

//                 </svg>


//                 <div
//                   style={{
//                     fontSize: 13,
//                     padding: "0 24px",
//                     textAlign: "center",
//                     fontFamily:
//                       "'Inter', sans-serif",
//                   }}
//                 >
//                   Tap to scan the device barcode
//                 </div>

//               </button>
//             )}


//             {/* =================================================
//                 CAMERA STARTING
//             ================================================= */}

//             {cameraOn &&
//               !cameraReady && (

//                 <div
//                   style={{
//                     position: "absolute",
//                     inset: 0,
//                     display: "flex",
//                     alignItems: "center",
//                     justifyContent: "center",
//                     color: "#cfcfcf",
//                     fontSize: 13,
//                     pointerEvents: "none",
//                   }}
//                 >
//                   Starting camera…
//                 </div>
//               )}


//             {/* =================================================
//                 CLOSE CAMERA
//             ================================================= */}

//             {cameraOn && (

//               <button
//                 type="button"

//                 onClick={
//                   stopScanner
//                 }

//                 aria-label="Close camera"

//                 style={{
//                   position: "absolute",
//                   top: 14,
//                   right: 14,
//                   width: 38,
//                   height: 38,
//                   borderRadius: "50%",
//                   border: "none",
//                   background:
//                     "rgba(0,0,0,0.65)",
//                   color: "#fff",
//                   display: "flex",
//                   alignItems: "center",
//                   justifyContent: "center",
//                   cursor: "pointer",
//                   fontSize: 21,
//                   lineHeight: 1,
//                   zIndex: 50,
//                 }}
//               >
//                 ×
//               </button>
//             )}


//             {/* =================================================
//                 SCANNER INSTRUCTION
//             ================================================= */}

//             {cameraOn &&
//               cameraReady && (

//                 <div
//                   style={{
//                     position: "absolute",
//                     left: 20,
//                     right: 20,
//                     bottom: 18,
//                     textAlign: "center",
//                     color: "#fff",
//                     fontSize: 12,
//                     fontWeight: 500,
//                     textShadow:
//                       "0 1px 4px rgba(0,0,0,0.9)",
//                     pointerEvents: "none",
//                     zIndex: 40,
//                   }}
//                 >
//                   Hold the barcode horizontally inside the rectangle
//                 </div>
//               )}


//             {/* =================================================
//                 CAMERA ERROR
//             ================================================= */}

//             {cameraError && (

//               <div
//                 style={{
//                   position: "absolute",
//                   bottom: 10,
//                   left: 16,
//                   right: 16,
//                   textAlign: "center",
//                   color: "#ff9a9a",
//                   fontSize: 12,
//                   zIndex: 50,
//                 }}
//               >
//                 {cameraError}
//               </div>
//             )}

//           </div>


//           {/* =================================================
//               BOTTOM PANEL
//           ================================================= */}

//           <div
//             style={{
//               padding:
//                 "16px 20px calc(28px + env(safe-area-inset-bottom))",

//               boxSizing:
//                 "border-box",
//             }}
//           >

//             <input
//               type="text"

//               inputMode="text"

//               autoCapitalize="characters"

//               autoCorrect="off"

//               spellCheck={false}

//               placeholder="Scan or enter device code"

//               value={imei}

//               onChange={(e) => {

//                 // Allow letters and numbers.
//                 // Remove spaces / punctuation.
//                 // Convert letters to uppercase.

//                 const value =
//                   e.target.value
//                     .toUpperCase()
//                     .replace(
//                       /[^A-Z0-9]/g,
//                       ""
//                     );


//                 setImei(
//                   value
//                 );

//                 setError("");
//               }}

//               style={{
//                 width: "100%",
//                 padding: "13px 16px",
//                 borderRadius: 8,
//                 border:
//                   `1px solid ${P.amber}`,
//                 background: "#FFFDF6",
//                 color: P.textPrimary,
//                 fontSize: 14,
//                 fontFamily:
//                   "'Inter', sans-serif",
//                 outline: "none",
//                 boxSizing: "border-box",
//                 marginBottom: 10,
//               }}
//             />


//             <button
//               type="button"

//               onClick={
//                 handleOpenQuickAccess
//               }

//               disabled={
//                 loading
//               }

//               style={{
//                 width: "100%",
//                 padding: "15px 16px",
//                 border: "none",
//                 borderRadius: 8,

//                 background:
//                   "linear-gradient(180deg, #2F8FD1 0%, #1F6FB5 100%)",

//                 color: P.textWhite,

//                 fontSize: 15,
//                 fontWeight: 700,
//                 letterSpacing: 0.6,
//                 textTransform: "uppercase",

//                 fontFamily:
//                   "'DM Sans', sans-serif",

//                 cursor:
//                   loading
//                     ? "not-allowed"
//                     : "pointer",

//                 opacity:
//                   loading
//                     ? 0.7
//                     : 1,
//               }}
//             >

//               {loading
//                 ? "Opening..."
//                 : "Open Quick Access"}

//             </button>


//             <div
//               style={{
//                 marginTop: 8,
//                 fontSize: 11,
//                 color: "#d8d8d8",
//                 width: "100%",
//                 textAlign: "center",
//                 padding: "0 16px",
//                 boxSizing: "border-box",
//               }}
//             >
//               Hold the device barcode horizontally inside the rectangle.
//             </div>


//             {/* ERROR */}

//             {error &&
//               popup === null && (

//                 <div
//                   style={{
//                     marginTop: 10,
//                     padding: "9px 14px",
//                     borderRadius: 8,
//                     background: "#3a1414",
//                     border:
//                       "1px solid #5a2020",
//                     color: "#ff9a9a",
//                     fontSize: 12,
//                   }}
//                 >
//                   {error}
//                 </div>
//               )}

//           </div>

//         </div>


//         {/* =================================================
//             SELECT PRODUCT TYPE
//         ================================================= */}

//         {popup === "productType" && (

//           <PopupOverlay>

//             <PopupCard
//               title="Select Product Type"
//             >

//               {PRODUCT_TYPES.map(
//                 (type) => (

//                   <PopupListItem
//                     key={type}

//                     onClick={() =>
//                       handleSelectProductType(
//                         type
//                       )
//                     }
//                   >
//                     {type}
//                   </PopupListItem>

//                 )
//               )}

//             </PopupCard>

//           </PopupOverlay>
//         )}


//         {/* =================================================
//             SELECT GRID-TIE MODEL
//         ================================================= */}

//         {popup === "model" && (

//           <PopupOverlay>

//             <PopupCard
//               title="Select Model"
//             >

//               {GRID_TIE_MODELS.map(
//                 (modelName) => (

//                   <PopupListItem
//                     key={modelName}

//                     onClick={() =>
//                       handleSelectModel(
//                         modelName
//                       )
//                     }
//                   >
//                     {modelName}
//                   </PopupListItem>

//                 )
//               )}

//             </PopupCard>

//           </PopupOverlay>
//         )}


//         {/* =================================================
//             CONFIRM ADD
//         ================================================= */}

//         {popup === "confirmAdd" && (

//           <PopupOverlay>

//             <PopupCard
//               title="Add Device"
//               subtitle="Do you want to add this device to your list?"
//             >

//               <div
//                 style={{
//                   display: "flex",
//                   justifyContent:
//                     "flex-end",
//                   gap: 22,
//                   marginTop: 18,
//                 }}
//               >

//                 <PopupTextButton
//                   onClick={
//                     handleConfirmAddNo
//                   }

//                   disabled={
//                     loading
//                   }
//                 >
//                   {loading
//                     ? "OPENING..."
//                     : "NO"}
//                 </PopupTextButton>


//                 <PopupTextButton
//                   onClick={
//                     handleConfirmAddYes
//                   }

//                   strong

//                   disabled={
//                     loading
//                   }
//                 >
//                   YES
//                 </PopupTextButton>

//               </div>

//             </PopupCard>

//           </PopupOverlay>
//         )}


//         {/* =================================================
//             ENTER DEVICE DETAILS
//         ================================================= */}

//         {popup === "details" && (

//           <PopupOverlay>

//             <PopupCard
//               title="Enter Device Details"
//               subtitle="Nickname and Address"
//             >

//               <input
//                 type="text"

//                 placeholder="e.g. Main Roof Inverter"

//                 value={
//                   nickname
//                 }

//                 onChange={(e) =>
//                   setNickname(
//                     e.target.value
//                   )
//                 }

//                 style={
//                   popupInputStyle
//                 }
//               />


//               <input
//                 type="text"

//                 placeholder="e.g. 123 Solar Street"

//                 value={
//                   address
//                 }

//                 onChange={(e) =>
//                   setAddress(
//                     e.target.value
//                   )
//                 }

//                 style={{
//                   ...popupInputStyle,
//                   marginBottom: 4,
//                 }}
//               />


//               {error && (

//                 <div
//                   style={{
//                     marginTop: 8,
//                     fontSize: 12,
//                     color:
//                       P.textErrorMsg,
//                   }}
//                 >
//                   {error}
//                 </div>
//               )}


//               <div
//                 style={{
//                   display: "flex",
//                   justifyContent:
//                     "flex-end",
//                   gap: 22,
//                   marginTop: 18,
//                 }}
//               >

//                 <PopupTextButton
//                   onClick={
//                     handleDetailsCancel
//                   }

//                   disabled={
//                     loading
//                   }
//                 >
//                   CANCEL
//                 </PopupTextButton>


//                 <PopupTextButton
//                   onClick={
//                     handleDetailsSave
//                   }

//                   strong

//                   disabled={
//                     loading
//                   }
//                 >

//                   {loading
//                     ? "ADDING..."
//                     : "SAVE"}

//                 </PopupTextButton>

//               </div>

//             </PopupCard>

//           </PopupOverlay>
//         )}


//         {/* =================================================
//             BACK BUTTON
//         ================================================= */}

//         <div
//           style={{
//             position: "absolute",
//             top: 16,
//             left: 16,
//             zIndex: 100,
//           }}
//         >

//           <button
//             type="button"

//             onClick={
//               handleBack
//             }

//             style={{
//               width: 40,
//               height: 40,
//               borderRadius: "50%",
//               backgroundColor: "#fff",
//               border: "none",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//               cursor: "pointer",
//               fontSize: 18,
//               color: "#111",
//               boxShadow:
//                 "0 3px 10px rgba(0,0,0,0.25)",
//             }}
//           >
//             ←
//           </button>

//         </div>


//         {/* =================================================
//             TOAST
//         ================================================= */}

//         {toast && (

//           <div
//             style={{
//               position: "absolute",
//               left: "50%",
//               top: "46%",

//               transform:
//                 "translate(-50%, -50%)",

//               background:
//                 "rgba(40, 40, 40, 0.94)",

//               color: "#fff",

//               padding:
//                 "11px 20px",

//               borderRadius:
//                 20,

//               fontSize:
//                 13,

//               fontFamily:
//                 "'Inter', sans-serif",

//               whiteSpace:
//                 "nowrap",

//               zIndex:
//                 4000,

//               boxShadow:
//                 "0 4px 14px rgba(0,0,0,0.3)",
//             }}
//           >
//             {toast}
//           </div>
//         )}

//       </div>

//     </div>
//   );
// }


// // =====================================================
// // POPUP INPUT STYLE
// // =====================================================

// const popupInputStyle = {

//   width: "100%",

//   padding: "10px 2px",

//   marginBottom: 18,

//   border: "none",

//   borderBottom:
//     `1px solid ${P.border}`,

//   background:
//     "transparent",

//   fontSize: 14,

//   fontFamily:
//     "'Inter', sans-serif",

//   color:
//     P.textPrimary,

//   outline:
//     "none",

//   boxSizing:
//     "border-box",
// };


// // =====================================================
// // POPUP OVERLAY
// // =====================================================

// function PopupOverlay({
//   children,
// }) {

//   return (

//     <div
//       style={{
//         position: "absolute",
//         inset: 0,

//         background:
//           "rgba(0, 0, 0, 0.45)",

//         display: "flex",

//         alignItems:
//           "center",

//         justifyContent:
//           "center",

//         padding:
//           "0 24px",

//         zIndex:
//           2000,

//         boxSizing:
//           "border-box",
//       }}
//     >
//       {children}
//     </div>
//   );
// }


// // =====================================================
// // POPUP CARD
// // =====================================================

// function PopupCard({
//   title,
//   subtitle,
//   children,
// }) {

//   return (

//     <div
//       style={{
//         width: "100%",

//         maxWidth:
//           360,

//         background:
//           "#FBEFDD",

//         borderRadius:
//           4,

//         padding:
//           "20px 22px",

//         boxShadow:
//           "0 12px 32px rgba(0,0,0,0.35)",

//         boxSizing:
//           "border-box",
//       }}
//     >

//       <div
//         style={{
//           fontSize: 17,
//           fontWeight: 700,

//           color:
//             P.textPrimary,

//           fontFamily:
//             "'DM Sans', sans-serif",

//           marginBottom:
//             subtitle
//               ? 4
//               : 14,
//         }}
//       >
//         {title}
//       </div>


//       {subtitle && (

//         <div
//           style={{
//             fontSize: 13,

//             color:
//               P.textSecond,

//             fontFamily:
//               "'Inter', sans-serif",

//             marginBottom:
//               16,
//           }}
//         >
//           {subtitle}
//         </div>
//       )}


//       {children}

//     </div>
//   );
// }


// // =====================================================
// // POPUP LIST ITEM
// // =====================================================

// function PopupListItem({
//   children,
//   onClick,
// }) {

//   return (

//     <button
//       type="button"

//       onClick={
//         onClick
//       }

//       style={{
//         display: "block",

//         width: "100%",

//         textAlign:
//           "left",

//         background:
//           "none",

//         border:
//           "none",

//         padding:
//           "10px 0",

//         fontSize:
//           14,

//         color:
//           P.textPrimary,

//         fontFamily:
//           "'Inter', sans-serif",

//         cursor:
//           "pointer",

//         WebkitTapHighlightColor:
//           "transparent",
//       }}
//     >
//       {children}
//     </button>
//   );
// }


// // =====================================================
// // POPUP TEXT BUTTON
// // =====================================================

// function PopupTextButton({
//   children,
//   onClick,
//   strong = false,
//   disabled = false,
// }) {

//   return (

//     <button
//       type="button"

//       onClick={
//         onClick
//       }

//       disabled={
//         disabled
//       }

//       style={{
//         background:
//           "none",

//         border:
//           "none",

//         padding:
//           "6px 4px",

//         fontSize:
//           13,

//         fontWeight:
//           700,

//         letterSpacing:
//           0.4,

//         color:
//           strong
//             ? P.amberDark
//             : P.textSecond,

//         fontFamily:
//           "'DM Sans', sans-serif",

//         cursor:
//           disabled
//             ? "not-allowed"
//             : "pointer",

//         opacity:
//           disabled
//             ? 0.6
//             : 1,

//         WebkitTapHighlightColor:
//           "transparent",
//       }}
//     >
//       {children}
//     </button>
//   );
// }









import { Html5Qrcode, Html5QrcodeSupportedFormats } from "html5-qrcode";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";
import { useInverter } from "../context/Context";

import P from "../theme/colors";

import {
  isDeviceSaved,
  saveDeviceMeta,
} from "../utils/deviceMeta";


// =====================================================
// API
// =====================================================

// Local development
const API_BASE = "http://localhost:3000";

// VPSCHANGE
// When uploaded to VPS and frontend/backend use same domain,
// you can use relative URLs as already done below.


// =====================================================
// PRODUCT TYPES
// =====================================================
//
// All product types are shown.
//
// HOWEVER:
//
// Only "Grid-Tie Inverter" is currently supported.
//
// Selecting any other product type:
//      -> shows "Device not available"
//      -> closes popup
//      -> returns to Quick Access screen
//
// =====================================================

const PRODUCT_TYPES = [
  "MPPT based Off-Grid PCU",
  "MPPT based Hybrid-1P PCU",
  "Intelligent Power Supply (IPS)",
  "Grid-Tie Inverter",
  "MPPT based Hybrid-3P PCU",
];


// =====================================================
// AVAILABLE GRID-TIE MODELS
// =====================================================

const GRID_TIE_MODELS = [
  "Energiaa X3 - 3KW",
  "Energiaa X3T - 3KW",
  "Energiaa X5T - 5KW",
  "Energiaa X5.5T - 5.5KW",
];


// =====================================================
// COMPONENT
// =====================================================

export default function AddDevice() {

  const navigate =
    useNavigate();


  const {
    refreshDevices,
    setSelectedDeviceId,
    openTemporaryDevice,
  } = useInverter();


  // =====================================================
  // WIZARD STATE
  // =====================================================

  const [popup, setPopup] =
    useState(null);

  const [imei, setImei] =
    useState("");

  const [productType, setProductType] =
    useState("");

  const [model, setModel] =
    useState("");

  const [nickname, setNickname] =
    useState("");

  const [address, setAddress] =
    useState("");

  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(false);


  // =====================================================
  // TOAST
  // =====================================================

  const [toast, setToast] =
    useState("");


  // =====================================================
  // TOAST HELPER
  // =====================================================

  const showToast = (
    message,
    duration = 1600
  ) => {

    setToast(message);

    window.setTimeout(() => {
      setToast("");
    }, duration);
  };


  // =====================================================
  // CAMERA STATE
  // =====================================================

  const [cameraOn, setCameraOn] =
    useState(false);

  const [cameraReady, setCameraReady] =
    useState(false);

  const [cameraError, setCameraError] =
    useState("");


  const scannerRef =
    useRef(null);

  const isRunningRef =
    useRef(false);

  const startTokenRef =
    useRef(0);

  const scannerId =
    "add-device-qr-scanner";


  // =====================================================
  // STOP CAMERA
  // =====================================================

  const stopScanner =
    useCallback(() => {

      startTokenRef.current += 1;

      const inst =
        scannerRef.current;

      scannerRef.current =
        null;

      setCameraOn(false);
      setCameraReady(false);


      if (
        inst &&
        isRunningRef.current
      ) {

        isRunningRef.current =
          false;

        inst
          .stop()
          .then(() =>
            inst.clear()
          )
          .catch(() => {});
      }

    }, []);


  // =====================================================
  // START CAMERA
  //
  // IMPORTANT:
  //
  // The device label uses a horizontal 1D barcode
  // (CODE_128), not a QR code.
  //
  // Restricting formatsToSupport to CODE_128 and using
  // a wide, short qrbox (instead of a square) makes
  // detection faster and far more reliable for this
  // specific label shape.
  //
  // We also:
  //
  //  - Opt into the browser's native BarcodeDetector API
  //    when supported (much faster / more accurate than
  //    the pure-JS ZXing fallback, especially on Chrome
  //    for Android).
  //
  //  - Request continuous autofocus via videoConstraints,
  //    since inconsistent scans are very often a focus
  //    problem, not a detection problem: the camera
  //    settles on a mid-distance focus that's slightly
  //    soft for a barcode held a few inches away.
  // =====================================================

  const startScanner =
    useCallback(() => {

      // Prevent duplicate camera starts
      if (scannerRef.current) {
        return;
      }


      setCameraError("");
      setCameraOn(true);


      const token =
        ++startTokenRef.current;


      const html5QrCode =
        new Html5Qrcode(
          scannerId,
          {

            // ---------------------------------------------
            // ONLY CODE 128
            // ---------------------------------------------

            formatsToSupport: [

              Html5QrcodeSupportedFormats
                .CODE_128,

            ],

            verbose: false,


            // ---------------------------------------------
            // NATIVE BARCODE DETECTOR
            //
            // Falls back to ZXing automatically on
            // browsers that don't support it.
            // ---------------------------------------------

            experimentalFeatures: {

              useBarCodeDetectorIfSupported:
                true,
            },
          }
        );


      scannerRef.current =
        html5QrCode;


      html5QrCode
        .start(

          {
            facingMode: {
              ideal: "environment",
            },
          },

          {
            // -----------------------------------------------
            // FRAME RATE
            // -----------------------------------------------

            fps: 20,


            // -----------------------------------------------
            // WIDE SCANNING AREA
            //
            // Designed specifically for a horizontal
            // barcode label instead of a square QR box.
            // -----------------------------------------------

            qrbox: (
              viewfinderWidth,
              viewfinderHeight
            ) => {

              const width =
                Math.floor(
                  viewfinderWidth * 0.92
                );


              const height =
                Math.min(
                  150,
                  Math.max(
                    100,
                    Math.floor(
                      viewfinderHeight *
                      0.22
                    )
                  )
                );


              return {
                width,
                height,
              };
            },


            disableFlip:
              false,


            // -----------------------------------------------
            // VIDEO CONSTRAINTS
            //
            // Higher resolution feed + continuous
            // autofocus where the device supports it.
            //
            // "advanced" focusMode constraints are ignored
            // (not rejected) on browsers/devices that don't
            // support them.
            // -----------------------------------------------

            videoConstraints: {

              facingMode: {
                ideal: "environment",
              },

              width: {
                ideal: 1920,
              },

              height: {
                ideal: 1080,
              },

              advanced: [
                {
                  focusMode: "continuous",
                },
              ],
            },
          },

          // =================================================
          // SUCCESSFULLY SCANNED
          // =================================================

          (decodedText) => {

            const scannedCode =
              decodedText.trim();

            setImei(
              scannedCode
            );

            setError("");

            stopScanner();
          },

          // Ignore frame-by-frame scan errors
          () => {}

        )
        .then(() => {

          if (
            startTokenRef.current !==
            token
          ) {

            html5QrCode
              .stop()
              .then(() =>
                html5QrCode.clear()
              )
              .catch(() => {});

            return;
          }


          isRunningRef.current =
            true;

          setCameraReady(true);

        })
        .catch((err) => {

          console.error(
            "Camera error:",
            err
          );


          if (
            scannerRef.current ===
            html5QrCode
          ) {
            scannerRef.current =
              null;
          }


          setCameraOn(false);
          setCameraReady(false);


          setCameraError(
            "Couldn't access the camera. You can still type the code below."
          );
        });

    }, [
      stopScanner,
    ]);


  // =====================================================
  // STOP CAMERA WHEN POPUP OPENS
  // =====================================================

  useEffect(() => {

    if (popup !== null) {
      stopScanner();
    }


    return () =>
      stopScanner();

    // eslint-disable-next-line react-hooks/exhaustive-deps

  }, [
    popup,
  ]);


  // =====================================================
  // OPEN QUICK ACCESS
  //
  // IMPORTANT:
  //
  // Previous:
  // /^\d{15}$/
  //
  // has been REMOVED.
  //
  // We now only require a non-empty device code.
  // =====================================================

  const handleOpenQuickAccess =
    async () => {

      setError("");


      const cleanImei =
        imei.trim();


      // =================================================
      // NO 15-DIGIT CHECK
      // =================================================

      if (!cleanImei) {

        setError(
          "Please scan or enter the device code"
        );

        return;
      }


      setLoading(true);


      try {

        const res =
          await fetch(
            `/api/user/devices/${encodeURIComponent(
              cleanImei
            )}`
          );


        const result =
          await res.json();


        if (!res.ok) {

          setError(
            result?.error ||
            "Device not found"
          );

          return;
        }


        // Device exists.
        // Ask the user to select product type.

        setPopup(
          "productType"
        );

      } catch (err) {

        console.error(
          "Quick access device lookup error:",
          err
        );


        setError(
          "Server error. Please try again."
        );

      } finally {

        setLoading(false);
      }
    };


  // =====================================================
  // SELECT PRODUCT TYPE
  //
  // ONLY Grid-Tie Inverter is currently available.
  // =====================================================

  const handleSelectProductType =
    (type) => {

      setError("");


      // =================================================
      // NOT GRID-TIE
      // =================================================

      if (
        type !==
        "Grid-Tie Inverter"
      ) {

        // Clear selection
        setProductType("");
        setModel("");


        // Close popup and return to
        // Quick Access screen
        setPopup(null);


        // Inform user
        showToast(
          "Device not available"
        );


        return;
      }


      // =================================================
      // GRID-TIE
      // =================================================

      setProductType(type);

      setModel("");

      setPopup(
        "model"
      );
    };


  // =====================================================
  // SELECT MODEL
  // =====================================================

  const handleSelectModel =
    (selectedModel) => {

      setModel(
        selectedModel
      );

      setPopup(
        "confirmAdd"
      );
    };


  // =====================================================
  // CONFIRM ADD - NO
  //
  // Opens device temporarily without saving it.
  // =====================================================

  const handleConfirmAddNo =
    async () => {

      setError("");
      setLoading(true);


      try {

        const cleanImei =
          imei.trim();


        if (!cleanImei) {

          setError(
            "Please scan or enter the device code"
          );

          setPopup(null);

          return;
        }


        const res =
          await fetch(
            `/api/user/devices/${encodeURIComponent(
              cleanImei
            )}`
          );


        const result =
          await res.json();


        if (!res.ok) {

          setError(
            result?.error ||
            "Device not found"
          );

          setPopup(null);

          setProductType("");
          setModel("");

          return;
        }


        openTemporaryDevice(
          result.device
        );


        navigate(
          "/home",
          {
            replace: true,
          }
        );

      } catch (err) {

        console.error(
          "Temporary device lookup error:",
          err
        );


        setError(
          "Server error. Please try again."
        );


        setPopup(null);

        setProductType("");
        setModel("");

      } finally {

        setLoading(false);
      }
    };


  // =====================================================
  // CONFIRM ADD - YES
  // =====================================================

  const handleConfirmAddYes =
    () => {

      setPopup(
        "details"
      );
    };


  // =====================================================
  // DETAILS CANCEL
  // =====================================================

  const handleDetailsCancel =
    () => {

      setPopup(null);

      setProductType("");
      setModel("");

      setNickname("");
      setAddress("");

      setError("");
    };


  // =====================================================
  // DETAILS SAVE
  // =====================================================

  const handleDetailsSave =
    () => {

      setError("");


      if (
        !nickname.trim() ||
        !address.trim()
      ) {

        setError(
          "Nickname and address are both required"
        );

        return;
      }


      addDevice();
    };


  // =====================================================
  // SAVE DEVICE
  //
  // Device metadata is stored in localStorage.
  //
  // NO 15-DIGIT IMEI VALIDATION.
  // =====================================================

  const addDevice =
    async () => {

      setError("");


      const cleanImei =
        imei.trim();


      // =================================================
      // ONLY REQUIRE NON-EMPTY CODE
      // =================================================

      if (!cleanImei) {

        setError(
          "Please scan or enter the device code"
        );

        setPopup(
          "details"
        );

        return;
      }


      // =================================================
      // ALREADY SAVED
      // =================================================

      if (
        isDeviceSaved(
          cleanImei
        )
      ) {

        setPopup(null);

        showToast(
          "Device already exists",
          1200
        );


        setSelectedDeviceId(
          cleanImei
        );


        setTimeout(() => {

          navigate(
            "/saved-devices",
            {
              replace: true,
            }
          );

          navigate(
            "/home"
          );

        }, 1200);


        return;
      }


      setLoading(true);


      try {

        // =================================================
        // VERIFY DEVICE EXISTS ON SERVER
        // =================================================

        const res =
          await fetch(
            `/api/user/devices/${encodeURIComponent(
              cleanImei
            )}`
          );


        const result =
          await res.json();


        if (!res.ok) {

          setError(
            result?.error ||
            "Device not found"
          );

          setPopup(
            "details"
          );

          return;
        }


        // =================================================
        // SAVE DEVICE INFORMATION LOCALLY
        // =================================================

        saveDeviceMeta(
          cleanImei,
          {

            nickname:
              nickname.trim(),

            deviceType:
              productType,

            model,

            location:
              address.trim(),

            addedAt:
              new Date()
                .toISOString(),
          }
        );


        // =================================================
        // REFRESH DEVICE LIST
        // =================================================

        await refreshDevices();


        // =================================================
        // SELECT NEW DEVICE
        // =================================================

        setSelectedDeviceId(
          cleanImei
        );


        // =================================================
        // NAVIGATE
        // =================================================

        navigate(
          "/saved-devices",
          {
            replace: true,
          }
        );


        navigate(
          "/home"
        );

      } catch (err) {

        console.error(
          "Add device error:",
          err
        );


        setError(
          "Server error. Please try again."
        );


        setPopup(
          "details"
        );

      } finally {

        setLoading(false);
      }
    };


  // =====================================================
  // BACK BUTTON
  // =====================================================

  const handleBack =
    () => {

      if (
        popup !== null
      ) {

        setPopup(null);

        return;
      }


      navigate(-1);
    };


  // =====================================================
  // UI
  // =====================================================

  return (

    <div
      style={{
        minHeight:
          "100vh",

        width:
          "100%",

        background:
          P.pageSide,

        fontFamily:
          "'Inter', sans-serif",
      }}
    >

      {/* =================================================
          PHONE-SIZED AREA
      ================================================= */}

      <div
        style={{
          width:
            "100%",

          maxWidth:
            520,

          minHeight:
            "100vh",

          margin:
            "0 auto",

          position:
            "relative",

          overflow:
            "clip",

          background:
            "#0B0B0B",
        }}
      >


        {/* =================================================
            CAMERA / QUICK ACCESS
        ================================================= */}

        <div
          style={{
            position:
              "absolute",

            inset:
              0,

            display:
              "flex",

            flexDirection:
              "column",
          }}
        >

          {/* CAMERA */}

          <div
            style={{
              flex:
                1,

              width:
                "100%",

              background:
                "#000",

              position:
                "relative",
            }}
          >

            <div
              id={
                scannerId
              }

              style={{
                width:
                  "100%",

                height:
                  "100%",

                display:
                  cameraOn
                    ? "block"
                    : "none",
              }}
            />


            {/* CAMERA OFF */}

            {!cameraOn && (

              <button
                type="button"

                onClick={
                  startScanner
                }

                style={{
                  position:
                    "absolute",

                  inset:
                    0,

                  width:
                    "100%",

                  height:
                    "100%",

                  border:
                    "none",

                  background:
                    "transparent",

                  display:
                    "flex",

                  flexDirection:
                    "column",

                  alignItems:
                    "center",

                  justifyContent:
                    "center",

                  gap:
                    12,

                  cursor:
                    "pointer",

                  color:
                    "#cfcfcf",

                  WebkitTapHighlightColor:
                    "transparent",
                }}
              >

                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="34"
                  height="34"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >

                  <path
                    d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"
                  />

                  <circle
                    cx="12"
                    cy="13"
                    r="4"
                  />

                </svg>


                <div
                  style={{
                    fontSize:
                      13,

                    padding:
                      "0 24px",

                    textAlign:
                      "center",
                  }}
                >

                  Tap to scan the device barcode

                </div>

              </button>

            )}


            {/* CAMERA STARTING */}

            {cameraOn &&
              !cameraReady && (

              <div
                style={{
                  position:
                    "absolute",

                  inset:
                    0,

                  display:
                    "flex",

                  alignItems:
                    "center",

                  justifyContent:
                    "center",

                  color:
                    "#cfcfcf",

                  fontSize:
                    13,
                }}
              >

                Starting camera…

              </div>

            )}


            {/* CLOSE CAMERA */}

            {cameraOn && (

              <button
                type="button"

                onClick={
                  stopScanner
                }

                aria-label="Close camera"

                style={{
                  position:
                    "absolute",

                  top:
                    14,

                  right:
                    14,

                  width:
                    34,

                  height:
                    34,

                  borderRadius:
                    "50%",

                  border:
                    "none",

                  background:
                    "rgba(0,0,0,0.5)",

                  color:
                    "#fff",

                  display:
                    "flex",

                  alignItems:
                    "center",

                  justifyContent:
                    "center",

                  cursor:
                    "pointer",

                  fontSize:
                    18,
                }}
              >

                ×

              </button>

            )}


            {/* CAMERA ERROR */}

            {cameraError && (

              <div
                style={{
                  position:
                    "absolute",

                  bottom:
                    10,

                  left:
                    16,

                  right:
                    16,

                  textAlign:
                    "center",

                  color:
                    "#ff9a9a",

                  fontSize:
                    12,
                }}
              >

                {cameraError}

              </div>

            )}

          </div>


          {/* =================================================
              BOTTOM PANEL
          ================================================= */}

          <div
            style={{
              padding:
                "16px 20px calc(28px + env(safe-area-inset-bottom))",

              boxSizing:
                "border-box",
            }}
          >

            <input
              type="text"

              inputMode="text"

              placeholder="Scan or enter device code"

              value={
                imei
              }

              onChange={(e) => {

                // No numeric-only restriction.
                // No 15-character restriction.

                setImei(
                  e.target.value
                );

                setError("");
              }}

              style={{
                width:
                  "100%",

                padding:
                  "13px 16px",

                borderRadius:
                  8,

                border:
                  `1px solid ${P.amber}`,

                background:
                  "#FFFDF6",

                color:
                  P.textPrimary,

                fontSize:
                  14,

                fontFamily:
                  "'Inter', sans-serif",

                outline:
                  "none",

                boxSizing:
                  "border-box",

                marginBottom:
                  10,
              }}
            />


            <button
              type="button"

              onClick={
                handleOpenQuickAccess
              }

              disabled={
                loading
              }

              style={{
                width:
                  "100%",

                padding:
                  "15px 16px",

                border:
                  "none",

                borderRadius:
                  8,

                background:
                  "linear-gradient(180deg, #2F8FD1 0%, #1F6FB5 100%)",

                color:
                  P.textWhite,

                fontSize:
                  15,

                fontWeight:
                  700,

                letterSpacing:
                  0.6,

                textTransform:
                  "uppercase",

                fontFamily:
                  "'DM Sans', sans-serif",

                cursor:
                  loading
                    ? "not-allowed"
                    : "pointer",

                opacity:
                  loading
                    ? 0.7
                    : 1,
              }}
            >

              {loading
                ? "Opening..."
                : "Open Quick Access"}

            </button>


            <div
              style={{
                marginTop:
                  8,

                fontSize:
                  11,

                color:
                  "#d8d8d8",

                width:
                  "100%",

                textAlign:
                  "center",

                padding:
                  "0 16px",

                boxSizing:
                  "border-box",
              }}
            >

              Place a barcode inside the viewfinder rectangle to scan it.

            </div>


            {/* ERROR */}

            {error &&
              popup === null && (

              <div
                style={{
                  marginTop:
                    10,

                  padding:
                    "9px 14px",

                  borderRadius:
                    8,

                  background:
                    "#3a1414",

                  border:
                    "1px solid #5a2020",

                  color:
                    "#ff9a9a",

                  fontSize:
                    12,
                }}
              >

                {error}

              </div>

            )}

          </div>

        </div>


        {/* =================================================
            SELECT PRODUCT TYPE
        ================================================= */}

        {popup ===
          "productType" && (

          <PopupOverlay>

            <PopupCard
              title="Select Product Type"
            >

              {PRODUCT_TYPES.map(
                (type) => (

                  <PopupListItem
                    key={
                      type
                    }

                    onClick={() =>
                      handleSelectProductType(
                        type
                      )
                    }
                  >

                    {type}

                  </PopupListItem>

                )
              )}

            </PopupCard>

          </PopupOverlay>

        )}


        {/* =================================================
            SELECT GRID-TIE MODEL
        ================================================= */}

        {popup ===
          "model" && (

          <PopupOverlay>

            <PopupCard
              title="Select Model"
            >

              {GRID_TIE_MODELS.map(
                (m) => (

                  <PopupListItem
                    key={
                      m
                    }

                    onClick={() =>
                      handleSelectModel(
                        m
                      )
                    }
                  >

                    {m}

                  </PopupListItem>

                )
              )}

            </PopupCard>

          </PopupOverlay>

        )}


        {/* =================================================
            CONFIRM ADD
        ================================================= */}

        {popup ===
          "confirmAdd" && (

          <PopupOverlay>

            <PopupCard
              title="Add Device"
              subtitle="Do you want to add this device to your list?"
            >

              <div
                style={{
                  display:
                    "flex",

                  justifyContent:
                    "flex-end",

                  gap:
                    22,

                  marginTop:
                    18,
                }}
              >

                <PopupTextButton
                  onClick={
                    handleConfirmAddNo
                  }
                >

                  NO

                </PopupTextButton>


                <PopupTextButton
                  onClick={
                    handleConfirmAddYes
                  }

                  strong
                >

                  YES

                </PopupTextButton>

              </div>

            </PopupCard>

          </PopupOverlay>

        )}


        {/* =================================================
            ENTER DEVICE DETAILS
        ================================================= */}

        {popup ===
          "details" && (

          <PopupOverlay>

            <PopupCard
              title="Enter Device Details"
              subtitle="Nickname and Address"
            >

              <input
                type="text"

                placeholder="e.g. Main Roof Inverter"

                value={
                  nickname
                }

                onChange={(e) =>
                  setNickname(
                    e.target.value
                  )
                }

                style={
                  popupInputStyle
                }
              />


              <input
                type="text"

                placeholder="e.g. 123 Solar Street"

                value={
                  address
                }

                onChange={(e) =>
                  setAddress(
                    e.target.value
                  )
                }

                style={{
                  ...popupInputStyle,
                  marginBottom: 4,
                }}
              />


              {error && (

                <div
                  style={{
                    marginTop:
                      8,

                    fontSize:
                      12,

                    color:
                      P.textErrorMsg,
                  }}
                >

                  {error}

                </div>

              )}


              <div
                style={{
                  display:
                    "flex",

                  justifyContent:
                    "flex-end",

                  gap:
                    22,

                  marginTop:
                    18,
                }}
              >

                <PopupTextButton
                  onClick={
                    handleDetailsCancel
                  }

                  disabled={
                    loading
                  }
                >

                  CANCEL

                </PopupTextButton>


                <PopupTextButton
                  onClick={
                    handleDetailsSave
                  }

                  strong

                  disabled={
                    loading
                  }
                >

                  {loading
                    ? "ADDING..."
                    : "SAVE"}

                </PopupTextButton>

              </div>

            </PopupCard>

          </PopupOverlay>

        )}


        {/* =================================================
            BACK BUTTON
        ================================================= */}

        <div
          style={{
            position:
              "absolute",

            top:
              16,

            left:
              16,

            zIndex:
              10,
          }}
        >

          <button
            type="button"

            onClick={
              handleBack
            }

            style={{
              width:
                40,

              height:
                40,

              borderRadius:
                "50%",

              backgroundColor:
                "#fff",

              border:
                "none",

              display:
                "flex",

              alignItems:
                "center",

              justifyContent:
                "center",

              cursor:
                "pointer",

              fontSize:
                18,
            }}
          >

            ←

          </button>

        </div>


        {/* =================================================
            TOAST
        ================================================= */}

        {toast && (

          <div
            style={{
              position:
                "absolute",

              left:
                "50%",

              top:
                "46%",

              transform:
                "translate(-50%, -50%)",

              background:
                "rgba(40, 40, 40, 0.94)",

              color:
                "#fff",

              padding:
                "11px 20px",

              borderRadius:
                20,

              fontSize:
                13,

              fontFamily:
                "'Inter', sans-serif",

              whiteSpace:
                "nowrap",

              zIndex:
                4000,

              boxShadow:
                "0 4px 14px rgba(0, 0, 0, 0.3)",
            }}
          >

            {toast}

          </div>

        )}

      </div>

    </div>
  );
}


// =====================================================
// POPUP INPUT
// =====================================================

const popupInputStyle = {

  width:
    "100%",

  padding:
    "10px 2px",

  marginBottom:
    18,

  border:
    "none",

  borderBottom:
    `1px solid ${P.border}`,

  background:
    "transparent",

  fontSize:
    14,

  fontFamily:
    "'Inter', sans-serif",

  color:
    P.textPrimary,

  outline:
    "none",

  boxSizing:
    "border-box",
};


// =====================================================
// POPUP OVERLAY
// =====================================================

function PopupOverlay({
  children,
}) {

  return (

    <div
      style={{
        position:
          "absolute",

        inset:
          0,

        background:
          "rgba(0, 0, 0, 0.45)",

        display:
          "flex",

        alignItems:
          "center",

        justifyContent:
          "center",

        padding:
          "0 24px",

        zIndex:
          2000,

        boxSizing:
          "border-box",
      }}
    >

      {children}

    </div>
  );
}


// =====================================================
// POPUP CARD
// =====================================================

function PopupCard({
  title,
  subtitle,
  children,
}) {

  return (

    <div
      style={{
        width:
          "100%",

        maxWidth:
          360,

        background:
          "#FBEFDD",

        borderRadius:
          4,

        padding:
          "20px 22px",

        boxShadow:
          "0 12px 32px rgba(0, 0, 0, 0.35)",

        boxSizing:
          "border-box",
      }}
    >

      <div
        style={{
          fontSize:
            17,

          fontWeight:
            700,

          color:
            P.textPrimary,

          fontFamily:
            "'DM Sans', sans-serif",

          marginBottom:
            subtitle
              ? 4
              : 14,
        }}
      >

        {title}

      </div>


      {subtitle && (

        <div
          style={{
            fontSize:
              13,

            color:
              P.textSecond,

            fontFamily:
              "'Inter', sans-serif",

            marginBottom:
              16,
          }}
        >

          {subtitle}

        </div>

      )}


      {children}

    </div>
  );
}


// =====================================================
// POPUP LIST ITEM
// =====================================================

function PopupListItem({
  children,
  onClick,
}) {

  return (

    <button
      type="button"

      onClick={
        onClick
      }

      style={{
        display:
          "block",

        width:
          "100%",

        textAlign:
          "left",

        background:
          "none",

        border:
          "none",

        padding:
          "10px 0",

        fontSize:
          14,

        color:
          P.textPrimary,

        fontFamily:
          "'Inter', sans-serif",

        cursor:
          "pointer",

        WebkitTapHighlightColor:
          "transparent",
      }}
    >

      {children}

    </button>
  );
}


// =====================================================
// POPUP TEXT BUTTON
// =====================================================

function PopupTextButton({
  children,
  onClick,
  strong = false,
  disabled = false,
}) {

  return (

    <button
      type="button"

      onClick={
        onClick
      }

      disabled={
        disabled
      }

      style={{
        background:
          "none",

        border:
          "none",

        padding:
          "6px 4px",

        fontSize:
          13,

        fontWeight:
          700,

        letterSpacing:
          0.4,

        color:
          strong
            ? P.amberDark
            : P.textSecond,

        fontFamily:
          "'DM Sans', sans-serif",

        cursor:
          disabled
            ? "not-allowed"
            : "pointer",

        opacity:
          disabled
            ? 0.6
            : 1,

        WebkitTapHighlightColor:
          "transparent",
      }}
    >

      {children}

    </button>
  );
}