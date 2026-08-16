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


import {
    createContext,
    useContext,
    useEffect,
    useState,
    useCallback
} from "react";

const InverterContext = createContext();

export function InverterProvider({ children }) {

    const [data, setData] = useState({});

    const [lastUpdated, setLastUpdated] =
        useState(null);

    const [energy, setEnergy] =
        useState({
            today: 0,
            monthly: 0,
            yearly: 0
        });

    const [energyCharts, setEnergyCharts] =
        useState({
            today: [],
            monthly: [],
            yearly: []
        });

    // =====================================================
    // FETCH ENERGY
    // =====================================================

    const fetchEnergy = useCallback(async () => {

        const token =
            localStorage.getItem("token");

        if (!token) {
            console.log("No token found");
            return;
        }

        try {

            const res = await fetch(
                "http://localhost:3000/api/energy/summary",
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }
            );

            const result =
                await res.json();

            if (!res.ok) {

                console.log(
                    "Energy API error:",
                    result
                );

                return;
            }

            setEnergy(
                result.energy || {
                    today: 0,
                    monthly: 0,
                    yearly: 0
                }
            );

            setEnergyCharts(
                result.charts || {
                    today: [],
                    monthly: [],
                    yearly: []
                }
            );

        } catch (err) {

            console.log(
                "Energy fetch error:",
                err
            );
        }

    }, []);


    // =====================================================
    // INITIAL LOAD
    // =====================================================

    useEffect(() => {

        const token =
            localStorage.getItem("token");

        if (!token) {
            console.log("No token found");
            return;
        }


        // =================================================
        // FETCH LATEST INVERTER DATA
        // =================================================

        const fetchLatest = async () => {

            try {

                const res = await fetch(
                    "http://localhost:3000/api/latest-message",
                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`
                        }
                    }
                );

                const latest =
                    await res.json();

                console.log(
                    "Initial Data:",
                    latest
                );

                if (!res.ok) {

                    console.log(
                        "Latest API error:",
                        latest
                    );

                    return;
                }

                setData(
                    latest.payload
                );

                setLastUpdated(
                    latest.created_at
                );

            } catch (err) {

                console.log(
                    "Initial fetch error:",
                    err
                );
            }
        };


        // Initial calls

        fetchLatest();
        fetchEnergy();


        // =================================================
        // AUTOMATIC REFRESH
        // =================================================

        const interval =
            setInterval(() => {

                fetchLatest();
                fetchEnergy();

            }, 60000);


        return () =>
            clearInterval(interval);

    }, [fetchEnergy]);


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

                // IMPORTANT
                refreshEnergy: fetchEnergy
            }}
        >
            {children}
        </InverterContext.Provider>
    );
}


export function useInverter() {

    return useContext(
        InverterContext
    );
}







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