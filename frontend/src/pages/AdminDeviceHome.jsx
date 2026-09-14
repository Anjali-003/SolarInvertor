import {
    useEffect,
    useState
} from "react";

import { useNavigate } from "react-router-dom";
import { useAdminDevice } from "../context/AdminDeviceContext";

import AdminDeviceFooter from "../components/AdminDeviceFooter";
import AdminDevicePageHeader from "../components/AdminDevicePageHeader";
import DeviceInfo from "../components/DeviceInfo";
import PowerFlowCard from "../components/PowerFlowCard";
import GenerationSummary from "../components/GenerationSummary";
import CUFSummary from "../components/CUFSummary";
import GenerationChartCard from "../components/GenerationChartCard";

import PageBackground from "../components/PageBackground";
import { sanitizeReading, isValidReading } from "../utils/sanitizeReading";


export default function AdminDeviceHome() {

    const navigate = useNavigate();

    // =====================================================
    // CONTEXT
    // =====================================================

    const {
        data,
        lastUpdated,

        energy,
        cuf,

        selectedDevice,

        refreshEnergy,
        refreshLatest,

        chartData,
        chartMeta,
        fetchEnergyChart

    } = useAdminDevice();

    const devices = selectedDevice ? [selectedDevice] : [];
    const selectedDeviceId = selectedDevice?.id;


    // =====================================================
    // CHART STATE
    // =====================================================

    const [chartMode, setChartMode] =
        useState("today");

    const [refreshing, setRefreshing] =
        useState(false);


    const [todayOffset, setTodayOffset] =
        useState(0);

    const [weekOffset, setWeekOffset] =
        useState(0);

    const [monthOffset, setMonthOffset] =
        useState(0);

    const [yearOffset, setYearOffset] =
        useState(0);


    // =====================================================
    // RESET CHART NAVIGATION WHEN DEVICE CHANGES
    // =====================================================

    useEffect(() => {

        setChartMode("today");

        setTodayOffset(0);
        setWeekOffset(0);
        setMonthOffset(0);
        setYearOffset(0);

    }, [
        selectedDeviceId
    ]);


    // =====================================================
    // CURRENT ACTIVE CHART OFFSET
    // =====================================================

    const activeOffset =

        chartMode === "today"
            ? todayOffset

        : chartMode === "week"
            ? weekOffset

        : chartMode === "month"
            ? monthOffset

        : chartMode === "year"
            ? yearOffset

        : 0;


    // =====================================================
    // FETCH CHART
    // =====================================================

    useEffect(() => {

        if (
            !selectedDeviceId ||
            !fetchEnergyChart
        ) {
            return;
        }


        fetchEnergyChart(
            chartMode,
            activeOffset
        );

    }, [
        chartMode,
        activeOffset,
        selectedDeviceId,
        fetchEnergyChart
    ]);


    // =====================================================
    // MANUAL REFRESH
    // =====================================================

    const handleRefreshEnergy =
        async () => {

            if (refreshing) {
                return;
            }


            try {

                setRefreshing(true);


                await Promise.all([

                    refreshLatest?.(),

                    refreshEnergy?.(),

                    fetchEnergyChart?.(
                        chartMode,
                        activeOffset
                    )

                ]);

            } catch (err) {

                console.error(
                    "Energy refresh failed:",
                    err
                );

            } finally {

                setRefreshing(false);
            }
        };


    // =====================================================
    // PARAMETER HELPER
    // =====================================================

    const getParameterValue =
        (parameter) => {

            return (
                data?.[parameter] ??
                "--"
            );
        };


    // =====================================================
    // DC POWER
    //
    // DCV1 × DCI1 = Watts
    // Convert Watts -> kW
    // =====================================================

    const getDCPower = () => {

        const voltage =
            Number(
                data?.DCV1
            );

        const current =
            Number(
                data?.DCI1
            );


        if (
            !isValidReading(voltage, "voltage") ||
            !isValidReading(current, "current")
        ) {

            return "--";
        }


        return (
            voltage *
            current /
            1000
        ).toFixed(3);
    };


    // =====================================================
    // SOLAR POWER
    //
    // PPOW = Watts
    // Convert to kW
    // =====================================================

    const getSolarPower = () => {

        const power =
            Number(
                data?.PPOW
            );


        if (
            !isValidReading(power, "powerW")
        ) {

            return "--";
        }


        return (
            power /
            1000
        ).toFixed(3);
    };


    // =====================================================
    // TOTAL GENERATION
    // =====================================================

    const totalGeneration =
        sanitizeReading(
            getParameterValue("LKWH"),
            "energyKWh"
        );


    // =====================================================
    // NO DEVICE SELECTED
    // =====================================================

    if (!selectedDevice) {
        return (
            <PageBackground>
                <div
                    style={{
                        minHeight: "100vh",
                        paddingBottom: 90,
                        fontFamily: "'Inter', sans-serif",
                        boxSizing: "border-box",
                    }}
                >
                    <AdminDevicePageHeader title="HOME" />

                    <div
                        style={{
                            padding: 20,
                            textAlign: "center",
                        }}
                    >
                        <p style={{ color: "#fff" }}>
                            No device selected. Go back and pick a device.
                        </p>

                        <button
                            onClick={() => navigate("/admin/devices")}
                            style={{
                                marginTop: 12,
                                padding: "12px 20px",
                                border: "none",
                                borderRadius: 50,
                                background: "#f59e0b",
                                color: "#fff",
                                fontWeight: 700,
                                cursor: "pointer",
                            }}
                        >
                            Go to All Devices
                        </button>
                    </div>

                    <AdminDeviceFooter />
                </div>
            </PageBackground>
        );
    }


    // =====================================================
    // PAGE
    // =====================================================

    return (

        <PageBackground>

            <div
                style={{
                    minHeight:
                        "100vh",

                    paddingBottom:
                        "90px",

                    fontFamily:
                        "'Inter', sans-serif",

                    width:
                        "100%",

                    boxSizing:
                        "border-box",

                    // "clip" instead of "hidden" so the sticky header
                    // in DeviceInfo keeps working (see PageBackground).
                    overflowX:
                        "clip"
                }}
            >


                {/* =================================================
                    DEVICE SUMMARY
                ================================================= */}

                <DeviceInfo
                    data={
                        data
                    }

                    lastUpdated={
                        lastUpdated
                    }

                    devices={
                        devices
                    }

                    selectedDeviceId={
                        selectedDeviceId
                    }

                    stickyTop={
                        0
                    }
                />


                {/* =================================================
                    MAIN CONTENT
                ================================================= */}

                <div
                    style={{
                        width:
                            "100%",

                        maxWidth:
                            520,

                        margin:
                            "0 auto",

                        padding:
                            "0 20px 20px",

                        boxSizing:
                            "border-box"
                    }}
                >


                    {/* =================================================
                        POWER FLOW
                    ================================================= */}

                    <PowerFlowCard

                        dcPower={
                            getDCPower()
                        }

                        solarPower={
                            getSolarPower()
                        }

                        st3={
                            data?.ST3
                        }

                    />


                    {/* =================================================
                        GENERATION SUMMARY
                    ================================================= */}

                    <GenerationSummary

                        energy={
                            energy
                        }

                        total={
                            totalGeneration
                        }

                    />


                    {/* =================================================
                        CUF SUMMARY
                    ================================================= */}

                    <CUFSummary

                        cuf={
                            cuf
                        }

                    />


                    {/* =================================================
                        GENERATION CHART
                    ================================================= */}

                    <GenerationChartCard

                        data={
                            data
                        }

                        chartMode={
                            chartMode
                        }

                        setChartMode={
                            setChartMode
                        }

                        chartData={
                            chartData
                        }

                        chartMeta={
                            chartMeta
                        }


                        // ---------------------------------------------
                        // TODAY
                        // ---------------------------------------------

                        todayOffset={
                            todayOffset
                        }

                        setTodayOffset={
                            setTodayOffset
                        }


                        // ---------------------------------------------
                        // WEEK
                        // ---------------------------------------------

                        weekOffset={
                            weekOffset
                        }

                        setWeekOffset={
                            setWeekOffset
                        }


                        // ---------------------------------------------
                        // MONTH
                        // ---------------------------------------------

                        monthOffset={
                            monthOffset
                        }

                        setMonthOffset={
                            setMonthOffset
                        }


                        // ---------------------------------------------
                        // YEAR
                        // ---------------------------------------------

                        yearOffset={
                            yearOffset
                        }

                        setYearOffset={
                            setYearOffset
                        }


                        // ---------------------------------------------
                        // REFRESH
                        // ---------------------------------------------

                        refreshing={
                            refreshing
                        }

                        handleRefreshEnergy={
                            handleRefreshEnergy
                        }

                    />


                    {/* =================================================
                        CO2 SAVED / TREES PLANTED
                    ================================================= */}

                    


                </div>


                {/* =================================================
                    FOOTER
                ================================================= */}

                <AdminDeviceFooter />


            </div>

        </PageBackground>
    );
}