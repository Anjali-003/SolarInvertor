import {
  createContext,
  useContext,
  useEffect,
  useState
} from "react";

import { io } from "socket.io-client";

const VendorDeviceContext =
  createContext();

export function VendorDeviceProvider({
  children
}) {

  const [selectedDevice,
    setSelectedDevice] =
    useState(null);

  const [data,
    setData] =
    useState(null);

  const [lastUpdated,
    setLastUpdated] =
    useState(null);

  // ----------------------------------
  // Fetch latest data for selected device
  // ----------------------------------

  useEffect(() => {

    if (!selectedDevice) return;

    const token =
      localStorage.getItem(
        "vendorToken"
      );

    const fetchLatest =
      async () => {

        try {

          const res =
            await fetch(
              `http://localhost:3000/api/vendor/devices/${selectedDevice.id}/latest`,
              {
                headers: {
                  Authorization:
                    `Bearer ${token}`
                }
              }
            );

          const json =
            await res.json();

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

          setLastUpdated(
            fixedTimestamp
          );

        } catch (err) {

          console.error(
            "Latest fetch failed",
            err
          );

        }
      };

    fetchLatest();

  }, [selectedDevice]);

  // ----------------------------------
  // Socket for selected device
  // ----------------------------------

  useEffect(() => {

    if (!selectedDevice) return;

    const token =
      localStorage.getItem(
        "vendorToken"
      );

    const socket =
      io(
        "http://localhost:3000",
        {
          auth: {
            token
          }
        }
      );

    socket.on(
      "connect",
      () => {

        console.log(
          "Vendor socket connected"
        );

        socket.emit(
          "joinDevice",
          selectedDevice.imei
        );
      }
    );

    socket.on(
      "inverterData",
      (newData) => {

        setData(
          { ...newData }
        );

        const fixedTimestamp =
          newData.TIMESTAMP?.replace(
            /^(\d{4}-\d{2}-\d{2})(\d{2}:\d{2}:\d{2})$/,
            "$1 $2"
          );

        setLastUpdated(
          fixedTimestamp
        );
      }
    );

    socket.on(
      "disconnect",
      () => {

        console.log(
          "Vendor socket disconnected"
        );

      }
    );

    return () => {
      socket.disconnect();
    };

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

  return useContext(
    VendorDeviceContext
  );

}