import { useEffect, useState } from "react";
import axios from "axios";

export default function useVendorDeviceData(deviceId) {

    const [data, setData] = useState({});
    const [loading, setLoading] = useState(true);
    const [lastUpdated, setLastUpdated] = useState(null);

    useEffect(() => {

        if (!deviceId) return;

        fetchData();

        const interval =
            setInterval(fetchData, 10000);

        return () =>
            clearInterval(interval);

    }, [deviceId]);

    async function fetchData() {

        try {

            const token =
                localStorage.getItem(
                    "vendorToken"
                );

            // const res =
            //     await axios.get(
            //         `http://localhost:3000/api/vendor/messages/${deviceId}`,
            //         {
            //             headers: {
            //                 Authorization:
            //                     `Bearer ${token}`,
            //             },
            //         }
            //     );

            const res =
                await axios.get(
                    `http://localhost:3000/api/vendor/devices/${deviceId}/latest`,
                    //VPSCHANGE
                    // "/api/vendor/devices/" + deviceId + "/latest",
                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`,
                        },
                    }
                );

            setData(res.data);

            setLastUpdated(
                new Date().toISOString()
            );

        } catch (err) {

            console.error(err);

        } finally {

            setLoading(false);

        }
    }

    return {
        data,
        loading,
        lastUpdated,
    };
}