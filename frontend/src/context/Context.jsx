// =====================================================
// INVERTER CONTEXT
//
// No accounts anymore. "devices" is whatever is saved in
// this phone's localStorage (see utils/deviceMeta.js) —
// each saved IMEI is merged with a live, public lookup of
// that device's data. selectedDeviceId is the IMEI itself.
// =====================================================

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { getAllSavedDevices } from "../utils/deviceMeta";

const InverterContext = createContext();
//VPSCHANGE
const API_BASE = "http://localhost:3000";
// const API_BASE = "http://213.210.21.49:3001";

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

  const [temporaryDevice, setTemporaryDevice] = useState(null);

  // NOTE: selectedDeviceId is now the IMEI (a string), not a
  // backend user_devices row id — there's no account/login
  // tying devices to a user anymore, "my devices" is whatever
  // is saved in this phone's localStorage (see deviceMeta.js).
  const [selectedDeviceId, setSelectedDeviceId] = useState(() => {
    return localStorage.getItem("selectedDeviceId") || null;
  });

  // =====================================================
  // ENERGY
  // =====================================================

  const [energy, setEnergy] = useState(EMPTY_ENERGY);

  const [energyCharts, setEnergyCharts] = useState(EMPTY_CHARTS);

  const [cuf, setCuf] = useState(EMPTY_CUF);

  const [chartData, setChartData] = useState([]);

  const [chartMeta, setChartMeta] = useState({
    total: null,
    unit: null,
    label: null,
    range: null,
  });

  // =====================================================
  // SELECT DEVICE
  // =====================================================

  const selectDevice = useCallback((deviceId) => {
    if (deviceId == null) {
      return;
    }

    const imei = String(deviceId);

    setSelectedDeviceId(imei);

    localStorage.setItem("selectedDeviceId", imei);
  }, []);

  // =====================================================
  // FETCH DEVICES SAVED ON THIS PHONE
  //
  // No login/account anymore. The IMEI list itself lives
  // in localStorage (deviceMeta.js) — for each saved IMEI
  // we do a public, read-only lookup to get its live
  // device info (rating, latest generation, etc.) and
  // merge it with the locally-saved nickname/location.
  // =====================================================

  const fetchDevices = useCallback(async () => {
    const saved = getAllSavedDevices();

    if (saved.length === 0) {
      setDevices(temporaryDevice ? [temporaryDevice] : []);
      return;
    }

    try {
      const results = await Promise.all(
        saved.map(async (local) => {
          try {
            const res = await fetch(
              `${API_BASE}/api/user/devices/${local.imei}`,
            // VPSCHANGE
                        //   `/api/user/devices/${local.imei}`,

            );

            if (!res.ok) {
              // Still show it (from local data) even if
              // the live lookup failed / device is offline.
              return { ...local, id: local.imei };
            }

            const result = await res.json();

            return {
              ...local,
              ...result.device,
              id: local.imei,
              imei: local.imei,
            };
          } catch (err) {
            return { ...local, id: local.imei };
          }
        }),
      );

      setDevices(temporaryDevice ? [...results, temporaryDevice] : results);
    } catch (err) {
      console.error("Device fetch error:", err);

      setDevices([]);
    }
  }, [temporaryDevice]);

  const openTemporaryDevice = useCallback((device) => {
    const temporary = {
      ...device,
      id: device.imei,
      imei: device.imei,
      nickname: "Temporary Device",
    };

    setTemporaryDevice(temporary);
    setDevices((current) => [
      ...current.filter((item) => item.imei !== temporary.imei),
      temporary,
    ]);
    setSelectedDeviceId(String(temporary.imei));
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
      devices.some((device) => String(device.id) === String(selectedDeviceId));

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

    const firstDeviceId = String(devices[0].id);

    setSelectedDeviceId(firstDeviceId);

    localStorage.setItem("selectedDeviceId", firstDeviceId);
  }, [devices, selectedDeviceId]);

  // =====================================================
  // FETCH LATEST DATA
  // =====================================================

  const fetchLatest = useCallback(async () => {
    if (selectedDeviceId == null) {
      setData({});
      setLastUpdated(null);

      return;
    }

    try {
      const res = await fetch(
        `${API_BASE}/api/latest-message?imei=${selectedDeviceId}`,
        // VPSCHANGE
        // `/api/latest-message?imei=${selectedDeviceId}`,

        {
          method: "GET",
        },
      );

      const result = await res.json();

      if (!res.ok) {
        console.error("Latest API error:", result);

        setData({});
        setLastUpdated(null);

        return;
      }

      const payload = result.payload || {};

      const lkwh = Number(payload.LKWH) || 0;
      const lkwl = Number(payload.LKWL) || 0;

      const combinedLKWH = (((lkwh & 0xffff) << 16) | (lkwl & 0xffff)) >>> 0;

      setData({
        ...payload,
        LKWH: combinedLKWH,
      });

      // setData(
      //     result.payload || {}
      // );

      setLastUpdated(result.created_at || null);
    } catch (err) {
      console.error("Latest fetch error:", err);

      setData({});
      setLastUpdated(null);
    }
  }, [selectedDeviceId]);

  // =====================================================
  // FETCH ENERGY
  // =====================================================

  const fetchEnergy = useCallback(async () => {
    if (selectedDeviceId == null) {
      setEnergy({
        ...EMPTY_ENERGY,
      });

      setEnergyCharts({
        ...EMPTY_CHARTS,
      });

      setCuf({
        ...EMPTY_CUF,
      });

      return;
    }

    try {
      const res = await fetch(
        `${API_BASE}/api/energy/summary?imei=${selectedDeviceId}`,
        // VPSCHANGE
        // `/api/energy/summary?imei=${selectedDeviceId}`,

        {
          method: "GET",
        },
      );

      const result = await res.json();

      if (!res.ok) {
        console.error("Energy API error:", result);

        setEnergy({
          ...EMPTY_ENERGY,
        });

        setEnergyCharts({
          ...EMPTY_CHARTS,
        });

        setCuf({
          ...EMPTY_CUF,
        });

        return;
      }

      setEnergy(
        result.energy || {
          ...EMPTY_ENERGY,
        },
      );

      setEnergyCharts(
        result.charts || {
          ...EMPTY_CHARTS,
        },
      );

      setCuf(
        result.cuf || {
          ...EMPTY_CUF,
        },
      );
    } catch (err) {
      console.error("Energy fetch error:", err);

      setEnergy({
        ...EMPTY_ENERGY,
      });

      setEnergyCharts({
        ...EMPTY_CHARTS,
      });

      setCuf({
        ...EMPTY_CUF,
      });
    }
  }, [selectedDeviceId]);

  // =====================================================
  // DEVICE DATA REFRESH
  // =====================================================

  useEffect(() => {
    if (selectedDeviceId == null) {
      setData({});
      setLastUpdated(null);

      setEnergy({
        ...EMPTY_ENERGY,
      });

      setEnergyCharts({
        ...EMPTY_CHARTS,
      });

      setCuf({
        ...EMPTY_CUF,
      });

      return;
    }

    // Clear old device data
    setData({});
    setLastUpdated(null);

    setEnergy({
      ...EMPTY_ENERGY,
    });

    setEnergyCharts({
      ...EMPTY_CHARTS,
    });

    // Initial fetch
    fetchLatest();
    fetchEnergy();

    // Auto refresh every 60 seconds
    const interval = setInterval(() => {
      fetchLatest();
      fetchEnergy();
    }, 60000);

    return () => clearInterval(interval);
  }, [selectedDeviceId, fetchLatest, fetchEnergy]);

  // =====================================================
  // REFRESH EVERYTHING
  // =====================================================

  const refreshAll = useCallback(async () => {
    await Promise.all([fetchLatest(), fetchEnergy()]);
  }, [fetchLatest, fetchEnergy]);

  // =====================================================
  // FETCH CHART DATA
  // =====================================================

  const fetchEnergyChart = useCallback(
    async (period, offset = 0) => {
      if (selectedDeviceId == null) {
        setChartData([]);

        setChartMeta({
          total: null,
          unit: null,
          label: null,
          range: null,
        });

        return null;
      }

      try {
        const params = new URLSearchParams({
          imei: String(selectedDeviceId),

          period: String(period),

          offset: String(offset),
        });

        const res = await fetch(
          `${API_BASE}/api/energy/chart?${params.toString()}`,
        // VPSCHANGE
        // `/api/energy/chart?${params.toString()}`,
          {
            method: "GET",
          },
        );

        const result = await res.json();

        if (!res.ok) {
          console.error("Chart API error:", result);

          setChartData([]);

          return null;
        }

        const nextChart = Array.isArray(result.chart) ? result.chart : [];

        setChartData(nextChart);

        setChartMeta({
          total: result.total ?? null,

          unit: result.unit ?? null,

          label: result.label ?? null,

          range: result.range ?? null,
        });

        return result;
      } catch (err) {
        console.error("Chart fetch error:", err);

        setChartData([]);

        return null;
      }
    },
    [selectedDeviceId],
  );

  // =====================================================
  // DEBUG
  // =====================================================

  useEffect(() => {
    console.log("ACTIVE DEVICE:", selectedDeviceId);
  }, [selectedDeviceId]);

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

        cuf,
        setCuf,

        energyCharts,
        setEnergyCharts,

        chartData,
        chartMeta,
        fetchEnergyChart,

        devices,
        setDevices,

        selectedDeviceId,

        // IMPORTANT:
        // Components should use selectDevice,
        // not setSelectedDeviceId directly.
        setSelectedDeviceId: selectDevice,

        openTemporaryDevice,

        refreshDevices: fetchDevices,

        refreshLatest: fetchLatest,

        refreshEnergy: fetchEnergy,

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
  return useContext(InverterContext);
}
