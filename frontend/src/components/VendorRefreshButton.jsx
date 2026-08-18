import { useState } from "react";
import { useVendorDevice } from "../context/VendorDeviceContext";
import P from "../theme/colors";

export default function VendorRefreshButton() {
    const { refreshAll } = useVendorDevice();

    const [refreshing, setRefreshing] = useState(false);

    const handleRefresh = async () => {
        if (refreshing) return;

        setRefreshing(true);

        try {
            await refreshAll();
        } catch (err) {
            console.error(
                "Vendor refresh failed:",
                err
            );
        } finally {
            setRefreshing(false);
        }
    };

    return (
        <button
            type="button"
            onClick={handleRefresh}
            disabled={refreshing}
            title="Refresh data"
            aria-label="Refresh data"
            style={{
                position: "absolute",
                right: 64,
                top: "50%",
                transform: "translateY(-50%)",

                width: 42,
                height: 42,

                border: "none",
                borderRadius: "50%",

                background: "transparent",

                cursor: refreshing
                    ? "default"
                    : "pointer",

                color: P.textPrimary,

                fontSize: 22,

                opacity: refreshing
                    ? 0.5
                    : 1,

                WebkitTapHighlightColor:
                    "transparent",
            }}
        >
            {refreshing ? "⟳" : "↻"}
        </button>
    );
}