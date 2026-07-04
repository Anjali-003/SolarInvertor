import {
  createContext,
  useContext,
  useEffect,
  useState
} from "react";

const VendorDeviceContext = createContext();

export function VendorDeviceProvider({ children }) {

  const [selectedDevice, setSelectedDevice] = useState(null);

  const [data, setData] = useState(null);

  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {

    if (!selectedDevice) {
      setData(null);
      setLastUpdated(null);
      return;
    }

    const token = localStorage.getItem("vendorToken");

    const fetchLatest = async () => {

      try {

        const res = await fetch(
          // `http://localhost:3000/api/vendor/devices/${selectedDevice.id}/latest`,
                    `/api/vendor/devices/${selectedDevice.id}/latest`,

          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        const json = await res.json();

        if (!res.ok) {
          console.log(json);
          return;
        }

        setData(json);

        const fixedTimestamp =
          json.TIMESTAMP?.replace(
            /^(\d{4}-\d{2}-\d{2})(\d{2}:\d{2}:\d{2})$/,
            "$1 $2"
          );

        setLastUpdated(fixedTimestamp);

      } catch (err) {

        console.error("Latest fetch failed", err);

      }

    };

    // Initial fetch
    fetchLatest();

    // Poll every 60 seconds
    const interval = setInterval(fetchLatest, 60000);

    return () => clearInterval(interval);

  }, [selectedDevice]);

  return (

    <VendorDeviceContext.Provider
      value={{
        selectedDevice,
        setSelectedDevice,
        data,
        setData,
        lastUpdated,
        setLastUpdated
      }}
    >
      {children}
    </VendorDeviceContext.Provider>

  );
}

export function useVendorDevice() {
  return useContext(VendorDeviceContext);
}