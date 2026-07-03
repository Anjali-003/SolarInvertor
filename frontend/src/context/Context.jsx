// import { createContext, useContext, useEffect, useState } from "react";
// // import { io } from "socket.io-client";

// const InverterContext = createContext();

// export function InverterProvider({ children }) {
//   const [data, setData] = useState(null);
//   const [lastUpdated, setLastUpdated] = useState(null);



//   useEffect(() => {

//     const token = localStorage.getItem("token");

//     if (!token) {
//       console.log("No token found");
//       return;
//     }

//     // ─────────────────────────────────────
//     // INITIAL FETCH
//     // ─────────────────────────────────────
//     const fetchLatest = async () => {

//       try {

//         const res = await fetch(
//           "http://localhost:3000/api/latest-message",
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );

//         const latest = await res.json();

//         console.log("Initial Data:", latest);

//         setData(latest);

//         // timestamp formatting
//         const fixedTimestamp =
//           latest.TIMESTAMP?.replace(
//             /^(\d{4}-\d{2}-\d{2})(\d{2}:\d{2}:\d{2})$/,
//             "$1 $2"
//           );

//         setLastUpdated(fixedTimestamp);

//       } catch (err) {

//         console.log(
//           "Initial fetch error:",
//           err
//         );
//       }
//     };

//     // call fetch
//     fetchLatest();


// //     const interval = setInterval(() => {
// //     fetchLatest();
// // }, 60000); // every minute

// const interval = setInterval(fetchLatest, 60000);


// return () => { clearInterval(interval);

//     // ─────────────────────────────────────
//     // SOCKET CONNECTION
//     // ─────────────────────────────────────
//   //   const socket = io(
//   //     "http://localhost:3000",
//   //     {
//   //       auth: {
//   //         token,
//   //       },
//   //     }
//   //   );

//   //   socket.on("connect", () => {
//   //     console.log("✅ Connected");
//   //   });

//   //   socket.on(
//   //     "inverterData",
//   //     (newData) => {

//   //       console.log(
//   //         "Realtime Data:",
//   //         newData
//   //       );

//   //       setData({ ...newData });

//   //       const fixedTimestamp =
//   //         newData.TIMESTAMP?.replace(
//   //           /^(\d{4}-\d{2}-\d{2})(\d{2}:\d{2}:\d{2})$/,
//   //           "$1 $2"
//   //         );

//   //       setLastUpdated(
//   //         fixedTimestamp
//   //       );
//   //     }
//   //   );

//   //   socket.on("disconnect", () => {
//   //     console.log("❌ Disconnected");
//   //   });

//   //   return () => socket.disconnect();

//   // }, []);

//     };

// }, []);

//   return (
//     <InverterContext.Provider value={{
//       data,
//       setData,
//       lastUpdated,
//       setLastUpdated
//     }}>
//       {children}
//     </InverterContext.Provider>
//   );
// }

// export function useInverter() {
//   return useContext(InverterContext);
// }

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
        const res = await fetch("http://localhost:3000/api/latest-message", {
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