import { createContext, useContext, useEffect, useState } from "react";

const InverterContext = createContext();

export function InverterProvider({ children }) {
  const [data, setData] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.log("No token found");
      return;
    }

    const fetchLatest = async () => {
      try {
        const res = await fetch(
          // "http://localhost:3000/api/latest-message",
          "/api/latest-message", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const latest = await res.json();

        console.log("Initial Data:", latest);

        // ✅ IMPORTANT: store ONLY payload
        setData(latest.payload);

        // optional timestamp handling (only if exists)
        const fixedTimestamp =
          latest.created_at?.replace("T", " ").split(".")[0];

        setLastUpdated(fixedTimestamp);

      } catch (err) {
        console.log("Initial fetch error:", err);
      }
    };

    fetchLatest();

    const interval = setInterval(fetchLatest, 60000);

    return () => clearInterval(interval);
  }, []);

  return (
    <InverterContext.Provider value={{
      data,
      setData,
      lastUpdated,
      setLastUpdated
    }}>
      {children}
    </InverterContext.Provider>
  );
}

export function useInverter() {
  return useContext(InverterContext);
}