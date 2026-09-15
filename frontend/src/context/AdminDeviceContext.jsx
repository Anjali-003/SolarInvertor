// =====================================================
// ADMIN DEVICE CONTEXT
//
// This is a copy of VendorDeviceContext.jsx, adapted for
// the admin role:
//   - reads "adminToken" instead of "vendorToken"
//   - calls /api/admin/... instead of /api/vendor/...
//   - persists the selected device under
//     "selectedAdminDevice" instead of
//     "selectedVendorDevice"
//
// The vendor context/pages are untouched — this is an
// additive copy so admins get the same device dashboard
// functionality vendors already have.
// =====================================================

import {
    createContext,
    useContext,
    useEffect,
    useState,
    useCallback,
} from "react";

const AdminDeviceContext = createContext(null);

export function AdminDeviceProvider({ children }) {
    const [selectedDevice, setSelectedDevice] = useState(() => {
        try {
            return JSON.parse(
                localStorage.getItem("selectedAdminDevice") || "null"
            );
        } catch (error) {
            console.error(
                "Failed to read selected admin device:",
                error
            );

            return null;
        }
    });

    const [data, setData] = useState(null);

    const [lastUpdated, setLastUpdated] = useState(null);

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState(null);

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

    const EMPTY_CUF = {
        today: null,
        monthly: null,
        yearly: null,
    };

    const [energy, setEnergy] = useState(EMPTY_ENERGY);

    const [energyCharts, setEnergyCharts] =
        useState(EMPTY_CHARTS);

    const [cuf, setCuf] = useState(EMPTY_CUF);

    const [chartData, setChartData] = useState([]);

    const [chartMeta, setChartMeta] = useState({
        total: null,
        unit: null,
        label: null,
        range: null,
    });

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

        const token = localStorage.getItem("adminToken");

        if (!token) {
            setError("Admin authentication token not found");
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const res = await fetch(
                // `http://localhost:3000/api/admin/devices/${selectedDevice.id}/latest`,
                // VPSCHANGE
                                `/api/admin/devices/${selectedDevice.id}/latest`,

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
             *
             * LKWH / LKWL come from the device as two 16-bit
             * halves of a 32-bit total generation counter —
             * combine them the same way the user dashboard does.
             * ----------------------------------------------------
             */
            const lkwh = Number(json.LKWH) || 0;
            const lkwl = Number(json.LKWL) || 0;

            const combinedLKWH =
                (((lkwh & 0xFFFF) << 16) | (lkwl & 0xFFFF)) >>> 0;

            setData({
                ...json,
                LKWH: combinedLKWH,
            });

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
                "Admin latest device fetch failed:",
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
            localStorage.getItem("adminToken");

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
                // `http://localhost:3000/api/admin/devices/${selectedDevice.id}/energy/summary`,
                // VPSCHANGE
                                `/api/admin/devices/${selectedDevice.id}/energy/summary`,

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
                    "Failed to fetch admin energy"
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

            setCuf(
                json.cuf || {
                    ...EMPTY_CUF
                }
            );

        } catch (err) {

            console.error(
                "Admin energy fetch failed:",
                err
            );

            setEnergy({
                ...EMPTY_ENERGY
            });

            setEnergyCharts({
                ...EMPTY_CHARTS
            });

            setCuf({
                ...EMPTY_CUF
            });
        }

    }, [selectedDevice]);


    /*
     * ============================================================
     * FETCH ENERGY CHART (today / week / month / year, with
     * offset navigation) — mirrors fetchEnergyChart in the
     * user-facing Context.jsx.
     * ============================================================
     */
    const fetchEnergyChart = useCallback(
        async (period, offset = 0) => {

            if (!selectedDevice?.id) {
                setChartData([]);

                setChartMeta({
                    total: null,
                    unit: null,
                    label: null,
                    range: null,
                });

                return null;
            }

            const token = localStorage.getItem("adminToken");

            if (!token) {
                setChartData([]);
                return null;
            }

            try {
                const params = new URLSearchParams({
                    period: String(period),
                    offset: String(offset),
                });

                const res = await fetch(
                    // `http://localhost:3000/api/admin/devices/${selectedDevice.id}/energy/chart?${params.toString()}`,
                    // VPSCHANGE
                                        `/api/admin/devices/${selectedDevice.id}/energy/chart?${params.toString()}`,

                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                const result = await res.json();

                if (!res.ok) {
                    console.error(
                        "Admin chart API error:",
                        result
                    );

                    setChartData([]);

                    return null;
                }

                const nextChart = Array.isArray(result.chart)
                    ? result.chart
                    : [];

                setChartData(nextChart);

                setChartMeta({
                    total: result.total ?? null,
                    unit: result.unit ?? null,
                    label: result.label ?? null,
                    range: result.range ?? null,
                });

                return result;

            } catch (err) {
                console.error(
                    "Admin chart fetch failed:",
                    err
                );

                setChartData([]);

                return null;
            }
        },
        [selectedDevice]
    );


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
            setCuf({
                ...EMPTY_CUF
            });
            setChartData([]);
            setChartMeta({
                total: null,
                unit: null,
                label: null,
                range: null,
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
    const handleSetSelectedDevice = useCallback((device) => {
        setSelectedDevice(device);

        if (device) {
            localStorage.setItem(
                "selectedAdminDevice",
                JSON.stringify(device)
            );
        } else {
            localStorage.removeItem(
                "selectedAdminDevice"
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

        setCuf({
            ...EMPTY_CUF
        });

        setChartData([]);

        setChartMeta({
            total: null,
            unit: null,
            label: null,
            range: null,
        });

        setError(null);
    }, []);

    /*
     * ============================================================
     * CONTEXT VALUE
     * ============================================================
     */
    const value = {
        selectedDevice,

        setSelectedDevice:
            handleSetSelectedDevice,

        data,
        setData,

        energy,
        setEnergy,

        cuf,
        setCuf,

        energyCharts,
        setEnergyCharts,

        chartData,
        chartMeta,
        fetchEnergyChart,

        lastUpdated,
        setLastUpdated,

        loading,
        error,

        refresh: fetchLatest,

        refreshLatest:
            fetchLatest,

        refreshEnergy:
            fetchEnergy,

        refreshAll,
    };

    return (
        <AdminDeviceContext.Provider value={value}>
            {children}
        </AdminDeviceContext.Provider>
    );
}

/*
 * ================================================================
 * CONSUMER HOOK
 * ================================================================
 */
export function useAdminDevice() {
    const context = useContext(AdminDeviceContext);

    if (!context) {
        throw new Error(
            "useAdminDevice must be used inside AdminDeviceProvider"
        );
    }

    return context;
}
