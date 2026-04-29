// import { createContext, useContext, useState } from "react";

// const InverterContext = createContext();

// export function InverterProvider({ children }) {
//   const [data, setData] = useState(null);

//   return (
//     <InverterContext.Provider value={{ data, setData }}>
//       {children}
//     </InverterContext.Provider>
//   );
// }

// export function useInverter() {
//   return useContext(InverterContext);
// }

import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";

const InverterContext = createContext();

export function InverterProvider({ children }) {
  const [data, setData] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    const socket = io("http://localhost:3000");

    socket.on("connect", () => {
      console.log("✅ Connected to server");
    });

    socket.on("inverterData", (newData) => {
      console.log("Live Data:", newData);
      setData({ ...newData });
      setLastUpdated(new Date().toLocaleTimeString());
    });

    socket.on("disconnect", () => {
      console.log("❌ Disconnected");
    });

    return () => socket.disconnect();
  }, []);

  return (
    <InverterContext.Provider value={{ data, lastUpdated }}>
      {children}
    </InverterContext.Provider>
  );
}

export function useInverter() {
  return useContext(InverterContext);
}