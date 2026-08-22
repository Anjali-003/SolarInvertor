// import {
//   createContext,
//   useContext,
//   useEffect,
//   useState
// } from "react";

// const VendorDeviceContext = createContext();

// export function VendorDeviceProvider({ children }) {

//   const [selectedDevice, setSelectedDevice] = useState(null);

//   const [data, setData] = useState(null);

//   const [lastUpdated, setLastUpdated] = useState(null);

//   useEffect(() => {

//     if (!selectedDevice) {
//       setData(null);
//       setLastUpdated(null);
//       return;
//     }

//     const token = localStorage.getItem("vendorToken");

//     const fetchLatest = async () => {

//       try {

//         const res = await fetch(
//           `http://localhost:3000/api/vendor/devices/${selectedDevice.id}/latest`,
//           //VPSCHANGE
//                     // `/api/vendor/devices/${selectedDevice.id}/latest`,

//           {
//             headers: {
//               Authorization: `Bearer ${token}`
//             }
//           }
//         );

//         const json = await res.json();

//         if (!res.ok) {
//           console.log(json);
//           return;
//         }

//         setData(json);

//         const fixedTimestamp =
//           json.TIMESTAMP?.replace(
//             /^(\d{4}-\d{2}-\d{2})(\d{2}:\d{2}:\d{2})$/,
//             "$1 $2"
//           );

//         setLastUpdated(fixedTimestamp);

//       } catch (err) {

//         console.error("Latest fetch failed", err);

//       }

//     };

//     // Initial fetch
//     fetchLatest();

//     // Poll every 60 seconds
//     const interval = setInterval(fetchLatest, 60000);

//     return () => clearInterval(interval);

//   }, [selectedDevice]);

//   return (

//     <VendorDeviceContext.Provider
//       value={{
//         selectedDevice,
//         setSelectedDevice,
//         data,
//         setData,
//         lastUpdated,
//         setLastUpdated
//       }}
//     >
//       {children}
//     </VendorDeviceContext.Provider>

//   );
// }

// export function useVendorDevice() {
//   return useContext(VendorDeviceContext);
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
//     // const [selectedDevice, setSelectedDevice] = useState(null);
//     const [selectedDevice, setSelectedDevice] = useState(() => {
//     try {
//         return JSON.parse(
//             localStorage.getItem("selectedVendorDevice") || "null"
//         );
//     } catch (error) {
//         console.error(
//             "Failed to read selected vendor device:",
//             error
//         );

//         return null;
//     }
// });

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
//             // let timestamp = json?.TIMESTAMP ?? null;

//             /*
//              * If the API returns:
//              *
//              * 2026-08-12T070336
//              *
//              * convert it to:
//              *
//              * 2026-08-12 07:03:36
//              */
//             // if (timestamp) {
//             //     timestamp = timestamp.replace(
//             //         /^(\d{4}-\d{2}-\d{2})T?(\d{2})(\d{2})(\d{2})$/,
//             //         "$1 $2:$3:$4"
//             //     );
//             // }

//             // setLastUpdated(timestamp);

//             const createdAt = json.created_at;

// if (createdAt) {
//     const normalizedCreatedAt =
//         createdAt.includes("T")
//             ? createdAt
//             : createdAt.replace(" ", "T");

//     const parsedDate = new Date(normalizedCreatedAt);

//     if (!Number.isNaN(parsedDate.getTime())) {
//         setLastUpdated(parsedDate.toISOString());
//     } else {
//         console.error(
//             "Invalid created_at received from API:",
//             createdAt
//         );
//         setLastUpdated(null);
//     }
// } else {
//     setLastUpdated(null);
// }

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
//         fetchLatest();

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






import {
    createContext,
    useContext,
    useEffect,
    useState,
    useCallback,
} from "react";

const VendorDeviceContext = createContext(null);

export function VendorDeviceProvider({ children }) {
    // const [selectedDevice, setSelectedDevice] = useState(null);
    const [selectedDevice, setSelectedDevice] = useState(() => {
    try {
        return JSON.parse(
            localStorage.getItem("selectedVendorDevice") || "null"
        );
    } catch (error) {
        console.error(
            "Failed to read selected vendor device:",
            error
        );

        return null;
    }
});

    const [data, setData] = useState(null);

    const [lastUpdated, setLastUpdated] = useState(null);

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState(null);

    // const [energy, setEnergy] = useState(null);
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

const [energy, setEnergy] = useState(EMPTY_ENERGY);

const [energyCharts, setEnergyCharts] =
    useState(EMPTY_CHARTS);

//     const fetchEnergy = useCallback(async () => {
//     if (!selectedDevice?.id) {
//         setEnergy(null);
//         return;
//     }

//     const token = localStorage.getItem("vendorToken");

//     if (!token) {
//         return;
//     }

//     try {
//         const res = await fetch(
//             `http://localhost:3000/api/vendor/devices/${selectedDevice.id}/energy`,
//             {
//                 headers: {
//                     Authorization: `Bearer ${token}`,
//                 },
//             }
//         );

//         const json = await res.json();

//         if (!res.ok) {
//             throw new Error(
//                 json?.error ||
//                 json?.message ||
//                 "Failed to fetch energy"
//             );
//         }

//         setEnergy(json);

//     } catch (err) {
//         console.error(
//             "Vendor energy fetch failed:",
//             err
//         );

//         setEnergy(null);
//     }
// }, [selectedDevice]);


    /*
     * ============================================================
     * FETCH LATEST DEVICE DATA
     * ============================================================
     */
    const fetchLatest = useCallback(async () => {
        if (!selectedDevice?.id) {
            setData(null);
            setLastUpdated(null);
            return;
        }

        const token = localStorage.getItem("vendorToken");

        if (!token) {
            setError("Vendor authentication token not found");
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const res = await fetch(
                `http://localhost:3000/api/vendor/devices/${selectedDevice.id}/latest`,
                // VPSCHANGE
                // `/api/vendor/devices/${selectedDevice.id}/latest`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const json = await res.json();

            if (!res.ok) {
                throw new Error(
                    json?.message ||
                    "Failed to fetch latest device data"
                );
            }

            /*
             * ----------------------------------------------------
             * STORE DEVICE DATA
             * ----------------------------------------------------
             */
            setData(json);

            /*
             * ----------------------------------------------------
             * STORE DEVICE TIMESTAMP
             *
             * IMPORTANT:
             * Use the timestamp coming from the device/API.
             *
             * Do NOT use:
             * new Date().toISOString()
             *
             * because that would represent the frontend polling
             * time instead of the actual device message time.
             * ----------------------------------------------------
             */
            // let timestamp = json?.TIMESTAMP ?? null;

            /*
             * If the API returns:
             *
             * 2026-08-12T070336
             *
             * convert it to:
             *
             * 2026-08-12 07:03:36
             */
            // if (timestamp) {
            //     timestamp = timestamp.replace(
            //         /^(\d{4}-\d{2}-\d{2})T?(\d{2})(\d{2})(\d{2})$/,
            //         "$1 $2:$3:$4"
            //     );
            // }

            // setLastUpdated(timestamp);

            const createdAt = json.created_at;

if (createdAt) {
    const normalizedCreatedAt =
        createdAt.includes("T")
            ? createdAt
            : createdAt.replace(" ", "T");

    const parsedDate = new Date(normalizedCreatedAt);

    if (!Number.isNaN(parsedDate.getTime())) {
        setLastUpdated(parsedDate.toISOString());
    } else {
        console.error(
            "Invalid created_at received from API:",
            createdAt
        );
        setLastUpdated(null);
    }
} else {
    setLastUpdated(null);
}

        } catch (err) {
            console.error(
                "Vendor latest device fetch failed:",
                err
            );

            setError(
                err?.message ||
                "Failed to fetch device data"
            );

        } finally {
            setLoading(false);
        }
    }, [selectedDevice]);



    
const fetchEnergy = useCallback(async () => {

    if (!selectedDevice?.id) {
        setEnergy({
            ...EMPTY_ENERGY
        });

        setEnergyCharts({
            ...EMPTY_CHARTS
        });

        return;
    }

    const token =
        localStorage.getItem("vendorToken");

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
            `http://localhost:3000/api/vendor/devices/${selectedDevice.id}/energy/summary`,
                        // `/api/vendor/devices/${selectedDevice.id}/energy/summary`,

            {
                method: "GET",

                headers: {
                    Authorization:
                        `Bearer ${token}`,
                },
            }
        );

        const json =
            await res.json();

        if (!res.ok) {
            throw new Error(
                json?.error ||
                json?.message ||
                "Failed to fetch vendor energy"
            );
        }

        setEnergy(
            json.energy || {
                ...EMPTY_ENERGY
            }
        );

        setEnergyCharts(
            json.charts || {
                ...EMPTY_CHARTS
            }
        );

    } catch (err) {

        console.error(
            "Vendor energy fetch failed:",
            err
        );

        setEnergy({
            ...EMPTY_ENERGY
        });

        setEnergyCharts({
            ...EMPTY_CHARTS
        });
    }

}, [selectedDevice]);


const refreshAll = useCallback(async () => {
    await Promise.all([
        fetchLatest(),
        fetchEnergy(),
    ]);
}, [
    fetchLatest,
    fetchEnergy,
]);

    /*
     * ============================================================
     * FETCH WHEN DEVICE CHANGES
     * ============================================================
     */
    // useEffect(() => {
    //     if (!selectedDevice?.id) {
    //         setData(null);
    //         setLastUpdated(null);
    //         setError(null);
    //         setLoading(false);

    //         return;
    //     }

    //     /*
    //      * Initial fetch
    //      */
    //     fetchLatest();

    //     /*
    //      * Poll every 60 seconds
    //      */
    //     const interval = setInterval(() => {
    //         fetchLatest();
    //     }, 60000);

    //     /*
    //      * Cleanup
    //      */
    //     return () => {
    //         clearInterval(interval);
    //     };

    // }, [selectedDevice, fetchLatest]);



//     useEffect(() => {
//     if (!selectedDevice?.id) {
//         setData(null);
//         setEnergy(null);
//         setLastUpdated(null);
//         setError(null);
//         setLoading(false);

//         return;
//     }

//     fetchLatest();
//     fetchEnergy();

//     const interval = setInterval(() => {
//         fetchLatest();
//         fetchEnergy();
//     }, 60000);

//     return () => {
//         clearInterval(interval);
//     };

// }, [
//     selectedDevice,
//     fetchLatest,
//     fetchEnergy
// ]);


useEffect(() => {

    if (!selectedDevice?.id) {

        setData(null);
        setLastUpdated(null);
        setEnergy({
            ...EMPTY_ENERGY
        });
        setEnergyCharts({
            ...EMPTY_CHARTS
        });
        setError(null);
        setLoading(false);

        return;
    }


    // Initial fetch

    fetchLatest();
    fetchEnergy();


    // Refresh every 60 seconds

    const interval = setInterval(() => {

        fetchLatest();
        fetchEnergy();

    }, 60000);


    return () => {
        clearInterval(interval);
    };

}, [
    selectedDevice,
    fetchLatest,
    fetchEnergy
]);

    /*
     * ============================================================
     * HANDLE DEVICE CHANGE
     * ============================================================
     */
    // const handleSetSelectedDevice = useCallback((device) => {
    //     setSelectedDevice(device);

    //     /*
    //      * Clear old device data immediately.
    //      *
    //      * This prevents the previous inverter's data from
    //      * temporarily appearing while the new device is loading.
    //      */
    //     setData(null);
    //     setLastUpdated(null);
    //     setError(null);
    // }, []);

//     const handleSetSelectedDevice = useCallback((device) => {
//     setSelectedDevice(device);

//     if (device) {
//         localStorage.setItem(
//             "selectedVendorDevice",
//             JSON.stringify(device)
//         );
//     } else {
//         localStorage.removeItem(
//             "selectedVendorDevice"
//         );
//     }

//     setData(null);
//     setEnergy(null);
//     setLastUpdated(null);
//     setError(null);
// }, []);


const handleSetSelectedDevice = useCallback((device) => {
    setSelectedDevice(device);

    if (device) {
        localStorage.setItem(
            "selectedVendorDevice",
            JSON.stringify(device)
        );
    } else {
        localStorage.removeItem(
            "selectedVendorDevice"
        );
    }

    // Clear old device data immediately
    setData(null);
    setLastUpdated(null);

    setEnergy({
        ...EMPTY_ENERGY
    });

    setEnergyCharts({
        ...EMPTY_CHARTS
    });

    setError(null);
}, []);

    /*
     * ============================================================
     * CONTEXT VALUE
     * ============================================================
     */
    // const value = {
    //     /*
    //      * Selected device
    //      */
    //     selectedDevice,
    //     setSelectedDevice: handleSetSelectedDevice,

    //     /*
    //      * Latest device data
    //      */
    //     data,
    //     setData,

    //     /*
    //      * Timestamp from device/API
    //      */
    //     lastUpdated,
    //     setLastUpdated,

    //     /*
    //      * Loading / error state
    //      */
    //     loading,
    //     error,

    //     /*
    //      * Manual refresh
    //      */
    //     refresh: fetchLatest,
    // };


    const value = {
    selectedDevice,

    setSelectedDevice:
        handleSetSelectedDevice,

    data,
    setData,

    energy,
    setEnergy,

    energyCharts,
    setEnergyCharts,

    lastUpdated,
    setLastUpdated,

    loading,
    error,

    refresh: fetchLatest,

    refreshEnergy:
        fetchEnergy,

    refreshAll,
};

    return (
        <VendorDeviceContext.Provider value={value}>
            {children}
        </VendorDeviceContext.Provider>
    );
}

/*
 * ================================================================
 * CONSUMER HOOK
 * ================================================================
 */
export function useVendorDevice() {
    const context = useContext(VendorDeviceContext);

    if (!context) {
        throw new Error(
            "useVendorDevice must be used inside VendorDeviceProvider"
        );
    }

    return context;
}