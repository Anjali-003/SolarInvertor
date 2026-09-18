import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import PageBackground from "../components/PageBackground";
import { useInverter } from "../context/Context";
import P from "../theme/colors";
import { clearDeviceMeta, getDeviceMeta } from "../utils/deviceMeta";

// How long (ms) a press has to be held before it counts as
// a "long press" and opens the delete option.
const LONG_PRESS_MS = 500;

// =====================================================
// MY DEVICES (SAVED DEVICES)
//
// Card fields, per the reference screenshot:
//
//   - Nickname            -> from localStorage (deviceMeta),
//                            NOT stored in the DB
//   - "Serial No." line    -> this is actually the IMEI,
//                            fetched from the DB
//   - Device Type          -> from localStorage (deviceMeta),
//                            NOT stored in the DB
//   - Rating               -> DB (devices.rated_capacity_kw)
//   - Total Generation     -> DB (latest cumulative kWh
//                            reading from energy_history)
//   - Added on             -> from localStorage (deviceMeta),
//                            captured client-side when the
//                            device was added
// =====================================================

const API_BASE = "http://localhost:3000";
// VPSCHANGE

export default function MyDevices() {
  const navigate = useNavigate();
  const {
    devices: rawDevices,
    refreshDevices,
    setSelectedDeviceId,
  } = useInverter();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectMode, setSelectMode] = useState(false);

  // Device currently showing the "Delete" long-press option.
  const [deleteTarget, setDeleteTarget] = useState(null);

  // Device id currently being deleted (disables its card).
  const [deletingId, setDeletingId] = useState(null);

  // "Device deleted" black toast, shown briefly after a
  // successful delete.
  const [toastVisible, setToastVisible] = useState(false);

  // =====================================================
  // LOAD DEVICES SAVED ON THIS PHONE
  //
  // No accounts anymore — InverterProvider (context/Context.jsx)
  // already reads every saved IMEI from localStorage
  // (utils/deviceMeta.js) and merges it with a live, public
  // lookup of that device's data. We just refresh it here.
  // =====================================================

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError("");

      try {
        await refreshDevices();
      } catch (err) {
        console.error("Failed to load saved devices:", err);
        setError("Couldn't load your devices. Pull down to try again.");
      } finally {
        setLoading(false);
      }
    };

    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // =====================================================
  // MERGE LIVE FIELDS + LOCAL (NICKNAME / DEVICE TYPE) FIELDS
  // =====================================================

  const devices = useMemo(() => {
    return (rawDevices || []).map((device, index) => {
      const meta = getDeviceMeta(device.imei);

      const ratingLabel = extractRating(meta.model, device.rated_capacity_kw);

      return {
        id: device.imei,
        imei: device.imei,
        nickname: meta.nickname || `Device ${index + 1}`,
        deviceType: meta.deviceType || device.solution || "--",
        rating: ratingLabel,
        totalGeneration: formatGeneration(device.total_generation_kwh),
        addedAt: meta.addedAt || null,
      };
    });
  }, [rawDevices]);

  const handleOpenDevice = (device) => {
    if (selectMode) return;
    setSelectedDeviceId(device.imei);
    navigate("/home");
  };

  // Called on a long-press of a device card — opens the
  // Cancel / Delete / Edit action sheet for that device.
  const handleLongPressDevice = (device) => {
    if (selectMode) return;
    setDeleteTarget(device);
  };

  // Called when "EDIT" is tapped in the action sheet.
  // TODO: point this at whatever screen/modal is meant to
  // edit the nickname + device type (currently no such
  // screen exists in the files shared, so this just closes
  // the sheet for now).
  const handleEditDevice = (device) => {
    setDeleteTarget(null);
    // navigate("/add-device", { state: { editDevice: device } });
  };

  // Confirms deletion of the device the long-press option
  // was opened for. Deletion is purely local — the IMEI is
  // just forgotten on this phone (no backend account to
  // update).
  const handleConfirmDelete = async () => {
    const device = deleteTarget;
    if (!device) return;

    setDeletingId(device.id);
    setDeleteTarget(null);

    try {
      // Nickname / device type / added-on live only in
      // localStorage — this is the actual "delete".
      clearDeviceMeta(device.imei);

      await refreshDevices();

      setToastVisible(true);
      setTimeout(() => setToastVisible(false), 1500);
    } catch (err) {
      console.error("Failed to delete device:", err);
      setError("Couldn't delete the device. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <PageBackground>
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          padding: "22px 20px 24px",
          boxSizing: "border-box",
          background: "rgba(238, 249, 253, 0.60)",
          fontFamily: "'Inter', sans-serif",
        }}
      >
        {/* =================================================
                    HEADER
                ================================================= */}

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "0 0 18px",
            boxSizing: "border-box",
          }}
        >
          <img
            src={logo}
            alt="Statcon Energiaa"
            style={{
              width: 250,
              height: 170,
              objectFit: "contain",
              marginBottom: 8,
            }}
          />

          <div
            style={{
              fontSize: 32,
              fontWeight: 800,
              color: "#050505",
              fontFamily: "'Inter', sans-serif",
            }}
          >
            My Devices
          </div>
        </div>

        {/* =================================================
                    CONTENT
                ================================================= */}

        <div
          style={{
            flex: 1,
            padding: "4px 0 40px",
            boxSizing: "border-box",
          }}
        >
          {loading && <StateMessage text="Loading your devices…" />}

          {!loading && error && <StateMessage text={error} isError />}

          {!loading && !error && devices.length === 0 && (
            <div style={{ marginTop: 40 }}>
              <StateMessage text="No devices added yet." />
            </div>
          )}

          {!loading &&
            !error &&
            devices.map((device) => (
              <DeviceCard
                key={device.id}
                device={device}
                selectMode={selectMode}
                deleting={deletingId === device.id}
                onOpen={() => handleOpenDevice(device)}
                onLongPress={() => handleLongPressDevice(device)}
              />
            ))}
        </div>
      </div>

      {/* =================================================
                DELETE OPTION (shown after a long-press)
            ================================================= */}

      {deleteTarget && (
        <DeviceActionSheet
          device={deleteTarget}
          onCancel={() => setDeleteTarget(null)}
          onDelete={handleConfirmDelete}
          onEdit={() => handleEditDevice(deleteTarget)}
        />
      )}

      {/* =================================================
                "DEVICE DELETED" TOAST
            ================================================= */}

      {toastVisible && <DeletedToast />}
    </PageBackground>
  );
}

// =====================================================
// DEVICE CARD
// =====================================================

function DeviceCard({ device, selectMode, deleting, onOpen, onLongPress }) {
  const [selected, setSelected] = useState(false);

  // =====================================================
  // LONG PRESS DETECTION
  //
  // Works for both touch (mobile) and mouse (desktop).
  // A press held for LONG_PRESS_MS opens the delete
  // option instead of opening the device.
  // =====================================================

  const pressTimer = useRef(null);
  const longPressFired = useRef(false);

  const startPress = () => {
    if (selectMode || deleting) return;
    longPressFired.current = false;

    pressTimer.current = setTimeout(() => {
      longPressFired.current = true;
      onLongPress();
    }, LONG_PRESS_MS);
  };

  const cancelPress = () => {
    if (pressTimer.current) {
      clearTimeout(pressTimer.current);
      pressTimer.current = null;
    }
  };

  const handleClick = () => {
    // Swallow the click that follows a long-press so it
    // doesn't also open the device.
    if (longPressFired.current) {
      longPressFired.current = false;
      return;
    }

    if (selectMode) {
      setSelected((v) => !v);
      return;
    }
    onOpen();
  };

  const handleShare = async (e) => {
    e.stopPropagation();

    const shareText = `${device.nickname} — IMEI ${device.imei}`;

    if (navigator.share) {
      try {
        await navigator.share({ title: device.nickname, text: shareText });
      } catch (err) {
        // user cancelled share sheet — ignore
      }
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(shareText).catch(() => {});
    }
  };

  return (
    <div
      onClick={handleClick}
      onMouseDown={startPress}
      onMouseUp={cancelPress}
      onMouseLeave={cancelPress}
      onTouchStart={startPress}
      onTouchEnd={cancelPress}
      onTouchMove={cancelPress}
      onContextMenu={(e) => e.preventDefault()}
      style={{
        width: "100%",
        background: P.surface,
        borderRadius: 18,
        padding: "18px 20px",
        marginBottom: 16,
        boxShadow: P.shadowCardLg,
        border: selected
          ? `2px solid ${P.borderStrong}`
          : `1px solid ${P.border}`,
        boxSizing: "border-box",
        cursor: "pointer",
        opacity: deleting ? 0.5 : 1,
        userSelect: "none",
        WebkitUserSelect: "none",
        WebkitTapHighlightColor: "transparent",
        transition: "opacity 0.2s",
      }}
    >
      {/* NICKNAME */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
        }}
      >
        <div>
          <div
            style={{
              fontSize: 22,
              fontWeight: 800,
              color: "#090909",
              fontFamily: "'Inter', sans-serif",
              lineHeight: 1.3,
            }}
          >
            {device.nickname}
          </div>
        </div>
      </div>

      <div
        style={{
          fontSize: 17,
          color: "#111111",
          marginTop: 5,
          fontFamily: "'Inter', sans-serif",
          overflowWrap: "anywhere",
        }}
      >
        Serial: {device.imei}
      </div>

      <div
        style={{
          fontSize: 16,
          color: "#999999",
          marginTop: 7,
          fontFamily: "'Inter', sans-serif",
        }}
      >
        Added on: {formatAddedOn(device.addedAt)}
      </div>

      <div
        style={{
          fontSize: 17,
          color: "#111111",
          marginTop: 9,
          fontFamily: "'Inter', sans-serif",
        }}
      >
        Type: {device.deviceType}
      </div>

      <div
        style={{
          fontSize: 17,
          color: "#111111",
          marginTop: 6,
          fontFamily: "'Inter', sans-serif",
        }}
      >
        Rating: {device.rating}
      </div>
    </div>
  );
}

function MetricColumn({ value, label, color }) {
  return (
    <div style={{ minWidth: 0 }}>
      <div
        style={{
          fontSize: 14,
          fontWeight: 700,
          color: color || P.textPrimary,
          fontFamily: "'DM Sans', sans-serif",
          overflowWrap: "anywhere",
        }}
      >
        {value}
      </div>
      <div
        style={{
          fontSize: 10,
          letterSpacing: 0.4,
          color: P.textLight,
          marginTop: 3,
          fontFamily: "'Inter', sans-serif",
        }}
      >
        {label}
      </div>
    </div>
  );
}

// =====================================================
// DEVICE ACTION SHEET
//
// Opens when a device card is long-pressed. Small centered
// dialog — serial (IMEI) as title, "What would you like to
// do?" as the message, and CANCEL / DELETE / EDIT as flat
// text actions — matching the reference screenshot. Tapping
// outside (the dim backdrop) also cancels.
// =====================================================

function DeviceActionSheet({ device, onCancel, onDelete, onEdit }) {
  return (
    <div
      onClick={onCancel}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.45)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 2000,
        padding: 24,
        boxSizing: "border-box",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: 320,
          background: P.surface,
          borderRadius: 10,
          padding: "22px 20px 8px",
          boxSizing: "border-box",
          fontFamily: "'Inter', sans-serif",
          boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
        }}
      >
        <div
          style={{
            fontSize: 17,
            fontWeight: 700,
            color: P.textPrimary,
            marginBottom: 10,
            overflowWrap: "anywhere",
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          {device.imei}
        </div>

        <div
          style={{
            fontSize: 14,
            color: P.textMuted,
            marginBottom: 22,
          }}
        >
          What would you like to do?
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            paddingBottom: 8,
          }}
        >
          <button type="button" onClick={onCancel} style={actionSheetBtn}>
            CANCEL
          </button>

          <div style={{ display: "flex", gap: 22 }}>
            <button type="button" onClick={onDelete} style={actionSheetBtn}>
              DELETE
            </button>
            <button type="button" onClick={onEdit} style={actionSheetBtn}>
              EDIT
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const actionSheetBtn = {
  border: "none",
  background: "transparent",
  padding: "10px 2px",
  fontSize: 13,
  fontWeight: 700,
  letterSpacing: 0.4,
  color: "#2F6FD1",
  cursor: "pointer",
  fontFamily: "'Inter', sans-serif",
  WebkitTapHighlightColor: "transparent",
};

// =====================================================
// "DEVICE DELETED" TOAST
//
// Small black pill, shown briefly after a successful
// delete, then auto-dismisses.
// =====================================================

function DeletedToast() {
  return (
    <div
      style={{
        position: "fixed",
        left: "50%",
        bottom: 100,
        transform: "translateX(-50%)",
        background: "rgba(0,0,0,0.85)",
        color: "#fff",
        padding: "12px 24px",
        borderRadius: 24,
        fontSize: 14,
        fontWeight: 600,
        fontFamily: "'Inter', sans-serif",
        boxShadow: "0 6px 18px rgba(0,0,0,0.3)",
        zIndex: 2100,
        whiteSpace: "nowrap",
      }}
    >
      Device deleted
    </div>
  );
}

function StateMessage({ text, isError }) {
  return (
    <div
      style={{
        textAlign: "center",
        padding: "30px 10px",
        color: isError ? P.textErrorMsg : P.textSecond,
        fontSize: 14,
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {text}
    </div>
  );
}

// =====================================================
// HELPERS
// =====================================================

const headerPillBtn = {
  width: 40,
  height: 40,
  borderRadius: 20,
  border: `1px solid ${P.border}`,
  background: P.surface,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: 22,
  color: P.textPrimary,
  cursor: "pointer",
  boxShadow: "0 4px 14px rgba(0,0,0,0.12)",
  WebkitTapHighlightColor: "transparent",
};

// Pulls a "3KW" style rating out of a model string like
// "Energiaa X3 - 3KW". Falls back to the DB's rated
// capacity when no model is on file.
function extractRating(model, ratedCapacityKw) {
  if (model) {
    const match = model.match(/(\d+(\.\d+)?\s?KW)/i);
    if (match) {
      return match[1].replace(/\s+/g, "").toUpperCase();
    }
  }

  if (ratedCapacityKw !== undefined && ratedCapacityKw !== null) {
    const num = Number(ratedCapacityKw);
    if (!Number.isNaN(num)) {
      return `${num}KW`;
    }
  }

  return "--";
}

function formatGeneration(totalGenerationKwh) {
  const num = Number(totalGenerationKwh);
  if (
    totalGenerationKwh === undefined ||
    totalGenerationKwh === null ||
    Number.isNaN(num)
  ) {
    return "--";
  }
  return `${num.toFixed(1)} kWh`;
}

function formatAddedOn(isoString) {
  if (!isoString) return "--";

  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) return "--";

  const datePart = date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const timePart = date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });

  return `${datePart} • ${timePart}`;
}
