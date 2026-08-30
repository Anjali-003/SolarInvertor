// import { createContext, useContext, useEffect, useState } from "react";

// const InverterContext = createContext();


// export function InverterProvider({ children }) {
//   const [data, setData] = useState(null);
//   const [lastUpdated, setLastUpdated] = useState(null);
//   const [energy, setEnergy] = useState({
//     today: 0,
//     monthly: 0,
//     yearly: 0
// });

// const [energyCharts, setEnergyCharts] = useState({
//     today: [],
//     monthly: [],
//     yearly: []
// });

//   useEffect(() => {
//     const token = localStorage.getItem("token");

//     if (!token) {
//       console.log("No token found");
//       return;
//     }

//     const fetchLatest = async () => {
//       try {
//         const res = await fetch(
//           "http://localhost:3000/api/latest-message",
//           //VPSCHANGE
//           // "/api/latest-message", 
//           {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });

//         const latest = await res.json();

//         console.log("Initial Data:", latest);

//         const result = await response.json();

//         // ✅ IMPORTANT: store ONLY payload
//         setData(latest.payload);

//         // optional timestamp handling (only if exists)
//         // const fixedTimestamp =
//         //   latest.created_at?.replace("T", " ").split(".")[0];

//         // setLastUpdated(fixedTimestamp);
//         setLastUpdated(latest.created_at);

//         setEnergy(
//     result.energy || {
//         today: 0,
//         monthly: 0,
//         yearly: 0
//     }
// );

// setEnergyCharts(
//     result.charts || {
//         today: [],
//         monthly: [],
//         yearly: []
//     }
// );

//       } catch (err) {
//         console.log("Initial fetch error:", err);
//       }
//     };


// const fetchEnergy = async () => {

//     try {

//         const token =
//             localStorage.getItem("token");

//         if (!token) {
//             return;
//         }

//         const res = await fetch(
//             "http://localhost:3000/api/energy/summary",
//             {
//                 headers: {
//                     Authorization:
//                         `Bearer ${token}`
//                 }
//             }
//         );

//         const result =
//             await res.json();

//         if (!res.ok) {
//             console.log(
//                 "Energy API error:",
//                 result
//             );
//             return;
//         }

//         setEnergy(
//             result.energy
//         );

//     } catch (err) {

//         console.log(
//             "Energy fetch error:",
//             err
//         );
//     }
// };

//     // fetchLatest();

//     // const interval = setInterval(fetchLatest, 60000);

//     fetchLatest();
// fetchEnergy();

// const interval = setInterval(() => {

//     fetchLatest();
//     fetchEnergy();

// }, 60000);

//     return () => clearInterval(interval);
//   }, []);

//   return (
//     <InverterContext.Provider value={{
//       data,
//       setData,
//       lastUpdated,
//       setLastUpdated,
//            energy,
//             setEnergy,
//              energy,
//         energyCharts
//     }}>
//       {children}
//     </InverterContext.Provider>
//   );
// }

// export function useInverter() {
//   return useContext(InverterContext);
// }





// changes context for graphs 

// import {
//   createContext,
//   useContext,
//   useEffect,
//   useState
// } from "react";

// const InverterContext = createContext();


// export function InverterProvider({ children }) {

//   const [data, setData] = useState(null);

//   const [lastUpdated, setLastUpdated] =
//     useState(null);

//   const [energy, setEnergy] = useState({
//     today: 0,
//     monthly: 0,
//     yearly: 0
//   });

//   const [energyCharts, setEnergyCharts] =
//     useState({
//       today: [],
//       monthly: [],
//       yearly: []
//     });


//   useEffect(() => {

//     const token =
//       localStorage.getItem("token");

//     if (!token) {
//       console.log("No token found");
//       return;
//     }


//     // =====================================================
//     // FETCH LATEST INVERTER DATA
//     // =====================================================

//     const fetchLatest = async () => {

//       try {

//         const res = await fetch(
//           "http://localhost:3000/api/latest-message",
//           {
//             headers: {
//               Authorization:
//                 `Bearer ${token}`
//             }
//           }
//         );


//         const latest =
//           await res.json();


//         if (!res.ok) {

//           console.log(
//             "Latest API error:",
//             latest
//           );

//           return;
//         }


//         console.log(
//           "Initial Data:",
//           latest
//         );


//         // ================================================
//         // STORE ONLY PAYLOAD
//         // ================================================

//         setData(
//           latest.payload
//         );


//         // ================================================
//         // LAST UPDATED
//         // ================================================

//         setLastUpdated(
//           latest.created_at
//         );


//       } catch (err) {

//         console.log(
//           "Initial fetch error:",
//           err
//         );
//       }
//     };


//     // =====================================================
//     // FETCH ENERGY SUMMARY + CHART DATA
//     // =====================================================

//     const fetchEnergy = async () => {

//       try {

//         const res = await fetch(
//           "http://localhost:3000/api/energy/summary",
//           {
//             headers: {
//               Authorization:
//                 `Bearer ${token}`
//             }
//           }
//         );


//         const result =
//           await res.json();


//         if (!res.ok) {

//           console.log(
//             "Energy API error:",
//             result
//           );

//           return;
//         }


//         console.log(
//           "Energy Summary:",
//           result
//         );


//         // ================================================
//         // SUMMARY
//         // ================================================

//         setEnergy(
//           result.energy || {
//             today: 0,
//             monthly: 0,
//             yearly: 0
//           }
//         );


//         // ================================================
//         // CHART DATA
//         // ================================================

//         setEnergyCharts(
//           result.charts || {
//             today: [],
//             monthly: [],
//             yearly: []
//           }
//         );


//       } catch (err) {

//         console.log(
//           "Energy fetch error:",
//           err
//         );
//       }
//     };


//     // =====================================================
//     // INITIAL FETCH
//     // =====================================================

//     fetchLatest();

//     fetchEnergy();


//     // =====================================================
//     // REFRESH EVERY 60 SECONDS
//     // =====================================================

//     const interval =
//       setInterval(() => {

//         fetchLatest();

//         fetchEnergy();

//       }, 60000);


//     // =====================================================
//     // CLEANUP
//     // =====================================================

//     return () => {
//       clearInterval(interval);
//     };

//   }, []);


//   // =======================================================
//   // CONTEXT VALUE
//   // =======================================================

//   return (
//     <InverterContext.Provider
//       value={{
//         data,
//         setData,

//         lastUpdated,
//         setLastUpdated,

//         energy,
//         setEnergy,

//         energyCharts,
//         setEnergyCharts
//       }}
//     >
//       {children}
//     </InverterContext.Provider>
//   );
// }


// export function useInverter() {

//   return useContext(
//     InverterContext
//   );
// }



// changing the context again for the graph  

// import {
//     createContext,
//     useContext,
//     useEffect,
//     useState
// } from "react";

// const InverterContext =
//     createContext();

// export function InverterProvider({
//     children
// }) {

//     // const [data, setData] =
//     //     useState(null);

//     const [data, setData] = useState({});

//     const [lastUpdated, setLastUpdated] =
//         useState(null);

//     const [energy, setEnergy] =
//         useState({
//             today: 0,
//             monthly: 0,
//             yearly: 0
//         });

//     const [energyCharts, setEnergyCharts] =
//         useState({
//             today: [],
//             monthly: [],
//             yearly: []
//         });

//     useEffect(() => {

//         const token =
//             localStorage.getItem("token");

//         if (!token) {
//             console.log("No token found");
//             return;
//         }

//         // =====================================================
//         // FETCH LATEST INVERTER DATA
//         // =====================================================

//         const fetchLatest = async () => {

//             try {

//                 const res = await fetch(
//                     "http://localhost:3000/api/latest-message",
//                     {
//                         headers: {
//                             Authorization:
//                                 `Bearer ${token}`
//                         }
//                     }
//                 );

//                 const latest =
//                     await res.json();

//                 console.log(
//                     "Initial Data:",
//                     latest
//                 );

//                 if (!res.ok) {
//                     console.log(
//                         "Latest API error:",
//                         latest
//                     );
//                     return;
//                 }

//                 // Store ONLY payload
//                 setData(
//                     latest.payload
//                 );

//                 setLastUpdated(
//                     latest.created_at
//                 );

//             } catch (err) {

//                 console.log(
//                     "Initial fetch error:",
//                     err
//                 );
//             }
//         };

//         // =====================================================
//         // FETCH ENERGY
//         // =====================================================

//         const fetchEnergy = async () => {

//             try {

//                 const res = await fetch(
//                     "http://localhost:3000/api/energy/summary",
//                     {
//                         headers: {
//                             Authorization:
//                                 `Bearer ${token}`
//                         }
//                     }
//                 );

//                 const result =
//                     await res.json();

//                 if (!res.ok) {

//                     console.log(
//                         "Energy API error:",
//                         result
//                     );

//                     return;
//                 }

//                 setEnergy(
//                     result.energy || {
//                         today: 0,
//                         monthly: 0,
//                         yearly: 0
//                     }
//                 );

//                 setEnergyCharts(
//                     result.charts || {
//                         today: [],
//                         monthly: [],
//                         yearly: []
//                     }
//                 );

//             } catch (err) {

//                 console.log(
//                     "Energy fetch error:",
//                     err
//                 );
//             }
//         };

//         // =====================================================
//         // INITIAL LOAD
//         // =====================================================

//         fetchLatest();
//         fetchEnergy();

//         // =====================================================
//         // REFRESH EVERY 60 SECONDS
//         // =====================================================

//         const interval =
//             setInterval(() => {

//                 fetchLatest();
//                 fetchEnergy();

//             }, 60000);

//         return () =>
//             clearInterval(interval);

//     }, []);

//     return (
//         <InverterContext.Provider
//             value={{
//                 data,
//                 setData,

//                 lastUpdated,
//                 setLastUpdated,

//                 energy,
//                 setEnergy,

//                 energyCharts,
//                 setEnergyCharts
//             }}
//         >
//             {children}
//         </InverterContext.Provider>
//     );
// }

// export function useInverter() {

//     return useContext(
//         InverterContext
//     );
// }



// refersh button for graph 


// import {
//     createContext,
//     useContext,
//     useEffect,
//     useState,
//     useCallback
// } from "react";

// const InverterContext = createContext();

// export function InverterProvider({ children }) {

//     const [data, setData] = useState({});

//     const [lastUpdated, setLastUpdated] =
//         useState(null);

//     const [devices, setDevices] =
//         useState([]);

//     const [selectedDeviceId, setSelectedDeviceId] =
//         useState(null);

//     const [energy, setEnergy] =
//         useState({
//             today: 0,
//             monthly: 0,
//             yearly: 0
//         });

//     const [energyCharts, setEnergyCharts] =
//         useState({
//             today: [],
//             monthly: [],
//             yearly: []
//         });


//     const fetchDevices = useCallback(async () => {

//         const token = localStorage.getItem("token");

//         if (!token) {
//             setDevices([]);
//             setSelectedDeviceId(null);
//             return;
//         }

//         try {

//             const res = await fetch(
//                 "http://localhost:3000/api/user/devices",
//                 {
//                     headers: {
//                         Authorization: `Bearer ${token}`
//                     }
//                 }
//             );

//             const result = await res.json();

//             if (!res.ok) {

//                 console.log(
//                     "Devices API error:",
//                     result
//                 );

//                 setDevices([]);
//                 setSelectedDeviceId(null);

//                 return;
//             }

//             const userDevices =
//                 result.devices || [];

//             setDevices(userDevices);

//         } catch (err) {

//             console.log(
//                 "Device fetch error:",
//                 err
//             );

//             setDevices([]);

//         }

//     }, []);

//     useEffect(() => {

//         fetchDevices();

//     }, [fetchDevices]);

//     useEffect(() => {

//         if (devices.length === 0) {

//             setSelectedDeviceId(null);

//             return;
//         }

//         // If currently selected device still exists,
//         // keep it selected.

//         const selectedStillExists =
//             devices.some(
//                 device =>
//                     device.id === selectedDeviceId
//             );

//         if (!selectedStillExists) {

//             setSelectedDeviceId(
//                 devices[0].id
//             );
//         }

//     }, [devices, selectedDeviceId]);

//     // =====================================================
//     // FETCH ENERGY
//     // =====================================================

//     const fetchEnergy = useCallback(async () => {

//         if (!selectedDeviceId) {
//         setEnergy({
//             today: 0,
//             monthly: 0,
//             yearly: 0
//         });

//         return;
//     }

//         const token =
//             localStorage.getItem("token");

//         if (!token) {
//             console.log("No token found");
//             return;
//         }

//         try {

//             // const res = await fetch(
//             //     "http://localhost:3000/api/energy/summary",

//             const res = await fetch(
//     `http://localhost:3000/api/energy/summary?device_id=${selectedDeviceId}`,
//                 {
//                     headers: {
//                         Authorization:
//                             `Bearer ${token}`
//                     }
//                 }
//             );

//             const result =
//                 await res.json();

//             if (!res.ok) {

//                 console.log(
//                     "Energy API error:",
//                     result
//                 );

//                 return;
//             }

//             setEnergy(
//                 result.energy || {
//                     today: 0,
//                     monthly: 0,
//                     yearly: 0
//                 }
//             );

//             setEnergyCharts(
//                 result.charts || {
//                     today: [],
//                     monthly: [],
//                     yearly: []
//                 }
//             );

//         } catch (err) {

//             console.log(
//                 "Energy fetch error:",
//                 err
//             );
//         }

//     // }, []);
//     }, [selectedDeviceId]);


//     // =====================================================
//     // INITIAL LOAD
//     // =====================================================

//     // useEffect(() => {

//     //     const token =
//     //         localStorage.getItem("token");

//     //     if (!token) {
//     //         console.log("No token found");
//     //         return;
//     //     }


//     //     // =================================================
//     //     // FETCH LATEST INVERTER DATA
//     //     // =================================================

//     //     // const fetchLatest = async () => {

//     //     //     try {

//     //     //         const res = await fetch(
//     //     //             "http://localhost:3000/api/latest-message",
//     //     //             {
//     //     //                 headers: {
//     //     //                     Authorization:
//     //     //                         `Bearer ${token}`
//     //     //                 }
//     //     //             }
//     //     //         );

//     //     //         const latest =
//     //     //             await res.json();

//     //     //         console.log(
//     //     //             "Initial Data:",
//     //     //             latest
//     //     //         );

//     //     //         if (!res.ok) {

//     //     //             console.log(
//     //     //                 "Latest API error:",
//     //     //                 latest
//     //     //             );

//     //     //             return;
//     //     //         }

//     //     //         setData(
//     //     //             latest.payload
//     //     //         );

//     //     //         setLastUpdated(
//     //     //             latest.created_at
//     //     //         );

//     //     //     } catch (err) {

//     //     //         console.log(
//     //     //             "Initial fetch error:",
//     //     //             err
//     //     //         );
//     //     //     }
//     //     // };


//     //     const fetchLatest = async () => {

//     //         if (!selectedDeviceId) {
//     //             console.log("No device selected");
//     //             return;
//     //         }

//     //         try {

//     //             const res = await fetch(
//     //                 `http://localhost:3000/api/latest-message?device_id=${selectedDeviceId}`,
//     //                 {
//     //                     headers: {
//     //                         Authorization:
//     //                             `Bearer ${token}`
//     //                     }
//     //                 }
//     //             );

//     //             const latest =
//     //                 await res.json();

//     //             console.log(
//     //                 "Latest device data:",
//     //                 latest
//     //             );

//     //             if (!res.ok) {

//     //                 console.log(
//     //                     "Latest API error:",
//     //                     latest
//     //                 );

//     //                 return;
//     //             }

//     //             setData(
//     //                 latest.payload
//     //             );

//     //             setLastUpdated(
//     //                 latest.created_at
//     //             );

//     //         } catch (err) {

//     //             console.log(
//     //                 "Latest fetch error:",
//     //                 err
//     //             );
//     //         }
//     //     };


//     //     fetchLatest();
//     //     fetchEnergy();


//     //     // =================================================
//     //     // AUTOMATIC REFRESH
//     //     // =================================================

//     //     const interval =
//     //         setInterval(() => {

//     //             fetchLatest();
//     //             fetchEnergy();

//     //         }, 60000);


//     //     return () =>
//     //         clearInterval(interval);

//     //     // }, [fetchEnergy]);

//     // }, [fetchDevices, fetchEnergy]);


//     useEffect(() => {

//     if (!selectedDeviceId) {
//         setData({});
//         setLastUpdated(null);
//         return;
//     }

//     const fetchLatest = async () => {

//         const token =
//             localStorage.getItem("token");

//         if (!token) {
//             return;
//         }

//         try {

//             const res = await fetch(
//                 `http://localhost:3000/api/latest-message?device_id=${selectedDeviceId}`,
//                 {
//                     headers: {
//                         Authorization:
//                             `Bearer ${token}`
//                     }
//                 }
//             );

//             const result =
//                 await res.json();

//             if (!res.ok) {

//                 console.log(
//                     "Latest API error:",
//                     result
//                 );

//                 return;
//             }

//             setData(result.payload);
//             setLastUpdated(result.created_at);

//         } catch (err) {

//             console.log(
//                 "Latest fetch error:",
//                 err
//             );
//         }
//     };


//     fetchLatest();

//     const interval =
//         setInterval(
//             fetchLatest,
//             60000
//         );

//     return () =>
//         clearInterval(interval);

// }, [selectedDeviceId]);


// useEffect(() => {

//     if (!selectedDeviceId) {
//         return;
//     }

//     fetchEnergy();

//     const interval =
//         setInterval(
//             fetchEnergy,
//             60000
//         );

//     return () =>
//         clearInterval(interval);

// }, [selectedDeviceId, fetchEnergy]);

//     return (
//         <InverterContext.Provider
//             value={{
//                 data,
//                 setData,

//                 lastUpdated,
//                 setLastUpdated,

//                 energy,
//                 setEnergy,

//                 energyCharts,
//                 setEnergyCharts,

//                 devices,
//                 setDevices,

//                 selectedDeviceId,
//                 setSelectedDeviceId,

//                 // IMPORTANT
//                     refreshDevices: fetchDevices,

//                 refreshEnergy: fetchEnergy
//             }}
//         >
//             {children}
//         </InverterContext.Provider>
//     );
// }


// export function useInverter() {

//     return useContext(
//         InverterContext
//     );
// }







// import {
//     createContext,
//     useContext,
//     useEffect,
//     useState,
//     useCallback,
// } from "react";

// const VendorDeviceContext = createContext(null);

// export function VendorDeviceProvider({ children }) {
//     const [selectedDevice, setSelectedDevice] = useState(null);

//     const [data, setData] = useState(null);

//     const [lastUpdated, setLastUpdated] = useState(null);

//     const [loading, setLoading] = useState(false);

//     const [error, setError] = useState(null);

//     /*
//      * ============================================================
//      * FETCH LATEST DEVICE DATA
//      * ============================================================
//      */
//     const fetchLatest = useCallback(async () => {
//         if (!selectedDevice?.id) {
//             setData(null);
//             setLastUpdated(null);
//             return;
//         }

//         const token = localStorage.getItem("vendorToken");

//         if (!token) {
//             setError("Vendor authentication token not found");
//             return;
//         }

//         try {
//             setLoading(true);
//             setError(null);

//             const res = await fetch(
//                 `http://localhost:3000/api/vendor/devices/${selectedDevice.id}/latest`,
//                 // VPSCHANGE
//                 // `/api/vendor/devices/${selectedDevice.id}/latest`,
//                 {
//                     headers: {
//                         Authorization: `Bearer ${token}`,
//                     },
//                 }
//             );

//             const json = await res.json();

//             if (!res.ok) {
//                 throw new Error(
//                     json?.message ||
//                     "Failed to fetch latest device data"
//                 );
//             }

//             /*
//              * ----------------------------------------------------
//              * STORE DEVICE DATA
//              * ----------------------------------------------------
//              */
//             setData(json);

//             /*
//              * ----------------------------------------------------
//              * STORE DEVICE TIMESTAMP
//              *
//              * IMPORTANT:
//              * Use the timestamp coming from the device/API.
//              *
//              * Do NOT use:
//              * new Date().toISOString()
//              *
//              * because that would represent the frontend polling
//              * time instead of the actual device message time.
//              * ----------------------------------------------------
//              */
//             let timestamp = json?.TIMESTAMP ?? null;

//             /*
//              * If the API returns:
//              *
//              * 2026-08-12T070336
//              *
//              * convert it to:
//              *
//              * 2026-08-12 07:03:36
//              */
//             if (timestamp) {
//                 timestamp = timestamp.replace(
//                     /^(\d{4}-\d{2}-\d{2})T?(\d{2})(\d{2})(\d{2})$/,
//                     "$1 $2:$3:$4"
//                 );
//             }

//             setLastUpdated(timestamp);

//         } catch (err) {
//             console.error(
//                 "Vendor latest device fetch failed:",
//                 err
//             );

//             setError(
//                 err?.message ||
//                 "Failed to fetch device data"
//             );

//         } finally {
//             setLoading(false);
//         }
//     }, [selectedDevice]);

//     /*
//      * ============================================================
//      * FETCH WHEN DEVICE CHANGES
//      * ============================================================
//      */
//     useEffect(() => {
//         if (!selectedDevice?.id) {
//             setData(null);
//             setLastUpdated(null);
//             setError(null);
//             setLoading(false);

//             return;
//         }

//         /*
//          * Initial fetch
//          */
//         fetchLatest();ca

//         /*
//          * Poll every 60 seconds
//          */
//         const interval = setInterval(() => {
//             fetchLatest();
//         }, 60000);

//         /*
//          * Cleanup
//          */
//         return () => {
//             clearInterval(interval);
//         };

//     }, [selectedDevice, fetchLatest]);

//     /*
//      * ============================================================
//      * HANDLE DEVICE CHANGE
//      * ============================================================
//      */
//     const handleSetSelectedDevice = useCallback((device) => {
//         setSelectedDevice(device);

//         /*
//          * Clear old device data immediately.
//          *
//          * This prevents the previous inverter's data from
//          * temporarily appearing while the new device is loading.
//          */
//         setData(null);
//         setLastUpdated(null);
//         setError(null);
//     }, []);

//     /*
//      * ============================================================
//      * CONTEXT VALUE
//      * ============================================================
//      */
//     const value = {
//         /*
//          * Selected device
//          */
//         selectedDevice,
//         setSelectedDevice: handleSetSelectedDevice,

//         /*
//          * Latest device data
//          */
//         data,
//         setData,

//         /*
//          * Timestamp from device/API
//          */
//         lastUpdated,
//         setLastUpdated,

//         /*
//          * Loading / error state
//          */
//         loading,
//         error,

//         /*
//          * Manual refresh
//          */
//         refresh: fetchLatest,
//     };

//     return (
//         <VendorDeviceContext.Provider value={value}>
//             {children}
//         </VendorDeviceContext.Provider>
//     );
// }

// /*
//  * ================================================================
//  * CONSUMER HOOK
//  * ================================================================
//  */
// export function useVendorDevice() {
//     const context = useContext(VendorDeviceContext);

//     if (!context) {
//         throw new Error(
//             "useVendorDevice must be used inside VendorDeviceProvider"
//         );
//     }

//     return context;
// }












// import {
//     createContext,
//     useContext,
//     useEffect,
//     useState,
//     useCallback
// } from "react";

// const InverterContext = createContext();

// const API_BASE = "http://localhost:3000";

// export function InverterProvider({ children }) {

//     // =====================================================
//     // DEVICE / INVERTER DATA
//     // =====================================================

//     const [data, setData] = useState({});

//     const [lastUpdated, setLastUpdated] =
//         useState(null);

//     // =====================================================
//     // DEVICES
//     // =====================================================

//     const [devices, setDevices] =
//         useState([]);

//     const [selectedDeviceId, setSelectedDeviceId] =
//         useState(null);

//     // =====================================================
//     // ENERGY
//     // =====================================================

//     const [energy, setEnergy] =
//         useState({
//             today: 0,
//             monthly: 0,
//             yearly: 0
//         });

//     const [energyCharts, setEnergyCharts] =
//         useState({
//             today: [],
//             monthly: [],
//             yearly: []
//         });


//     // =====================================================
//     // FETCH USER DEVICES
//     // =====================================================

//     const fetchDevices = useCallback(async () => {

//         const token =
//             localStorage.getItem("token");

//         // No authentication
//         if (!token) {

//             setDevices([]);
//             setSelectedDeviceId(null);

//             return;
//         }

//         try {

//             const res = await fetch(
//                 `${API_BASE}/api/user/devices`,
//                 {
//                     method: "GET",

//                     headers: {
//                         Authorization:
//                             `Bearer ${token}`
//                     }
//                 }
//             );

//             const result =
//                 await res.json();

//             if (!res.ok) {

//                 console.error(
//                     "Devices API error:",
//                     result
//                 );

//                 setDevices([]);
//                 setSelectedDeviceId(null);

//                 return;
//             }

//             const userDevices =
//                 Array.isArray(result.devices)
//                     ? result.devices
//                     : [];

//             setDevices(userDevices);

//         } catch (err) {

//             console.error(
//                 "Device fetch error:",
//                 err
//             );

//             setDevices([]);

//         }

//     }, []);


//     // =====================================================
//     // LOAD DEVICES WHEN PROVIDER STARTS
//     // =====================================================

//     useEffect(() => {

//         fetchDevices();

//     }, [fetchDevices]);


//     // =====================================================
//     // KEEP SELECTED DEVICE VALID
//     // =====================================================

//     useEffect(() => {

//         // User has no devices
//         if (devices.length === 0) {

//             setSelectedDeviceId(null);

//             return;
//         }


//         // Check whether currently selected
//         // device still exists in the user's list

//         const selectedStillExists =
//             devices.some(
//                 device =>
//                     device.id === selectedDeviceId
//             );


//         // If selected device no longer exists,
//         // automatically select the first device

//         if (!selectedStillExists) {

//             setSelectedDeviceId(
//                 devices[0].id
//             );
//         }

//     }, [
//         devices,
//         selectedDeviceId
//     ]);


//     // =====================================================
//     // FETCH LATEST DEVICE DATA
//     // =====================================================

//     const fetchLatest = useCallback(async () => {

//         // No device selected
//         if (!selectedDeviceId) {

//             setData({});
//             setLastUpdated(null);

//             return;
//         }


//         const token =
//             localStorage.getItem("token");

//         if (!token) {

//             setData({});
//             setLastUpdated(null);

//             return;
//         }


//         try {

//             const res = await fetch(
//                 `${API_BASE}/api/latest-message?device_id=${selectedDeviceId}`,
//                 {
//                     method: "GET",

//                     headers: {
//                         Authorization:
//                             `Bearer ${token}`
//                     }
//                 }
//             );


//             const result =
//                 await res.json();


//             if (!res.ok) {

//                 console.error(
//                     "Latest API error:",
//                     result
//                 );

//                 return;
//             }


//             setData(
//                 result.payload || {}
//             );

//             setLastUpdated(
//                 result.created_at || null
//             );

//         } catch (err) {

//             console.error(
//                 "Latest fetch error:",
//                 err
//             );
//         }

//     }, [
//         selectedDeviceId
//     ]);


//     // =====================================================
//     // FETCH ENERGY SUMMARY
//     // =====================================================

//     const fetchEnergy = useCallback(async () => {

//         // No device selected
//         if (!selectedDeviceId) {

//             setEnergy({
//                 today: 0,
//                 monthly: 0,
//                 yearly: 0
//             });

//             setEnergyCharts({
//                 today: [],
//                 monthly: [],
//                 yearly: []
//             });

//             return;
//         }


//         const token =
//             localStorage.getItem("token");

//         if (!token) {

//             return;
//         }


//         try {

//             const res = await fetch(
//                 `${API_BASE}/api/energy/summary?device_id=${selectedDeviceId}`,
//                 {
//                     method: "GET",

//                     headers: {
//                         Authorization:
//                             `Bearer ${token}`
//                     }
//                 }
//             );


//             const result =
//                 await res.json();


//             if (!res.ok) {

//                 console.error(
//                     "Energy API error:",
//                     result
//                 );

//                 return;
//             }


//             setEnergy(
//                 result.energy || {
//                     today: 0,
//                     monthly: 0,
//                     yearly: 0
//                 }
//             );


//             setEnergyCharts(
//                 result.charts || {
//                     today: [],
//                     monthly: [],
//                     yearly: []
//                 }
//             );

//         } catch (err) {

//             console.error(
//                 "Energy fetch error:",
//                 err
//             );
//         }

//     }, [
//         selectedDeviceId
//     ]);


//     // =====================================================
//     // LOAD LATEST DATA WHEN DEVICE CHANGES
//     // =====================================================

//     useEffect(() => {

//         if (!selectedDeviceId) {

//             setData({});
//             setLastUpdated(null);

//             return;
//         }


//         // Fetch immediately
//         fetchLatest();


//         // Refresh every 60 seconds
//         const interval =
//             setInterval(
//                 fetchLatest,
//                 60000
//             );


//         return () =>
//             clearInterval(interval);

//     }, [
//         selectedDeviceId,
//         fetchLatest
//     ]);


//     useEffect(() => {

//     console.log(
//         "ACTIVE DEVICE CHANGED:",
//         selectedDeviceId
//     );

// }, [selectedDeviceId]);


//     // =====================================================
//     // LOAD ENERGY WHEN DEVICE CHANGES
//     // =====================================================

//     useEffect(() => {

//         if (!selectedDeviceId) {

//             setEnergy({
//                 today: 0,
//                 monthly: 0,
//                 yearly: 0
//             });

//             setEnergyCharts({
//                 today: [],
//                 monthly: [],
//                 yearly: []
//             });

//             return;
//         }


//         // Fetch immediately
//         fetchEnergy();


//         // Refresh every 60 seconds
//         const interval =
//             setInterval(
//                 fetchEnergy,
//                 60000
//             );


//         return () =>
//             clearInterval(interval);

//     }, [
//         selectedDeviceId,
//         fetchEnergy
//     ]);


//     // =====================================================
//     // CONTEXT
//     // =====================================================

//     return (
//         <InverterContext.Provider
//             value={{

//                 // -----------------------------
//                 // Latest inverter data
//                 // -----------------------------

//                 data,
//                 setData,

//                 lastUpdated,
//                 setLastUpdated,


//                 // -----------------------------
//                 // Energy
//                 // -----------------------------

//                 energy,
//                 setEnergy,

//                 energyCharts,
//                 setEnergyCharts,


//                 // -----------------------------
//                 // Devices
//                 // -----------------------------

//                 devices,
//                 setDevices,

//                 selectedDeviceId,
//                 setSelectedDeviceId,


//                 // -----------------------------
//                 // Refresh functions
//                 // -----------------------------

//                 refreshDevices:
//                     fetchDevices,

//                 refreshLatest:
//                     fetchLatest,

//                 refreshEnergy:
//                     fetchEnergy
//             }}
//         >
//             {children}
//         </InverterContext.Provider>
//     );
// }


// // =====================================================
// // HOOK
// // =====================================================

// export function useInverter() {

//     return useContext(
//         InverterContext
//     );
// }







// import {
//     createContext,
//     useContext,
//     useEffect,
//     useState,
//     useCallback
// } from "react";

// const InverterContext = createContext();

// const API_BASE = "http://localhost:3000";

// const EMPTY_ENERGY = {
//     today: 0,
//     monthly: 0,
//     yearly: 0
// };

// const EMPTY_CHARTS = {
//     today: [],
//     monthly: [],
//     yearly: []
// };

// export function InverterProvider({ children }) {

//     // =====================================================
//     // CURRENT DEVICE DATA
//     // =====================================================

//     const [data, setData] = useState({});
//     const [lastUpdated, setLastUpdated] = useState(null);

//     // =====================================================
//     // DEVICES
//     // =====================================================

//     const [devices, setDevices] = useState([]);
//     const [selectedDeviceId, setSelectedDeviceId] = useState(null);

//     // =====================================================
//     // ENERGY
//     // =====================================================

//     const [energy, setEnergy] =
//         useState(EMPTY_ENERGY);

//     const [energyCharts, setEnergyCharts] =
//         useState(EMPTY_CHARTS);


//     // =====================================================
//     // FETCH USER DEVICES
//     // =====================================================

//     const fetchDevices = useCallback(async () => {

//         const token =
//             localStorage.getItem("token");

//         if (!token) {

//             setDevices([]);
//             setSelectedDeviceId(null);

//             return;
//         }

//         try {

//             const res = await fetch(
//                 `${API_BASE}/api/user/devices`,
//                 {
//                     method: "GET",

//                     headers: {
//                         Authorization:
//                             `Bearer ${token}`
//                     }
//                 }
//             );

//             const result =
//                 await res.json();

//             if (!res.ok) {

//                 console.error(
//                     "Devices API error:",
//                     result
//                 );

//                 setDevices([]);
//                 setSelectedDeviceId(null);

//                 return;
//             }

//             const userDevices =
//                 Array.isArray(result.devices)
//                     ? result.devices
//                     : [];

//             setDevices(userDevices);

//         } catch (err) {

//             console.error(
//                 "Device fetch error:",
//                 err
//             );

//             setDevices([]);

//         }

//     }, []);


//     // =====================================================
//     // LOAD DEVICES ON LOGIN / APP START
//     // =====================================================

//     useEffect(() => {

//         fetchDevices();

//     }, [fetchDevices]);


//     // =====================================================
//     // KEEP SELECTED DEVICE VALID
//     // =====================================================

//     useEffect(() => {

//         if (devices.length === 0) {

//             setSelectedDeviceId(null);

//             return;
//         }

//         const selectedStillExists =
//             devices.some(
//                 device =>
//                     Number(device.id) ===
//                     Number(selectedDeviceId)
//             );

//         if (!selectedStillExists) {

//             setSelectedDeviceId(
//                 devices[0].id
//             );
//         }

//     }, [
//         devices,
//         selectedDeviceId
//     ]);


//     // =====================================================
//     // FETCH LATEST DATA
//     // =====================================================

//     const fetchLatest = useCallback(async () => {

//         if (selectedDeviceId == null) {

//             setData({});
//             setLastUpdated(null);

//             return;
//         }

//         const token =
//             localStorage.getItem("token");

//         if (!token) {

//             setData({});
//             setLastUpdated(null);

//             return;
//         }

//         try {

//             const res = await fetch(
//                 `${API_BASE}/api/latest-message?device_id=${selectedDeviceId}`,
//                 {
//                     method: "GET",

//                     headers: {
//                         Authorization:
//                             `Bearer ${token}`
//                     }
//                 }
//             );

//             const result =
//                 await res.json();

//             if (!res.ok) {

//                 console.error(
//                     "Latest API error:",
//                     result
//                 );

//                 // IMPORTANT:
//                 // Don't leave previous device data
//                 // on the screen if new request fails.

//                 setData({});
//                 setLastUpdated(null);

//                 return;
//             }

//             setData(
//                 result.payload || {}
//             );

//             setLastUpdated(
//                 result.created_at || null
//             );

//         } catch (err) {

//             console.error(
//                 "Latest fetch error:",
//                 err
//             );

//             setData({});
//             setLastUpdated(null);
//         }

//     }, [
//         selectedDeviceId
//     ]);


//     // =====================================================
//     // FETCH ENERGY
//     // =====================================================

//     const fetchEnergy = useCallback(async () => {

//         if (selectedDeviceId == null) {

//             setEnergy({
//                 ...EMPTY_ENERGY
//             });

//             setEnergyCharts({
//                 ...EMPTY_CHARTS
//             });

//             return;
//         }

//         const token =
//             localStorage.getItem("token");

//         if (!token) {

//             setEnergy({
//                 ...EMPTY_ENERGY
//             });

//             setEnergyCharts({
//                 ...EMPTY_CHARTS
//             });

//             return;
//         }

//         try {

//             const res = await fetch(
//                 `${API_BASE}/api/energy/summary?device_id=${selectedDeviceId}`,
//                 {
//                     method: "GET",

//                     headers: {
//                         Authorization:
//                             `Bearer ${token}`
//                     }
//                 }
//             );

//             const result =
//                 await res.json();

//             if (!res.ok) {

//                 console.error(
//                     "Energy API error:",
//                     result
//                 );

//                 setEnergy({
//                     ...EMPTY_ENERGY
//                 });

//                 setEnergyCharts({
//                     ...EMPTY_CHARTS
//                 });

//                 return;
//             }

//             setEnergy(
//                 result.energy || {
//                     ...EMPTY_ENERGY
//                 }
//             );

//             setEnergyCharts(
//                 result.charts || {
//                     ...EMPTY_CHARTS
//                 }
//             );

//         } catch (err) {

//             console.error(
//                 "Energy fetch error:",
//                 err
//             );

//             setEnergy({
//                 ...EMPTY_ENERGY
//             });

//             setEnergyCharts({
//                 ...EMPTY_CHARTS
//             });
//         }

//     }, [
//         selectedDeviceId
//     ]);


//     // =====================================================
//     // DEVICE SWITCH
//     // =====================================================

//     useEffect(() => {

//         if (selectedDeviceId == null) {

//             setData({});
//             setLastUpdated(null);

//             setEnergy({
//                 ...EMPTY_ENERGY
//             });

//             setEnergyCharts({
//                 ...EMPTY_CHARTS
//             });

//             return;
//         }


//         // -------------------------------------------------
//         // VERY IMPORTANT
//         // Clear the previous device immediately.
//         // -------------------------------------------------

//         setData({});
//         setLastUpdated(null);

//         setEnergy({
//             ...EMPTY_ENERGY
//         });

//         setEnergyCharts({
//             ...EMPTY_CHARTS
//         });


//         // -------------------------------------------------
//         // Fetch new device data
//         // -------------------------------------------------

//         fetchLatest();
//         fetchEnergy();


//         // -------------------------------------------------
//         // Auto refresh
//         // -------------------------------------------------

//         const interval =
//             setInterval(() => {

//                 fetchLatest();
//                 fetchEnergy();

//             }, 60000);


//         return () =>
//             clearInterval(interval);

//     }, [
//         selectedDeviceId,
//         fetchLatest,
//         fetchEnergy
//     ]);


//     // =====================================================
//     // DEBUG
//     // =====================================================

//     useEffect(() => {

//         console.log(
//             "ACTIVE DEVICE:",
//             selectedDeviceId
//         );

//     }, [
//         selectedDeviceId
//     ]);



//     const refreshAll = useCallback(async () => {
//     await Promise.all([
//         fetchLatest(),
//         fetchEnergy(),
//     ]);
// }, [fetchLatest, fetchEnergy]);

//     // =====================================================
//     // CONTEXT
//     // =====================================================

//     return (
//         <InverterContext.Provider
//             value={{

//                 // -----------------------------
//                 // Device data
//                 // -----------------------------

//                 data,
//                 setData,

//                 lastUpdated,
//                 setLastUpdated,


//                 // -----------------------------
//                 // Energy
//                 // -----------------------------

//                 energy,
//                 setEnergy,

//                 energyCharts,
//                 setEnergyCharts,


//                 // -----------------------------
//                 // Devices
//                 // -----------------------------

//                 devices,
//                 setDevices,

//                 selectedDeviceId,
//                 setSelectedDeviceId,


//                 // -----------------------------
//                 // Refresh functions
//                 // -----------------------------

//                 refreshDevices:
//                     fetchDevices,

//                 refreshLatest:
//                     fetchLatest,

//                 refreshEnergy:
//                     fetchEnergy,
                
//                 refreshAll,


//             }}
//         >
//             {children}
//         </InverterContext.Provider>
//     );
// }


// // =====================================================
// // HOOK
// // =====================================================

// export function useInverter() {

//     return useContext(
//         InverterContext
//     );
// }





import {
    createContext,
    useContext,
    useEffect,
    useState,
    useCallback,
} from "react";

const InverterContext = createContext();
//VPSCHANGE
// const API_BASE = "http://localhost:3000";
const API_BASE = "http://192.168.1.29:3000";


const EMPTY_ENERGY = {
    today: 0,
    monthly: 0,
    yearly: 0,
};

const EMPTY_CHARTS = {
    today: [],
    monthly: [],
    yearly: [],
};

export function InverterProvider({ children }) {

    // =====================================================
    // CURRENT DEVICE DATA
    // =====================================================

    const [data, setData] = useState({});
    const [lastUpdated, setLastUpdated] = useState(null);

    // =====================================================
    // DEVICES
    // =====================================================

    const [devices, setDevices] = useState([]);

    const [selectedDeviceId, setSelectedDeviceId] = useState(() => {

        const saved =
            localStorage.getItem("selectedDeviceId");

        return saved
            ? Number(saved)
            : null;
    });

    // =====================================================
    // ENERGY
    // =====================================================

    const [energy, setEnergy] =
        useState(EMPTY_ENERGY);

    const [energyCharts, setEnergyCharts] =
        useState(EMPTY_CHARTS);


    // =====================================================
    // SELECT DEVICE
    // =====================================================

    const selectDevice = useCallback((deviceId) => {

        if (deviceId == null) {
            return;
        }

        const id = Number(deviceId);

        setSelectedDeviceId(id);

        localStorage.setItem(
            "selectedDeviceId",
            String(id)
        );

    }, []);


    // =====================================================
    // FETCH USER DEVICES
    // =====================================================

    const fetchDevices = useCallback(async () => {

        const token =
            localStorage.getItem("token");

        if (!token) {

            setDevices([]);

            return;
        }

        try {

            const res = await fetch(
                //VPSCHANGE
                `${API_BASE}/api/user/devices`,
                                // `/api/user/devices`,

                {
                    method: "GET",

                    headers: {
                        Authorization:
                            `Bearer ${token}`,
                    },
                }
            );

            const result =
                await res.json();

            if (!res.ok) {

                console.error(
                    "Devices API error:",
                    result
                );

                setDevices([]);

                return;
            }

            const userDevices =
                Array.isArray(result.devices)
                    ? result.devices
                    : [];

            setDevices(userDevices);

        } catch (err) {

            console.error(
                "Device fetch error:",
                err
            );

            setDevices([]);

        }

    }, []);


    // =====================================================
    // LOAD DEVICES ON APP START
    // =====================================================

    useEffect(() => {

        fetchDevices();

    }, [fetchDevices]);


    // =====================================================
    // RESTORE SELECTED DEVICE
    // =====================================================

    useEffect(() => {

        if (devices.length === 0) {
            return;
        }

        // -----------------------------------------------
        // Check if saved device still exists
        // -----------------------------------------------

        const savedDeviceExists =
            selectedDeviceId != null &&
            devices.some(
                device =>
                    Number(device.id) ===
                    Number(selectedDeviceId)
            );

        // -----------------------------------------------
        // Saved device exists → KEEP IT
        // -----------------------------------------------

        if (savedDeviceExists) {
            return;
        }

        // -----------------------------------------------
        // No valid saved device
        // Select first device ONLY in this case
        // -----------------------------------------------

        const firstDeviceId =
            Number(devices[0].id);

        setSelectedDeviceId(
            firstDeviceId
        );

        localStorage.setItem(
            "selectedDeviceId",
            String(firstDeviceId)
        );

    }, [
        devices,
        selectedDeviceId
    ]);


    // =====================================================
    // FETCH LATEST DATA
    // =====================================================

    const fetchLatest = useCallback(async () => {

        if (selectedDeviceId == null) {

            setData({});
            setLastUpdated(null);

            return;
        }

        const token =
            localStorage.getItem("token");

        if (!token) {

            setData({});
            setLastUpdated(null);

            return;
        }

        try {

            const res = await fetch(
                //VPSCHANGE
                `${API_BASE}/api/latest-message?device_id=${selectedDeviceId}`,
                                // `/api/latest-message?device_id=${selectedDeviceId}`,

                {
                    method: "GET",

                    headers: {
                        Authorization:
                            `Bearer ${token}`,
                    },
                }
            );

            const result =
                await res.json();

            if (!res.ok) {

                console.error(
                    "Latest API error:",
                    result
                );

                setData({});
                setLastUpdated(null);

                return;
            }

            const payload = result.payload || {};

const lkwh = Number(payload.LKWH) || 0;
const lkwl = Number(payload.LKWL) || 0;

const combinedLKWH =
    (((lkwh & 0xFFFF) << 16) | (lkwl & 0xFFFF)) >>> 0;

setData({
    ...payload,
    LKWH: combinedLKWH,
});

            // setData(
            //     result.payload || {}
            // );

            setLastUpdated(
                result.created_at || null
            );

        } catch (err) {

            console.error(
                "Latest fetch error:",
                err
            );

            setData({});
            setLastUpdated(null);
        }

    }, [
        selectedDeviceId
    ]);


    // =====================================================
    // FETCH ENERGY
    // =====================================================

    const fetchEnergy = useCallback(async () => {

        if (selectedDeviceId == null) {

            setEnergy({
                ...EMPTY_ENERGY
            });

            setEnergyCharts({
                ...EMPTY_CHARTS
            });

            return;
        }

        const token =
            localStorage.getItem("token");

        if (!token) {

            setEnergy({
                ...EMPTY_ENERGY
            });

            setEnergyCharts({
                ...EMPTY_CHARTS
            });

            return;
        }

        try {

            const res = await fetch(
                //VPSCHANGE
                `${API_BASE}/api/energy/summary?device_id=${selectedDeviceId}`,
                                // `/api/energy/summary?device_id=${selectedDeviceId}`,

                {
                    method: "GET",

                    headers: {
                        Authorization:
                            `Bearer ${token}`,
                    },
                }
            );

            const result =
                await res.json();

            if (!res.ok) {

                console.error(
                    "Energy API error:",
                    result
                );

                setEnergy({
                    ...EMPTY_ENERGY
                });

                setEnergyCharts({
                    ...EMPTY_CHARTS
                });

                return;
            }

            setEnergy(
                result.energy || {
                    ...EMPTY_ENERGY
                }
            );

            setEnergyCharts(
                result.charts || {
                    ...EMPTY_CHARTS
                }
            );

        } catch (err) {

            console.error(
                "Energy fetch error:",
                err
            );

            setEnergy({
                ...EMPTY_ENERGY
            });

            setEnergyCharts({
                ...EMPTY_CHARTS
            });
        }

    }, [
        selectedDeviceId
    ]);


    // =====================================================
    // DEVICE DATA REFRESH
    // =====================================================

    useEffect(() => {

        if (selectedDeviceId == null) {

            setData({});
            setLastUpdated(null);

            setEnergy({
                ...EMPTY_ENERGY
            });

            setEnergyCharts({
                ...EMPTY_CHARTS
            });

            return;
        }

        // Clear old device data
        setData({});
        setLastUpdated(null);

        setEnergy({
            ...EMPTY_ENERGY
        });

        setEnergyCharts({
            ...EMPTY_CHARTS
        });

        // Initial fetch
        fetchLatest();
        fetchEnergy();

        // Auto refresh every 60 seconds
        const interval =
            setInterval(() => {

                fetchLatest();
                fetchEnergy();

            }, 60000);

        return () =>
            clearInterval(interval);

    }, [
        selectedDeviceId,
        fetchLatest,
        fetchEnergy
    ]);


    // =====================================================
    // REFRESH EVERYTHING
    // =====================================================

    const refreshAll = useCallback(async () => {

        await Promise.all([
            fetchLatest(),
            fetchEnergy(),
        ]);

    }, [
        fetchLatest,
        fetchEnergy
    ]);


    // =====================================================
    // DEBUG
    // =====================================================

    useEffect(() => {

        console.log(
            "ACTIVE DEVICE:",
            selectedDeviceId
        );

    }, [
        selectedDeviceId
    ]);


    // =====================================================
    // CONTEXT
    // =====================================================

    return (
        <InverterContext.Provider
            value={{

                data,
                setData,

                lastUpdated,
                setLastUpdated,

                energy,
                setEnergy,

                energyCharts,
                setEnergyCharts,

                devices,
                setDevices,

                selectedDeviceId,

                // IMPORTANT:
                // Components should use selectDevice,
                // not setSelectedDeviceId directly.
                setSelectedDeviceId:
                    selectDevice,

                refreshDevices:
                    fetchDevices,

                refreshLatest:
                    fetchLatest,

                refreshEnergy:
                    fetchEnergy,

                refreshAll,
            }}
        >
            {children}
        </InverterContext.Provider>
    );
}


// =====================================================
// HOOK
// =====================================================

export function useInverter() {

    return useContext(
        InverterContext
    );
}