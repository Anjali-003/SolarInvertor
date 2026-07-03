import {
  useNavigate,
  useLocation,
  useParams,
} from "react-router-dom";
import P from "../theme/colors";

export default function VendorFooter() {

  const navigate = useNavigate();
  const location = useLocation();

  // id from URL params (works on /vendor/device/:id/* routes)
  const { id: paramId } = useParams();

  // fallback: read from localStorage (works on /vendor route)
  const storedDevice = JSON.parse(
    localStorage.getItem("selectedVendorDevice") || "null"
  );

  const id = paramId || storedDevice?.id;

//   const navItems = [
//     {
//       label: "Fault",
//       path: `/vendor/device/${id}/fault`,
//     },
//     {
//       label: "Home",
//       path: "/vendor",
//     },
//     {
//       label: "Power",
//       path: `/vendor/device/${id}/power`,
//     },
const navItems = [
        {
            label: "Fault",
            path: `/vendor/device/${id}/fault`,

            icon: (
                <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <polygon points="12 2 22 20 2 20 12 2" />
                    <line x1="12" y1="8" x2="12" y2="13" />
                    <circle cx="12" cy="17" r="1" />
                </svg>
            ),
        },


        {
            label: "Home",
            path: "/vendor",

            icon: (
                <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <path d="M3 10.5L12 3l9 7.5" />
                    <path d="M5 9.5V21h14V9.5" />
                </svg>
            ),
        },


        {
            label: "Power",
            path: `/vendor/device/${id}/power`,

            icon: (
                <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                </svg>
            ),
        },

        {
            label: "Profile",
            path: "/vendor/profile",

            icon: (
                <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <circle cx="12" cy="8" r="4" />
                    <path d="M4 21c1.5-4 5-6 8-6s6.5 2 8 6" />
                </svg>
            ),
        },
  ];

  return (
    <div style={{
      background: P.surface,
      position: "fixed",
      bottom: 5,
      left: 16,
      right: 16,
      borderRadius: 18,
      height: 72,
      boxShadow: "0 4px 14px rgba(0,0,0,0.08)",
      borderTop: `1px solid ${P.border}`,
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    }}>
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <div
            key={item.label}
            onClick={() => navigate(item.path)}
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 4,
              cursor: "pointer",
              color: isActive ? P.deepAmber : P.textMuted,
              transition: "0.2s",
            }}
          >
            {/* ICON */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {item.icon}
            </div>

            {/* LABEL */}
            <div style={{
              fontSize: 12,
              fontWeight: isActive ? 700 : 600,
              fontFamily: "'Source Sans Pro', sans-serif",
            }}>
              {item.label}
            </div>
          </div>
        );
      })}
    </div>
  );
}