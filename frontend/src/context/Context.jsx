import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";

const InverterContext = createContext();

export function InverterProvider({ children }) {
  const [data, setData] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  // useEffect(() => {
  //   // const socket = io("http://localhost:3000");
  //   const socket = io("http://localhost:3000", {
  //     auth: {
  //       token: localStorage.getItem("token"),
  //     },
  //   });

  //   socket.on("connect", () => {
  //     console.log("Connected to server");
  //   });

  //   socket.on("inverterData", (newData) => {
  //     console.log("Live Data:", newData);
  //     setData({ ...newData });
  //     // setLastUpdated(new Date().toLocaleTimeString());
  //     const fixedTimestamp = newData.TIMESTAMP.replace(
  //       /^(\d{4}-\d{2}-\d{2})(\d{2}:\d{2}:\d{2})$/,
  //       "$1 $2"
  //     );

  //     setLastUpdated(fixedTimestamp);
  //     // setLastUpdated(newData.TIMESTAMP);
  //   });

  //   socket.on("disconnect", () => {
  //     console.log("Disconnected");
  //   });

  //   return () => socket.disconnect();
  // }, []);

  useEffect(() => {

  const token = localStorage.getItem("token");

  if (!token) {
    console.log("No token found");
    return;
  }

  const socket = io("http://localhost:3000", {
    auth: {
      token,
    },
  });

  socket.on("connect", () => {
    console.log("✅ Connected");
  });

  socket.on("inverterData", (newData) => {

    setData({ ...newData });

    const fixedTimestamp =
      newData.TIMESTAMP?.replace(
        /^(\d{4}-\d{2}-\d{2})(\d{2}:\d{2}:\d{2})$/,
        "$1 $2"
      );

    setLastUpdated(fixedTimestamp);
  });

  socket.on("disconnect", () => {
    console.log("❌ Disconnected");
  });

  return () => socket.disconnect();

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